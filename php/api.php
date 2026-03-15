<?php
// --- CONFIGURATION ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// --- INCLUDES & SESSION ---
include("../db/db_connect.php");
session_start();

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

function recup_activite_with_status($id_f, $conn)
{
    $sql = "SELECT 
        activites.*, 
        reservation_activites.nb_membre,
        reservation_activites.id_reservation_activite,
        reservation_activites.status,
    CASE 
        WHEN reservation_activites.status IS NULL THEN 0 
        ELSE reservation_activites.status
        END AS status
FROM activites
LEFT JOIN reservation_activites 
    ON reservation_activites.id_activite = activites.id 
    AND reservation_activites.id_famille = ?
ORDER BY activites.id";

    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id_f);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}


function recup_activites($conn){
    $sql = "SELECT * FROM activites";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($stmt);

    $res = mysqli_stmt_get_result($stmt);
    
    return mysqli_fetch_all($res, MYSQLI_ASSOC);
}

function recup_reservation_order($conn){
    $sql = "SELECT * FROM reservation_activites ORDER BY id_reservation_activite";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];


}

function recup_familles($conn){
    $sql = "SELECT * FROM familles";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);

    $ts_familles = [];

    while($ligne = mysqli_fetch_assoc($res)){
        $famille = $ligne;
        $id_payeur = $ligne['id_payeur'];
        $id_f = $ligne['id_famille'];
        $famille['payeur'] = recup_utilisateur_byId_payeur($id_payeur, $conn);
        $famille['reservation'] = recup_activite_with_status($id_f, $conn);
        $ts_familles[] = $famille; 
    }
    
    return $ts_familles; // Retourne maintenant TOUTE la liste
}


//les variables communes à plusieurs actions
$prenom = isset($data['prenom']) ? $data['prenom'] : '';
$nom = isset($data['nom']) ? $data['nom'] : '';
$mail = isset($data['mail']) ? $data['mail'] : '';
$id_f = isset($data['id_famille']) ? $data['id_famille'] : '';
$adresse = isset($data['adresse']) ? $data['adresse'] : '';
$code_postal = isset($data['code_postal']) ? $data['code_postal'] : '';
$telephone = isset($data['telephone']) ? $data['telephone'] : '';
$ville = isset($data['ville']) ? $data['ville'] : '';
$date_naissance = isset($data['date_naissance']) ? $data['date_naissance'] : '12-12-2000';
$id_activite = isset($data['id_activite']) ? $data['id_activite'] : '';
$nb_membre = isset($data['nb_membre']) ? $data['nb_membre'] : '';
$password = isset($data['password']) ? $data['password'] : '';
$id_reservation = isset($data['id_reservation']) ? $data['id_reservation'] : '';
$cap_act = isset($data['cap_act']) ? $data['cap_act'] : '0';
$status_res = isset($data['status_res']) ? $data['status_res'] : '0';


function get_full_data($conn) {
    if (isset($_SESSION['famille'])) {
        $id_famille = $_SESSION['famille'];
        $infos = recup_famille_byId($id_famille, $conn);
        $infos['membres'] = membres_famille_byId($id_famille, $conn);
        $infos['reservations'] = recup_activite_with_status($id_famille, $conn);
        $infos['session'] = "famille";
        $infos['payeur'] = recup_utilisateur_byId_payeur($infos['id_payeur'], $conn);}
    elseif (isset($_SESSION['admin'])) {
        $infos['les_familles'] = recup_familles($conn);
        $infos['session'] = "admin";
        $infos['activites'] = recup_activites($conn);
        $infos['file_attente_activite'] = recup_reservation_order($conn);

    }
    else{
        $infos = "NoSession";
    }
    return $infos;
}
//on hache mot de passe pr securité


//CONNEXION


if ($action === 'session') {

    $msg = "Données récupérées avec succès";
    $status = "success";
    $_SESSION['admin'] = "";

}

 elseif ($action == "desinscription_activite") {
    $stmt = mysqli_prepare($conn, "DELETE FROM reservation_activites WHERE id_reservation_activite = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id_reservation);

    if (mysqli_stmt_execute($stmt)) {
        $status = "success";
        $msg = "Activité désinscrite";

        $stmt = mysqli_prepare($conn, "UPDATE activites SET cap_act = cap_act + ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, 'ii', $nb_membre, $id_activite);

        if (mysqli_stmt_execute($stmt)) {
            $status = "success";
            $msg = "Activité désinscrite + activité maj";
        } else {
            $status = "failed";
            $msg = "l'activité na pas pu se mettre à jour";
        }

    } else {
        $status = "failed";
        $msg = "Erreur lors de la désinscription";
    }
} elseif ($action == "inscription_activite") {

    if ($nb_membre > $cap_act) {
        $status = "failed";
        $msg = "Trop de gens";
    } else {
        $stmt = mysqli_prepare($conn, "INSERT INTO reservation_activites (id_famille,id_activite,nb_membre,status) VALUES (?,?,?,?)");
        mysqli_stmt_bind_param($stmt, 'iiii', $id_f, $id_activite, $nb_membre, $status_res);
        if (mysqli_stmt_execute($stmt)) {
            $status = "success";
            $msg = "Activité réservée";

            $stmt = mysqli_prepare($conn, "UPDATE activites SET cap_act = cap_act- ? WHERE id = ?");
            mysqli_stmt_bind_param($stmt, 'ii', $nb_membre, $id_activite);
            if (mysqli_stmt_execute($stmt)) {
                $status = "success";
                $msg = "Activité réservée + activités MAJ";
            } else {
                $status = "failed";
                $msg = "Erreur lors de l'update de l'activité";
            }
        } else {
            $status = "success";
            $msg = "Activité réservée";
        }
    }
}
 elseif ($action === 'connexion_famille') {

    $stmt = mysqli_prepare($conn, "SELECT * FROM familles WHERE mail = ?");
    mysqli_stmt_bind_param($stmt, 's', $mail);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);

    if ($res && mysqli_num_rows($res) > 0) {
        $famille = mysqli_fetch_assoc($res);

        if (password_verify($password, $famille['password'])) {
            $status = "success";
            $_SESSION['famille'] = $famille['id_famille'];
            $infos = "Connexion famille réussie";
        } else {
            $status = "failed";
            $infos = "Mot de passe incorrect";
        }
    } else {
        $stmt_m = mysqli_prepare($conn, "SELECT * FROM membres WHERE mail = ?");
        mysqli_stmt_bind_param($stmt_m, 's', $mail);
        mysqli_stmt_execute($stmt_m);
        $res_membre = mysqli_stmt_get_result($stmt_m);

        if ($res_membre && mysqli_num_rows($res_membre) > 0) {
            $membre = mysqli_fetch_assoc($res_membre);

            // Vérification mot de passe pour le membre
            if (password_verify($password, $membre['password'])) {
                $status = "success";
                $infos = [
                    "user" => $membre,
                    "session" => "membre"
                ];
                $_SESSION['membre'] = $infos;
            } else {
                $status = "failed";
                $infos = "Mot de passe incorrect";
            }
        } else {
            $status = "failed";
            $infos = "Utilisateur introuvable";
        }
    }
} 
elseif ($action === 'inscription_famille&payeur'){

    // 1. Vérification existence mail
    $requete = mysqli_prepare($conn, "SELECT id_famille FROM familles WHERE mail = ?");
    mysqli_stmt_bind_param($requete, 's', $mail);
    mysqli_stmt_execute($requete);
    $res_verif = mysqli_stmt_get_result($requete);

    if ($res_verif && mysqli_num_rows($res_verif) > 0) {
        $status = "failed";
        $infos = "Adresse email déjà utilisée";
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
                    $infos = "Inscription réussie !";
                    // On stocke l'ID famille en session pour connecter l'utilisateur direct
                    $_SESSION['famille'] = $nouvel_famille_id;
                } else {
                    $status = 'failed';
                    $infos = "Erreur lors de la liaison famille/utilisateur";
                }
            } else {
                $status = 'failed';
                $infos = "Impossible de créer la famille";
            }
        } else {
            $status = 'failed';
            $infos = "Impossible de créer l'utilisateur payeur";
        }
    }
    
}
elseif ($action == "inscription_user_by_idFamille") {
    $stmt = mysqli_prepare($conn, "INSERT INTO utilisateurs (nom, prenom, date_naissance, id_famille) VALUES (?, ?, ?, ?)");

    mysqli_stmt_bind_param($stmt, 'sssi', $nom, $prenom, $date_naissance, $id_f);

    if (mysqli_stmt_execute($stmt)) {
        $status = "success";
        $infos = "Utilisateur ajouté";
    } else {
        $status = "failed";
        $infos = "Erreur lors de la création";
    }

 }


 elseif ($action === "deconnexion") {
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
    "currentDonnees" =>  get_full_data($conn)
];


echo json_encode($reponse);
