<?php
session_start();

// --- CONFIGURATION ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// --- INCLUDES & SESSION ---
include("../db/db_connect.php");

// --- RÉCUPÉRATION DES DONNÉES ---
$json_recu = file_get_contents("php://input");
$data = json_decode($json_recu, true);

$status = "error";
$msg = "Action non reconnue";
$action = isset($data['action']) ? $data['action'] : '';


//==============LES GETTEURS===================

function recup_utilisateur_byId_payeur($id, $conn)
{
    $requete = mysqli_prepare($conn, 'SELECT * FROM utilisateurs WHERE id = ?');
    mysqli_stmt_bind_param($requete, 'i', $id);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    $data = mysqli_fetch_assoc($res);
    return $data ?? [];
}
function recup_famille_byId($id, $conn)
{

    $requete = mysqli_prepare($conn, "SELECT * FROM familles WHERE id_famille = ?");
    mysqli_stmt_bind_param($requete, 'i', $id);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    $data = mysqli_fetch_assoc($res);
    return $data ?? [];
}
function membres_famille_byId($id, $conn)
{
    $stmt = mysqli_prepare($conn, "SELECT * FROM utilisateurs WHERE id_famille = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);

    // On récupère le résultat pour utiliser mysqli_fetch_all
    $res = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}
function recup_activite_byId($id, $conn)
{
    $stmt = mysqli_prepare($conn, "SELECT * FROM activites WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);

    $res = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_assoc($res) ?: [];
}


function FIFO_activite($conn){

    $sql = "SELECT * FROM reservation_activites WHERE status = 1 ORDER BY id_reservation_activite";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC);
}





function recup_activite_with_status($id_famille, $conn)
{
    $sql = "SELECT 
    activites.*, 
    familles.*,
    reservation_activites.nb_membre,
    reservation_activites.id_reservation_activite,
    COALESCE(reservation_activites.status, 0) AS status
FROM activites
CROSS JOIN familles 
LEFT JOIN reservation_activites 
    ON reservation_activites.id_activite = activites.id 
    AND reservation_activites.id_famille = familles.id_famille
ORDER BY activites.id, reservation_activites.id_reservation_activite;";

    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    $tab = [];
    $cmpt = 0;
    while ($row = mysqli_fetch_assoc($res)){
        if($row['status'] == 1){
            $cmpt ++;
            $row['pos_fifo'] = $cmpt;
        }
        $tab[] = $row;

    }
    
    return $tab;
}


function recup_activites($conn)
{
    $sql = "SELECT * FROM activites";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($stmt);

    $res = mysqli_stmt_get_result($stmt);

    return mysqli_fetch_all($res, MYSQLI_ASSOC);
}

function recup_reservation_order($conn)
{
    $sql = "SELECT * FROM reservation_activites ORDER BY id_reservation_activite";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}

function recup_familles($conn)
{
    $sql = "SELECT * FROM familles";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);

    $ts_familles = [];

    while ($ligne = mysqli_fetch_assoc($res)) {
        $famille = $ligne;
        $id_payeur = $ligne['id_payeur'];
        $id_famille = $ligne['id_famille'];
        $famille['payeur'] = recup_utilisateur_byId_payeur($id_payeur, $conn);
        $famille['reservation'] = recup_activite_with_status($id_famille, $conn);
        $ts_familles[] = $famille;
    }

    return $ts_familles; // Retourne maintenant TOUTE la liste
}


function recup_fifo_emplacements($conn)
{
    $sql = "SELECT * FROM reservation_emplacement WHERE status IN (-1,1, 2) ORDER BY id_res_empl";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}

function get_activites ($conn)
{
    $sql = "SELECT * FROM activites";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}
function get_familles ($conn)
{
    $sql = "SELECT * FROM familles";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}
function get_reservation_activites ($conn)
{
    $sql = "SELECT * FROM reservation_activites";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}

function get_files_attente_activite($conn,$id_activite){
    $sql = "SELECT * FROM file_attente_activites WHERE id_activite = $id_activite";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];


}
function get_files_attente($conn)
{
    $sql = "SELECT * FROM file_attente_activites";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    $tab = [];
    while ($row = mysqli_fetch_assoc($res)){
        $id_famille = $row['id_famille'];
        $id_activite = $row['id_activite'];
        $row["position_fifo"] = get_position_fifo($conn,$id_famille,$id_activite);
        $tab[] = $row;
    }
    return $tab;
}
function update_activite_cap($nbMembre,$idActivite,$conn,$signe){
        $stmt = mysqli_prepare($conn, "UPDATE activites SET cap_act = cap_act $signe ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, 'ii', $nbMembre, $idActivite);
        if (mysqli_stmt_execute($stmt)) {
            $status = "success";
            $msg = "Activité réservée + activités MAJ";
        } else {
            $status = "failed";
            $msg = "Erreur lors de l'update de l'activité";
        }
}
function get_activite_by_id($conn,$id_activite){
    $sql = "SELECT * FROM activites WHERE id = $id_activite";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_assoc($res);
}

function set_cap_activite($conn,$id_activite,$capaciteDeActivite){
    $sql = "UPDATE activites SET cap_act = $capaciteDeActivite where id = $id_activite";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_execute($requete);
}



function DeFileAReservation($conn,$id_activite){
    $infoActivite = get_activite_by_id($conn,$id_activite);
    $capaciteDeActivite = $infoActivite['cap_act'];
    $sql = "SELECT * FROM file_attente_activites WHERE id_activite = $id_activite ORDER BY id_attente";
    $requete = mysqli_prepare($conn, $sql);
    if (mysqli_stmt_execute($requete)){
        $res = mysqli_stmt_get_result($requete);
        while ($row = mysqli_fetch_assoc($res)){
            if ($row['nb_membre']<= $capaciteDeActivite){
                //on lisncrit
                $id_famille = $row['id_famille'];
                $nb_membre = $row['nb_membre'];

                inscription_reservation($conn,$id_famille,$id_activite,$nb_membre);
                $capaciteDeActivite = $capaciteDeActivite - $nb_membre;
            }else{
                $msg = "pas inscrit ya trop";
            }

        }
        set_cap_activite($conn,$id_activite,$capaciteDeActivite);
    }
}

function inscription_reservation($conn,$id_famille,$id_activite,$nb_membre)
{
    $activite_info = get_activite_by_id($conn,$id_activite);
    $cap_act = $activite_info['cap_act'];
    
    if ($nb_membre > $cap_act) {

        $now = date("Y-m-d H:i:s");
        $requete_fifo = mysqli_prepare($conn, "INSERT INTO file_attente_activites (id_famille,id_activite,nb_membre,date_inscription) VALUES (?,?,?,?)");
        mysqli_stmt_bind_param($requete_fifo, 'iiis', $id_famille, $id_activite, $nb_membre,$now);
        mysqli_stmt_execute($requete_fifo);
        
        
        $msg = $nb_membre ." ".  $cap_act;
        //Ajoute ici a la file attente



    } else {
        $requete = mysqli_prepare($conn, "INSERT INTO reservation_activites (id_famille,id_activite,nb_membre,status) VALUES (?,?,?,2)");
        mysqli_stmt_bind_param($requete, 'iii', $id_famille, $id_activite, $nb_membre);
        
        if (mysqli_stmt_execute($requete)) {
            $status = "success";
            $msg = "Activité réservée";
            update_activite_cap($nb_membre,$id_activite,$conn,"-");
        }
    }
}

function get_reservation_by_idf_ida($conn,$id_famille,$id_activite){
    $sql = "SELECT * FROM reservation_activites WHERE  id_activite = $id_activite and id_famille = $id_famille";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_assoc($res);
}

//les variables communes à plusieurs actions
$prenom = isset($data['prenom']) ? $data['prenom'] : '';
$nom = isset($data['nom']) ? $data['nom'] : '';
$mail = isset($data['mail']) ? $data['mail'] : '';
$id_famille = isset($data['id_famille']) ? $data['id_famille'] : '';
$adresse = isset($data['adresse']) ? $data['adresse'] : '';
$code_postal = isset($data['code_postal']) ? $data['code_postal'] : '';
$telephone = isset($data['telephone']) ? $data['telephone'] : '';
$ville = isset($data['ville']) ? $data['ville'] : '';
$date_naissance = isset($data['date_naissance']) ? $data['date_naissance'] : '12-12-2000';
$date_debut = isset($data['date_debut']) ? $data['date_debut'] : '01-01-0000';
$date_fin = isset($data['date_fin']) ? $data['date_fin'] : '01-01-0000';
$id_activite = isset($data['id_activite']) ? $data['id_activite'] : '';
$nb_membre = isset($data['nb_membre']) ? $data['nb_membre'] : '';
$password = isset($data['password']) ? $data['password'] : '';
$id_reservation = isset($data['id_reservation']) ? $data['id_reservation'] : '';
$cap_act = isset($data['cap_act']) ? $data['cap_act'] : '0';
$status_res = isset($data['status_res']) ? $data['status_res'] : '0';
$clee = isset($data['clee']) ? $data['clee'] : '0';
$typeAction = isset($data['typeAction']) ? $data['typeAction'] : '';

function select_fifo_activite($conn,$id_act){
        $sql_select = "SELECT id_reservation_activite, nb_membre 
                     FROM reservation_activites 
                     WHERE status = 1 AND id_activite = $id_act
                     ORDER BY id_reservation_activite";
    $stmtSelc = mysqli_prepare($conn, $sql_select);
    mysqli_stmt_execute($stmtSelc);
    $result = mysqli_stmt_get_result($stmtSelc);

    $result= mysqli_fetch_assoc($result);
    return $result;
        
}


function get_position_fifo($conn, $id_famille, $id_activite) {
    $infosFifoAttente = get_files_attente_activite($conn, $id_activite);
    $cmpt = 1; 
    
    if ($infosFifoAttente) {
        foreach ($infosFifoAttente as $row) {
            if ($row['id_famille'] == $id_famille) {
                return $cmpt; 
            }
            $cmpt++;
        }
    }
    
    return null; 
}

function get_full_data($conn)
{
    if (isset($_SESSION['famille'])) {

    $infos["activites"] = get_activites($conn);
    $infos["famille"] = get_familles($conn);
    $infos['session'] = "famille";
    $infos['reservation'] = get_reservation_activites($conn);
    $infos['files_attente'] = get_files_attente($conn);
        // $id_famille = $_SESSION['famille'];
        // $infos = recup_famille_byId($id_famille, $conn);
        // $infos['membres'] = membres_famille_byId($id_famille, $conn);


        // $infos['reservations'] = recup_activite_with_status($id_famille, $conn);
        // $infos['session'] = "famille";
        // $infos['payeur'] = recup_utilisateur_byId_payeur($infos['id_payeur'], $conn);
    } elseif (isset($_SESSION['admin'])) {
        $infos['les_familles'] = recup_familles($conn);

        $infos['session'] = "admin";
        $infos['activites'] = recup_activites($conn);
        $infos['file_attente_activite'] = recup_reservation_order($conn);
        $infos['file_attente_reservations'] = recup_fifo_emplacements($conn);
    } elseif (isset($_SESSION['moderator'])) {
        $infos = "moderator";
    } elseif (isset($_SESSION['scrib'])) {
        $infos  = "scrib";
    } else {
        $infos = "NoSession";
    }
    return $infos;
}
//on hache mot de passe pr securité


//CONNEXION


if ($action === 'session') {

    $msg = "Données récupérées avec succès";
    $status = "success";

} elseif ($action == "desinscription_activite") {

    $infosReservation = get_reservation_by_idf_ida($conn,$id_famille,$id_activite);
    if ($infosReservation != null){
        $nb_membre_res = $infosReservation['nb_membre'];

        if ($nb_membre_res > $nb_membre)
            {
                $sql = "UPDATE reservation_activites SET nb_membre = nb_membre - $nb_membre WHERE id_activite = $id_activite and id_famille = $id_famille";
                $requete = mysqli_prepare($conn,$sql);

            }
        else
             {
                $sql = "DELETE FROM reservation_activites WHERE id_activite = $id_activite and id_famille = $id_famille";
                $requete = mysqli_prepare($conn,$sql);
             }

             if(mysqli_stmt_execute($requete)){
                    update_activite_cap($nb_membre,$id_activite,$conn,"+");
                    DeFileAReservation($conn,$id_activite);
            }
    }














    // $query = "SELECT * FROM reservation_activites r
    // JOIN activites a ON r.id_activite = a.id
    // WHERE id_reservation_activite = ?";

    // $stmtSel = mysqli_prepare($conn, $query);
    // mysqli_stmt_bind_param($stmtSel, 'i', $id_reservation);
    // mysqli_stmt_execute($stmtSel);
    // $result = mysqli_stmt_get_result($stmtSel);
    // $infos = mysqli_fetch_assoc($result);
    // $id_act = $infos['id'];

    // if ($infos) {
    //     $sql_del = "DELETE FROM reservation_activites WHERE id_reservation_activite = ?";
    //     $stmtDel = mysqli_prepare($conn, $sql_del);
    //     mysqli_stmt_bind_param($stmtDel, 'i', $id_reservation);
    //     mysqli_stmt_execute($stmtDel);

    //     //MAJ de la cap de lactivité
    //     $cap_act = $infos['cap_act'] + $infos['nb_membre'];;


    //     $sql_select = "SELECT id_reservation_activite, nb_membre 
    //                  FROM reservation_activites 
    //                  WHERE status = 1 AND id_activite = $id_act
    //                  ORDER BY id_reservation_activite";

    //     $sql_fifo = mysqli_prepare($conn, $sql_select);
    //     mysqli_stmt_execute($sql_fifo);
    //     $result_fifo = mysqli_stmt_get_result($sql_fifo);

    //     while ($row = mysqli_fetch_assoc($result_fifo)) {
    //         if ($row['nb_membre'] < $cap_act) {
    //             $idResAct = $row['id_reservation_activite'];

    //             $sql_upt = "UPDATE reservation_activites set status = 2 WHERE id_reservation_activite =  $idResAct";
    //             $res_upt = mysqli_prepare($conn, $sql_upt);
    //             mysqli_stmt_execute($res_upt);
    //             $cap_act = $cap_act - $row['nb_membre'];
    //         }
    //     }

    //     $sql_uptade_act = "UPDATE activites SET cap_act = $cap_act";
    //     $stmtUpt = mysqli_prepare($conn, $sql_uptade_act);
    //     mysqli_stmt_execute($stmtUpt);

    //     // $msg = select_fifo_activite($conn, $infos['id']);
    // }
























    } elseif ($action == "inscription_activite") {


    inscription_reservation($conn,$id_famille,$id_activite,$nb_membre);
    


} elseif ($action === 'connexion_famille') {

    $stmt = mysqli_prepare($conn, "SELECT * FROM familles WHERE mail = ?");
    mysqli_stmt_bind_param($stmt, 's', $mail);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);

    if ($res && mysqli_num_rows($res) > 0) {
        $famille = mysqli_fetch_assoc($res);

        if (password_verify($password, $famille['password'])) {
            $status = "success";
            $_SESSION['famille'] = $famille['id_famille'];
            $msg = "Connexion famille réussie";
        } else {
            $status = "failed";
            $msg = "Mot de passe incorrect";
        }
    } else {
        $stmt_m = mysqli_prepare($conn, "SELECT * FROM equipe_membre WHERE mail = ?");
        mysqli_stmt_bind_param($stmt_m, 's', $mail);
        mysqli_stmt_execute($stmt_m);
        $res_membre = mysqli_stmt_get_result($stmt_m);

        if ($res_membre && mysqli_num_rows($res_membre) > 0) {
            $membre = mysqli_fetch_assoc($res_membre);

            // if (password_verify($password, $membre['password'])) {
            $status = "success";
            if ($membre['role'] == 1) {
                $_SESSION['admin'] = $membre;
            } elseif ($membre['role'] == 2) {
                $_SESSION['moderator'] = $membre;
            } else {
                $_SESSION['scrib'] = $membre;
            }
            // } else {
            //     $status = "failed";
            //     $msg = "Mot de passe incorrect";
            // }
        } else {
            $status = "failed";
            $msg = "Utilisateur introuvable";
        }
    }
} elseif ($action === 'inscription_famille&payeur') {

    // 1. Vérification existence mail
    $requete = mysqli_prepare($conn, "SELECT id_famille FROM familles WHERE mail = ?");
    mysqli_stmt_bind_param($requete, 's', $mail);
    mysqli_stmt_execute($requete);
    $res_verif = mysqli_stmt_get_result($requete);

    if ($res_verif && mysqli_num_rows($res_verif) > 0) {
        $status = "failed";
        $msg = "Adresse email déjà utilisée";
    } else {

        // 2. Création de l'utilisateur payeur
        $sql_payeur = "INSERT INTO utilisateurs (nom, prenom, date_naissance) VALUES (?, ?, ?)";
        $req_p = mysqli_prepare($conn, $sql_payeur);
        mysqli_stmt_bind_param($req_p, 'sss', $nom, $prenom, $date_naissance);

        if (mysqli_stmt_execute($req_p)) {
            $nouvel_user_id = mysqli_insert_id($conn);

            // 3. Hachage du mot de passe
            $password_hache = password_hash($password, PASSWORD_DEFAULT);

            // 4. Création de la famille
            $sql_f = "INSERT INTO familles (mail, password, adresse, telephone, code_postal, id_payeur, ville) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $req_f = mysqli_prepare($conn, $sql_f);
            // Types : sssssis (6 strings, 1 int, 1 string) -> Attention, il y a 7 paramètres !
            mysqli_stmt_bind_param($req_f, 'sssssis', $mail, $password_hache, $adresse, $telephone, $code_postal, $nouvel_user_id, $ville);

            if (mysqli_stmt_execute($req_f)) {
                $nouvel_famille_id = mysqli_insert_id($conn);

                // 5. Mise à jour de l'utilisateur avec son id_famille
                $sql_upd = "UPDATE utilisateurs SET id_famille = ? WHERE id = ?";
                $req_u = mysqli_prepare($conn, $sql_upd);
                mysqli_stmt_bind_param($req_u, 'ii', $nouvel_famille_id, $nouvel_user_id);

                if (mysqli_stmt_execute($req_u)) {
                    $status = "success";
                    $msg = "Inscription réussie !";
                    // On stocke l'ID famille en session pour connecter l'utilisateur direct
                    $_SESSION['famille'] = $nouvel_famille_id;
                } else {
                    $status = 'failed';
                    $msg = "Erreur lors de la liaison famille/utilisateur";
                }
            } else {
                $status = 'failed';
                $msg = "Impossible de créer la famille";
            }
        } else {
            $status = 'failed';
            $msg = "Impossible de créer l'utilisateur payeur";
        }
    }
} elseif ($action == "inscription_user_by_idFamille") {
    $stmt = mysqli_prepare($conn, "INSERT INTO utilisateurs (nom, prenom, date_naissance, id_famille) VALUES (?, ?, ?, ?)");

    mysqli_stmt_bind_param($stmt, 'sssi', $nom, $prenom, $date_naissance, $id_famille);

    if (mysqli_stmt_execute($stmt)) {
        $status = "success";
        $msg = "Utilisateur ajouté";
    } else {
        $status = "failed";
        $msg = "Erreur lors de la création";
    }
} elseif ($action === "accepter") {
    $sql = "";

    if ($typeAction == "ReservationActivite") {
        $sql = "UPDATE reservation_activites SET status = 2 WHERE id_activite = ?";
    } elseif ($typeAction == "ReservationEmplacement") {
        $sql = "UPDATE reservation_emplacement SET status = 2 WHERE num_emplacement = ?";
    } else {
        $msg = "Action non reconnue : " . $typeAction;
    }

    if ($sql != "") {
        $stmt = mysqli_prepare($conn, $sql);

        if ($stmt) {
            mysqli_stmt_bind_param($stmt, 'i', $clee);

            if (mysqli_stmt_execute($stmt)) {
                $status = "success";
                $msg = "Mise à jour réussie (status = 2)";
            } else {
                $msg = "Erreur lors de l'exécution : " . mysqli_error($conn);
            }
            mysqli_stmt_close($stmt);
        } else {
            $msg = "Erreur de préparation : " . mysqli_error($conn);
        }
    }
} elseif ($action === "refuser") {
    $sql = "UPDATE reservation_emplacement SET status = -1 WHERE num_emplacement = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, 'i', $num_emplacement);

    if (mysqli_stmt_execute($stmt)) {
        $status = "success";
        $msg = "refus ok";
    } else {
        $status = "failed";
        $msg = "erreur refus";
    }
} elseif ($action == "reservation_emplacement") {
    $stmt = mysqli_prepare($conn, "INSERT INTO reservation_emplacement (id_famille,numero_emplacement,date_debut,date_fin,status) VALUES (?,?,?,?,1)");
    mysqli_stmt_bind_param($stmt, 'iiss', $id_famille, $num_emplacement, $date_debut, $date_fin);
    if (mysqli_stmt_execute($stmt)) {
        $status = "success";
        $msg = "Activité réservée";
    } else {
        $status = "success";
        $msg = "Activité réservée";
    }
} elseif ($action === "deconnexion") {
    $_SESSION = array();

    session_destroy();

    $status = "success";
    $infos = "Déconnexion réussie";
}

//RETOUR --------------FIN DE PROGRAMME-------------------


$reponse = [
    "status" => $status,
    "msg" => $msg,
    "action" => $action,
    "currentDonnees" =>  get_full_data($conn),
    "fifo" => FIFO_activite($conn)
];


echo json_encode($reponse);
