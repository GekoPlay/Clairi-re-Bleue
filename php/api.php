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
$infos = "Action non reconnue";
$action = isset($data['action']) ? $data['action'] : '';


//==============LES GETTEURS===================

function recup_utilisateur_byId_payeur($id, $conn){
    $requete = mysqli_prepare($conn, 'SELECT * FROM utilisateurs WHERE id = ?');
    mysqli_stmt_bind_param($requete, 'i', $id);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    $data = mysqli_fetch_assoc($res);
    return $data ?? [];
}
function recup_famille_byId($id, $conn){

    $requete = mysqli_prepare($conn,"SELECT * FROM familles WHERE id_famille = ?");
    mysqli_stmt_bind_param($requete, 'i', $id);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    $data = mysqli_fetch_assoc($res);
    return $data ?? [];
}
function membres_famille_byId ($id, $conn){
    $stmt = mysqli_prepare($conn, "SELECT * FROM utilisateurs WHERE id_famille = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    
    // On récupère le résultat pour utiliser mysqli_fetch_all
    $res = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}
function recup_activite_byId ($id, $conn){
    $stmt = mysqli_prepare($conn, "SELECT * FROM activites WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    
    $res = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_assoc($res) ?: [];
}
function recup_reservations($conn){
    $sql = "SELECT * FROM reservation_activites 
            JOIN activites ON reservation_activites.id_activite = activites.id";
    
    // 2. Préparation
    $stmt = mysqli_prepare($conn, $sql);
    
    // 3. Exécution
    mysqli_stmt_execute($stmt);
    
    // 4. Récupération du résultat
    $res = mysqli_stmt_get_result($stmt);
    
    $reservations = [];
    
    // 5. Boucle pour transformer les lignes SQL en tableau PHP
    while ($row = mysqli_fetch_assoc($res)) {
        $reservations[] = [
            "id_activite"  => $row['id_activite'],
            "nom_activite" => $row['nom'],
            "prix"         => $row['prix'],
            "date_d"       => $row['date_d'],
            "date_f"       => $row['date_f'],
            "nb_membre"    => $row['nb_membre'],
            "status"       => $row['status'],
        ];
    }
    
    return $reservations;
}

//les variables communes à plusieurs actions
$prenom = isset($data['prenom']) ? $data['prenom'] : '';
$nom = isset($data['nom']) ? $data['nom'] : '';
$mail = isset($data['mail']) ? $data['mail'] : '';
$id_f = isset($data['id_famille']) ? $data['id_famille'] : '';
$adresse = isset($data['adresse']) ? $data['adresse'] : '';
$code_postal = isset($data['code_postal']) ? $data['code_postal'] : '';
$telephone = isset($data['telephone']) ? $data['telephone'] : '';
$ville= isset($data['ville']) ? $data['ville'] : '';
$date_naissance = isset($data['date_naissance']) ? $data['date_naissance'] : '12-12-2000';
$id_activite = isset($data['id_activite']) ? $data['id_activite'] : '';
$nb_membre = isset($data['nb_membre']) ? $data['nb_membre'] : '';
$password = isset($data['password']) ? $data['password'] : '';




//on hache mot de passe pr securité


//CONNEXION


if ($action === 'recuperation_session') {
    if (isset($_SESSION['famille'])) {
        $status = "logged_in";
         $id_famille = $_SESSION['famille'];

        $infos = recup_famille_byId($id_famille, $conn);
        $infos['membres'] = membres_famille_byId($id_famille,$conn);
        $infos['reservations'] = recup_reservations($conn);  
        $infos['session'] = "famille";
        $infos['user'] = recup_utilisateur_byId_payeur($infos['id_payeur'],$conn);
    }elseif (isset($_SESSION['membre'])) {
        $status = "logged_in";
         $infos = $_SESSION['membre'];
    } else {
        $status = "failed";
        $infos = "Mauvaise Sessions";
    }
}

elseif ($action === 'connexion_famille'){
    
    $stmt = mysqli_prepare($conn, "SELECT * FROM familles WHERE mail = ?");
    mysqli_stmt_bind_param($stmt, 's', $mail);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);

    if ($res && mysqli_num_rows($res) > 0){
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

        if($res_membre && mysqli_num_rows($res_membre) > 0){
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
        
        if(mysqli_stmt_execute($req_p)){
            $nouvel_user_id = mysqli_insert_id($conn);

            // 3. Hachage du mot de passe
            $password_hache = password_hash($password, PASSWORD_DEFAULT);

            // 4. Création de la famille
            $sql_f = "INSERT INTO familles (mail, password, adresse, telephone, code_postal, id_payeur, ville) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $req_f = mysqli_prepare($conn, $sql_f);
            // Types : sssssis (6 strings, 1 int, 1 string) -> Attention, il y a 7 paramètres !
            mysqli_stmt_bind_param($req_f, 'sssssis', $mail, $password_hache, $adresse, $telephone, $code_postal, $nouvel_user_id, $ville);
            
            if(mysqli_stmt_execute($req_f)){
                $nouvel_famille_id = mysqli_insert_id($conn);

                // 5. Mise à jour de l'utilisateur avec son id_famille
                $sql_upd = "UPDATE utilisateurs SET id_famille = ? WHERE id = ?";
                $req_u = mysqli_prepare($conn, $sql_upd);
                mysqli_stmt_bind_param($req_u, 'ii', $nouvel_famille_id, $nouvel_user_id);
                
                if(mysqli_stmt_execute($req_u)){
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

elseif ($action == "inscription_user_by_idFamille"){
    $stmt = mysqli_prepare($conn, "INSERT INTO utilisateurs (nom, prenom, date_naissance, id_famille) VALUES (?, ?, ?, ?)");
    
    mysqli_stmt_bind_param($stmt, 'sssi', $nom, $prenom, $date_naissance, $id_f);
    
    if(mysqli_stmt_execute($stmt)){
        $status = "success";
        $infos = "Utilisateur ajouté";
    } else {
        $status = "failed";
        $infos = "Erreur lors de la création";
    }
}

elseif ($action == "inscription_activite"){
    $stmt = mysqli_prepare($conn, "UPDATE reservation_activites SET status = 1 WHERE id_activite = ? AND id_famille = ?");
    
    mysqli_stmt_bind_param($stmt, 'ii', $id_activite, $id_f);
    
    if(mysqli_stmt_execute($stmt)){
        $status = "success";
        $infos = "Activité réservée";
    } else {
        $status = "failed";
        $infos = "Erreur lors de la réservation";
    }
}

elseif ($action == "desinscription_activite"){
    $stmt = mysqli_prepare($conn, "UPDATE reservation_activites SET status = 0 WHERE id_activite = ? AND id_famille = ?");
    mysqli_stmt_bind_param($stmt, 'ii', $id_activite, $id_f);
    
    if(mysqli_stmt_execute($stmt)){
        $status = "success";
        $infos = "Activité désinscrite";
    } else {
        $status = "failed";
        $infos = "Erreur lors de la désinscription";
    }
}

//RETOUR --------------FIN DE PROGRAMME-------------------
$reponse = [
    "status" => $status,
    "infos" => $infos,
    "action" => $action
];


echo json_encode($reponse);





























