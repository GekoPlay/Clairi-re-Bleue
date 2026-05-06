<?php

function getActivites($conn)
{
    $sql = "SELECT * FROM `activites`";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}

function getActiviteById($conn, $id)
{
    $sql = "SELECT * FROM `activites` WHERE id= ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "i", $id);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_assoc($res) ?: null;
}

function getReservationsActivite($conn)
{
    $sql = "SELECT * FROM `reservation_activites`";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_assoc($res) ?: null;
}


function getReservationsActivitebyId($conn, $id)
{
    $sql = "SELECT * FROM `reservation_activites` WHERE id_reservation_activite= ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "i", $id);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_assoc($res) ?: null;
}

function putReservationActivite($conn, $data) {
    $id_famille = $data["id_famille"];
    $id_activite = $data["id_activite"];
    $nb_membre = $data["nb_membre"];

    $sql = "INSERT INTO reservation_activites (id_famille, id_activite, nb_membre) VALUES (?, ?, ?)";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "iii", $id_famille, $id_activite, $nb_membre);
    
    if (mysqli_stmt_execute($requete)) {
        // Si l'insertion marche, on déduit automatiquement les places
        return UpdateCapActivite($conn, $data,"-");
    }
    return false;
}

function putReservationActiviteWithUpdate($conn, $data) {
    $data_activite = getActiviteById($conn, $data['id_activite']);
    $nb_membre = $data['nb_membre'];

    if (!$data_activite) {
        return "Activité introuvable";
    }

    if ($data_activite['cap_act'] >= $nb_membre) {
        if (putReservationActivite($conn, $data)) {
            return "success";
        } else {
            return "Erreur lors de l'inscription";
        }
    } else {
        if (PutFamilyFiFo($conn, $data)) {
            return "Activité complète, famille ajoutée à la file d'attente";
        } else {
            return "Erreur lors de l'ajout en file d'attente";
        }
    }
}
function deleteReservationActiviteWithUpdate($conn, $data) {
    $cap_act = $data['cap_act']; 
    $id_famille = $data['id_famille'];
    
    if (deleteReservation($conn, $id_famille)) {
        
        UpdateCapActivite($conn, $data, "+");

        $fifos = getActivitesFifo($conn);

        foreach ($fifos as $fifo) {
            $nb_membres_fifo = $fifo['nb_membre'];

            if ($cap_act >= $nb_membres_fifo) {
                
                if (AcceptFifo($conn, $fifo)) {
                    $cap_act -= $nb_membres_fifo;
                    
                    // Décrémenter la capacité en BDD (Optionnel selon votre logique UpdateCapActivite)
                    UpdateCapActivite($conn, $fifo, "-");
                }
            } 
        }
        return true;
    }
    return false;
}

function GetCapaciteActivite($conn,$id_activite){
    $sql = "SELECT cap_act FROM activites WHERE id = ?";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_bind_param($requete,'i',$id_activite);
    mysqli_stmt_execute($requete);
    return mysqli_stmt_get_result($requete);
}

function UpdateCapActivite($conn, $data, $signe) {
    $nb_membre = $data['nb_membre'];
    $id_activite = $data['id_activite'];
    
    // Sécurité : on force le signe à être + ou -
    $operateur = ($signe === '+') ? '+' : '-';

    $sql = "UPDATE activites SET cap_act = cap_act $operateur ? WHERE id = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, 'ii', $nb_membre, $id_activite);
    return mysqli_stmt_execute($requete);
}

function deleteActivite($conn, $id)
{
    try {
        $sql1 = "DELETE FROM reservation_activites WHERE id_activite = ?";
        $stmt1 = mysqli_prepare($conn, $sql1);
        mysqli_stmt_bind_param($stmt1, "i", $id);
        mysqli_stmt_execute($stmt1);

        $sql2 = "DELETE FROM activites WHERE id = ?";
        $stmt2 = mysqli_prepare($conn, $sql2);
        mysqli_stmt_bind_param($stmt2, "i", $id);

        return mysqli_stmt_execute($stmt2);
    } catch (mysqli_sql_exception $e) {
        return false;
    }
}

function addActivite($conn, $data)
{
    $nom = $data['nom'] ?? '';
    $date_f = $data['date_f'] ?? '';
    $date_d = $data['date_d'] ?? '';
    $cap_act = $data['cap_act'] ?? '';
    $prix = $data['prix'] ?? '';
    $description = $data['description'] ?? '';
    $lieu = $data['lieu'] ?? '';

    if (empty($nom) || $cap_act <= 0) {
        return false;
    }

    $sql = "INSERT INTO activites (nom, date_f, date_d, cap_act, prix,lieu,description) VALUES (?, ?, ?, ?, ?,?,?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sssiiss", $nom, $date_f, $date_d, $cap_act, $prix,$lieu,$description);

    return mysqli_stmt_execute($stmt);
}

function deleteReservation($conn, $id_res_activite) {

    $reservation = getReservationsActivitebyId($conn, $id_res_activite);
    $id_famille = $reservation['id_famille'];
 
    $sql = "DELETE FROM reservation_activites WHERE id_famille = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, 'i', $id_famille);
    mysqli_stmt_execute($requete);
    if (mysqli_stmt_execute($requete)) {
        return UpdateCapActivite($conn, $reservation,"+");
    }
    return false;
}



function getActivitesFifo($conn)
{
    $sql = "SELECT 
    fifo.id_famille, 
    fifo.date_inscription,
    fifo.id_attente,
    fifo.nb_membre,

    a.nom AS nom_activite,
    a.prix,
    a.cap_act,
    a.id as id_activite,
    u.id AS id_payeur,
    u.nom AS nom_payeur,
    u.prenom AS prenom_payeur


    
FROM `file_attente_activites` AS fifo
LEFT JOIN familles AS f ON fifo.id_famille = f.id_famille
LEFT JOIN utilisateurs AS u ON f.id_payeur = u.id
LEFT JOIN activites AS a ON fifo.id_activite = a.id
ORDER BY fifo.date_inscription ASC;";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}


function deleteFromFifo($conn, $id) {
    $sql = "DELETE FROM file_attente_activites WHERE id_attente = ?"; 
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    return mysqli_stmt_affected_rows($stmt) > 0;
}


function AcceptFifo($conn, $data) {
    $id_attente = $data['id_attente'];
    
    if (deleteFromFifo($conn, $id_attente)) {
        if (putReservationActivite($conn, $data)) {
            $msg = "success";
        } else {
            $msg = "Erreur lors de la création de la réservation ou de la mise à jour des places";
        }
    } else {
        $msg = "Impossible de supprimer l'élément de la file d'attente";
    }
    
    return $msg;
}


function getParticipantsById($conn,$id){
$sql = "SELECT 
    rs.id_activite,
    rs.nb_membre,
    rs.id_famille, 
    u.nom AS nom_payeur,

    u.prenom AS prenom_payeur
FROM reservation_activites rs
JOIN familles f ON f.id_famille = rs.id_famille
JOIN utilisateurs u ON u.id = f.id_payeur
WHERE rs.id_activite = ?";
 $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "i", $id);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}

function PutFamilyFiFo($conn, $data)
{
    $id_famille       = $data['id_famille'];
    $id_activite      = $data['id_activite'];
    $nb_membre        = $data['nb_membre'];
    $date_inscription = date('Y-m-d H:i:s');

    $sql     = "INSERT INTO file_attente_activites (id_famille, id_activite, nb_membre, date_inscription)
                VALUES (?, ?, ?, ?)";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "iiis", $id_famille, $id_activite, $nb_membre, $date_inscription);
    return mysqli_stmt_execute($requete);
}





function PutEmplacementFiFo($conn, $data)
{
    $id_famille      = $data['id_famille'];
    $num_emplacement = $data['num_emplacement'];
    $date_debut      = date('Y-m-d H:i:s');
    $date_fin        = null;

    $sql     = "INSERT INTO reservation_emplacement (id_famille, num_emplacement, date_debut, date_fin)
                VALUES (?, ?, ?, ?)";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "iiss", $id_famille, $num_emplacement, $date_debut, $date_fin);
    return mysqli_stmt_execute($requete);
}



function getActivitesWithReservations($conn, $id_famille) {
    $sql = "SELECT 
                a.id AS id_activite,
                a.nom,
                a.date_d,
                a.date_f,
                a.prix,
                a.cap_act,
                r.id_reservation_activite,
                IFNULL(r.nb_membre, 0) AS nb_reservations,
                IFNULL((SELECT SUM(nb_membre) FROM reservation_activites WHERE id_activite = a.id), 0) AS total_deja_reserve
            FROM activites a
            LEFT JOIN reservation_activites r ON a.id = r.id_activite AND r.id_famille = ?
            ORDER BY a.date_d ASC";
    
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "i", $id_famille);
    mysqli_stmt_execute($requete);
    $result_activites = mysqli_stmt_get_result($requete);
    $activites = mysqli_fetch_all($result_activites, MYSQLI_ASSOC) ?: [];

    foreach ($activites as &$row) {
        $id_activite = $row['id_activite'];

        $sql2 = "SELECT * FROM file_attente_activites WHERE id_famille = ? AND id_activite = ?";
        $requete2 = mysqli_prepare($conn, $sql2);
        mysqli_stmt_bind_param($requete2, "ii", $id_famille, $id_activite);
        mysqli_stmt_execute($requete2);
        $result2 = mysqli_stmt_get_result($requete2);
        $row['file_attente_activite'] = mysqli_fetch_assoc($result2);
    }
    unset($row);

    return $activites; // ← manquait !
}


function UpdateCapReservationActivite($conn, $data,$nb_membre_modif){
    $id_activite = $data['id_activite'];
    $id_famille = $data['id_famille'];
    
    $sql = "UPDATE reservation_activites SET nb_membre = nb_membre + ? WHERE id_activite = ? AND id_famille = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, 'iii', $nb_membre_modif, $id_activite, $id_famille);

    if (mysqli_stmt_execute($requete)) {
        return UpdateCapActivite($conn, $data, ($nb_membre_modif > 0) ? "-" : "+");
    }
}


function  UpdateReservationActivite($conn, $data,$action){ 
    $data_activite = getActiviteById($conn, $data['id_activite']);
    $data_reservation = getReservationsActivitebyId($conn, $data['id_reservation_activite']);

    $nb_membre = $data['nb_membre'];

    if (!$data_activite) {
        return "Activité introuvable";
    }

    if(!$data_reservation) {
        return "Réservation introuvable";
    }

    if ($action === 'add') {
        if ($data_activite['cap_act'] >= $nb_membre) {
            if (UpdateCapReservationActivite($conn, $data,$nb_membre)) {
                return "success";
            } else {
                return "Activité complète, famille ajoutée à la file d'attente";
            }
        } else {
            if (PutFamilyFiFo($conn, $data)) {
                return "Activité complète, famille ajoutée à la file d'attente";
            } else {
                return "Erreur lors de l'ajout en file d'attente";
            }
        }
    } elseif ($action === 'delete') {
        if($data_reservation['nb_membre'] < $nb_membre) {
            return "Le nombre de membres à retirer dépasse le nombre de membres réservés";
        }else{
        if (UpdateCapReservationActivite($conn, $data,-$nb_membre)) {
            return "success";
        } else {
            return "Erreur lors de la suppression de la réservation ou de la mise à jour des places";
        }
        }
    } else {
        return "Action non reconnue";
    }
}




function getActivitesFifoFamille($conn, $id_famille,$id_activite) {
    $sql = "SELECT * from flie_attente_activite where id_famille = ? and id_activite = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "ii", $id_famille,$id_activite);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}


function UpdateNbMembreFifo($conn, $data,$id){
    $signe = $data['signe'];
    $nb_membre_aj = $data['nb_membre_aj'];   

    if ($signe !== '+' && $signe !== '-') {
        return false; 
    }

    $sql = "UPDATE file_attente_activites SET nb_membre = nb_membre $signe ? WHERE id_attente = ?";
    
    $requete = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($requete, "ii", $nb_membre_aj, $id);
    
    return mysqli_stmt_execute($requete);
}