<?php

//recup toutes reservations emplacements
function getReservationEmplacements($conn) {
    $sql = "SELECT 
    re.id_famille,
    re.num_emplacement,
    re.date_debut,
    re.date_fin,
    re.id_res_empl,
    u.nom as Nom_famille,
    u.prenom as Prenom_payeur
     FROM reservation_emplacement re
     JOIN familles f ON f.id_famille = re.id_famille
     JOIN utilisateurs u ON f.id_payeur = u.id";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}


function getBetweenDateOnEmplacement($conn, $num_emplacement, $date_debut, $date_fin) {
    
    $sql = "SELECT 
                rs.id_famille,
                rs.date_debut,
                rs.date_fin,
                rs.id_res_empl,
                u.nom as Nom_famille,
                u.prenom as Prenom_payeur
            FROM reservation_emplacement rs
            JOIN familles f ON rs.id_famille = f.id_famille
            JOIN utilisateurs u ON u.id = f.id_payeur
            WHERE rs.num_emplacement = ? 
            AND rs.date_debut <= ? 
            AND rs.date_fin >= ?";
            
    $requete = mysqli_prepare($conn, $sql);
    
    mysqli_stmt_bind_param($requete, 'iss', $num_emplacement, $date_fin, $date_debut);
    
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}
function deleteReservationEmplacement($conn,$id){
    $sql = "DELETE FROM reservation_emplacement WHERE id_res_empl = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, 'i', $id);
    return mysqli_stmt_execute($requete);
}


function getBetweenDateOnEmplacementGeneral($conn, $mois) {
    $date = new DateTime($mois . "-01");
    $date_debut = $date->format('Y-m-01 00:00:00');
    $date_fin   = $date->format('Y-m-t 23:59:59');

    // ✅ Récupérer tous les emplacements
    $sql = "SELECT * FROM emplacements";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    $emplacements = mysqli_fetch_all($res, MYSQLI_ASSOC);

    // ✅ Pour chaque emplacement, ajouter ses réservations
    foreach ($emplacements as &$emplacement) {  // ← & pour modifier le tableau
        $emplacement['reservations'] = getBetweenDateOnEmplacement(
            $conn,
            $emplacement['num_emplacement'],
            $date_debut,
            $date_fin
        );
    }

    return $emplacements ?: [];
}









//     $sql = "SELECT 
//     rs.id_famille,
//     rs.date_debut,
//     rs.date_fin,
//     rs.id_res_empl,
//     rs.num_emplacement,
//     u.nom as Nom_famille,
//     u.prenom as Prenom_payeur
// FROM reservation_emplacement rs
// JOIN familles f ON rs.id_famille = f.id_famille
// -- On utilise LEFT JOIN pour ne pas perdre de lignes
// LEFT JOIN utilisateurs u ON u.id = f.id_payeur
// WHERE rs.date_debut <= ? 
// AND rs.date_fin >= ?";
            









function PutReservationsEmplacement($conn,$data){
    $status = 'Impossible';
    $num_emplacement = $data['num_emplacement'];
    $date_debut = $data['date_debut'];
    $date_fin = $data['date_fin'];
    $calendrier = null; // ✅ initialisé par défaut

$resReq1 = getBetweenDateOnEmplacement($conn, $num_emplacement, $date_debut, $date_fin);

if (empty($resReq1)) {
    $status = "pret pr inscription";
    $msg = "Aucune Reservation durant ces dates";
    $resReq2 = PutReservationEmplacementConfirme($conn, $data);
    if ($resReq2) {
        $status = "success";
        $msg = "Inscription reservation emplacement success";
    }
} else {
    $msg = "Il y a des dates non dispos";
    $status = 'compromis';
    $calendrier = findCalendrier($date_debut, $date_fin, $resReq1);
}

$response = [
    "status"     => $status,
    "msg"        => $msg,
    "calendrier" => $calendrier
];

return $response;
}


function findCalendrier($date_debut,$date_fin,$resReq1){
        $dateCourante = new DateTime($date_debut);
        $dateFin = new DateTime($date_fin);

        while ($dateCourante <= $dateFin) {
            $jourStr = $dateCourante->format('Y-m-d');

            $reservationCeJour = null;
            foreach ($resReq1 as $reservation) {
                $debut = new DateTime($reservation['date_debut']);
                $fin   = new DateTime($reservation['date_fin']);
                $jour  = new DateTime($jourStr);

                if ($jour >= $debut && $jour <= $fin) {
                    $reservationCeJour = $reservation; 
                    break;
                }
            }

            $calendrier[] = [
                "date"        => $jourStr,
                "reservation" => $reservationCeJour 
            ];

            $dateCourante->modify('+1 day');
        }
        return $calendrier;
    }





function PutReservationEmplacementConfirme($conn,$data)
{
    $id_famille= $data['id_famille'];
    $num_emplacement = $data['num_emplacement'];
    $date_debut = $data['date_debut'];
    $date_fin = $data['date_fin'];

    $sql     = "INSERT INTO reservation_emplacement (id_famille, num_emplacement, date_debut, date_fin)
                VALUES (?, ?, ?, ?)";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "iiss", $id_famille, $num_emplacement, $date_debut, $date_fin);
    return mysqli_stmt_execute($requete);
}



//recup les emplacements
function getEmplacement($conn){
    $sql = "SELECT * FROM emplacements";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}




function get_reservation_famille($conn, $id_famille){
    $sql = "SELECT 
    re.num_emplacement,
    re.date_debut,
    re.date_fin,
    re.id_res_empl,
    e.nom
    FROM reservation_emplacement re
    JOIN emplacements e ON e.num_emplacement = re.num_emplacement
    WHERE re.id_famille = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "i", $id_famille);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}

?>

