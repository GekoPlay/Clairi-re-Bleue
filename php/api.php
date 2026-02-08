<?php
// --- CONFIGURATION ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// --- INCLUDES & SESSION ---
include("../db/db_connect.php");
session_start();

// --- RÉCUPÉRATION DES DONNÉES ---
$json_recu = file_get_contents("php://input");
$data = json_decode($json_recu, true); 

// Initialisation réponse par défaut
$status = "error";
$infos = "Action non reconnue";
$action = isset($data['action']) ? $data['action'] : '';

// --- FONCTIONS ---
function recup_utilisateur_byId_payeur($id, $conn){
    $id = intval($id); 
    $sql = "SELECT * FROM utilisateurs WHERE id = $id";
    $res = mysqli_query($conn, $sql);

    if($res){
        return mysqli_fetch_assoc($res);
    } else {
        return [];
    }
}
function recup_famille_byId($id, $conn){
    $id = intval($id); 
    $sql = "SELECT * FROM familles WHERE id_famille = $id";
    $res = mysqli_query($conn, $sql);

    if($res){
        return mysqli_fetch_assoc($res);
    } else {
        return []; 
    }
}
$prenom = isset($data['prenom']) ? $data['prenom'] : '';
$nom = isset($data['nom']) ? $data['nom'] : '';
$mail = isset($data['mail']) ? $data['mail'] : '';
$id_f = isset($data['id_famille']) ? $data['id_famille'] : '';
$password = isset($data['password']) ? $data['password'] : '';
$adresse = isset($data['adresse']) ? $data['adresse'] : '';
$code_postal = isset($data['code_postal']) ? $data['code_postal'] : '';
$telephone = isset($data['telephone']) ? $data['telephone'] : '';
$ville= isset($data['ville']) ? $data['ville'] : '';
    $date_naissance = isset($data['date_naissance']) ? $data['date_naissance'] : '';




//CONNEXION


if ($action === 'recuperation_session') {


    $famille = recup_famille_byId($id_f, $conn);

    if($famille ){
        $id_payeur = $famille['id_payeur'];
        $payeur = recup_utilisateur_byId_payeur($id_payeur,$conn);
        if($payeur){
            $status = "success";
             $infos = [
            "famille" => $famille,
            "payeur" => $payeur
        ];
        }else{
            $infos = "Utilisateur Introuvable";
        }
    } else {
        $infos = "Famille introuvable";
    }
}



elseif ($action === 'connexion_famille'){

// je fais les verifs

    $sql = "SELECT * FROM familles WHERE mail = '$mail' AND password = '$password'";
    $res = mysqli_query($conn,$sql);
    if ($res && mysqli_num_rows($res) > 0){
        $famille = mysqli_fetch_assoc($res);
        $status = "success";
        $infos = $famille;
        $infos['user'] = recup_utilisateur_byId_payeur($famille['id_payeur'],$conn);
        $_SESSION['famille'] = $infos;
    }else{
        $status = "failed";
        $infos= "Utilisateur introuvable";
    }
}



elseif ($action === 'inscription_famille&payeur'){

   

    $sql_verif = "SELECT * from familles where mail = '$mail'";
    $res_verif = mysqli_query($conn,$sql_verif);
    
    if ($res_verif && mysqli_num_rows($res_verif) > 0) {
        $status = "failed";
        $infos = "Adresse email déjà utilisée";

    } else { 

        $sql_payeur = "INSERT INTO utilisateurs (nom,prenom,date_naissance) VALUES ('$nom','$prenom','$date_naissance')";
        
        $res = mysqli_query($conn,$sql_payeur);
        if($res){
            $nouvel_user_id = mysqli_insert_id($conn);

            //creation de la famille
            $sql_famille = "INSERT INTO familles (mail,password,adresse,telephone,code_postal,id_payeur,ville) VALUES ('$mail','$password','$adresse','$telephone','$code_postal','$nouvel_user_id','$ville')";
            $res_famille = mysqli_query($conn,$sql_famille);
            if($res_famille){

                $nouvel_famille_id = mysqli_insert_id($conn);

                //update du payeur
                 $sql_payeur = "UPDATE utilisateurs SET id_famille = $nouvel_famille_id  WHERE id = $nouvel_user_id";
                $res_payeur_update = mysqli_query($conn,$sql_payeur);
                if($res_payeur_update){
                    $status = "success";
                    $infos = "utilisateur modifier avec succès";
                    $res_famille['user'] = $res_payeur_update;
                    $_SESSION['famille'] = $res_famille;
                }else{
                    $status = 'failed';
                    $infos = "L'utilisateur n'a pas pu être update";
                }

            }else{
                $status = 'failed';
                $infos = "Impossible de creer la famille";
            }

        }else{
            $status = 'failed';
            $infos = "Impossible de créer l'Utilisateur Payant";
        }
    }

}
elseif ($action == "connexion_session"){

     if (isset($_SESSION['famille'])) {
        $status = "logged_in";
        $infos = $_SESSION['famille'];
        $infos['membres'] = membres_famille_byId($infos['id_famille'],$conn);
     }else{
        $status = "failed";
        $infos = "Mauvaise Sessions";
     }

}

elseif ($action == "inscription_user_by_idFamille"){
    $sql = "INSERT INTO utilisateurs (nom,prenom,date_naissance,id_famille) VALUES ('$nom','$prenom','$date_naissance','$id_f')";
    $res = mysqli_query($conn,$sql);
    if($res){
        $status = "success";
        $infos = "Utilisateur ajouté";
    }else{
        $status = "failed";
        $infos = "L'utilisateur n'a pas pu être crée";
    }
}





function membres_famille_byId ($id,$conn){
    $sql = "SELECT * FROM utilisateurs WHERE id_famille = '$id' ";
    $res = mysqli_query($conn,$sql);
    if($res){
       return mysqli_fetch_all($res, MYSQLI_ASSOC);
    } else {
        return [];
    }
}












$reponse = [
    "status" => $status,
    "infos" => $infos,
    "action" => $action
];

echo json_encode($reponse);












































// // ==========================================
// // CAS 1 : RÉCUPÉRATION DATA PAR ID
// // ==========================================
// if ($action === 'recup_donnees_by_Id') {
//     $id_demandé = isset($data['id_famille']) ? intval($data['id_famille']) : 0;
    
//     $result = recup_donnees_byId($id_demandé, $conn);

//     if ($result) {
//         $status = "success";
//         $infos = $result; 
//     } else {
//         $status = "failed";
//         $infos = "Aucune famille trouvée avec cet ID";
//     }
// }

// // ==========================================
// // CAS 2 : CONNEXION
// // ==========================================
// elseif ($action === 'connexion') {
    
//     $mail = mysqli_real_escape_string($conn, $data['mail']);
//     $password = mysqli_real_escape_string($conn, $data['password']); // Attention: Pensez à utiliser password_verify() à l'avenir

//     $sql = "SELECT * FROM familles WHERE mail = '$mail' AND password = '$password'";
//     $result = mysqli_query($conn, $sql);

//     if ($result) {
//         if (mysqli_num_rows($result) > 0) {
//             $status = "success";
//             $famille_data = mysqli_fetch_assoc($result);
//             unset($famille_data['password']);
//             $_SESSION['famille'] = $famille_data;
//             $infos = $famille_data;

//         } else {
//             $status = "failed";
//             $infos = "Mot de passe ou email incorrect";
//         }
//     } else {
//         $status = "error";
//         $infos = "Erreur SQL : " . mysqli_error($conn);
//     }

// } 

// // ==========================================
// // CAS 3 : INSCRIPTION
// // ==========================================
// elseif ($action === 'inscription') {
//     $mail = mysqli_real_escape_string($conn, $data['mail']);
    
//     // Vérification existence mail
//     $sql_verif = "SELECT id FROM familles WHERE mail = '$mail'";
//     $res_verif = mysqli_query($conn, $sql_verif);
    
//     if ($res_verif && mysqli_num_rows($res_verif) > 0) {
//         $status = "failed";
//         $infos = "Adresse email déjà utilisée";
//     } else {

//         // 1. Insertion Utilisateur
//         $nom = mysqli_real_escape_string($conn, $data['nom']);
//         $prenom = mysqli_real_escape_string($conn, $data['prenom']);
        
//         $sql1 = "INSERT INTO utilisateurs (nom, prenom, date_naissance) VALUES ('$nom', '$prenom','2026-07-14')";
        
//         if (mysqli_query($conn, $sql1)) {
//             $nouvel_id_user = mysqli_insert_id($conn);

//             $pass = mysqli_real_escape_string($conn, $data['password']);
//             $adresse = mysqli_real_escape_string($conn, $data['adresse']);
//             $tel = mysqli_real_escape_string($conn, $data['telephone']);
//             $code = mysqli_real_escape_string($conn, $data['code_postal']);
//             $ville = mysqli_real_escape_string($conn, $data['ville']);

//             // 2. Insertion Famille
//             $sql2 = "INSERT INTO familles (mail, password, adresse, telephone, code_postal, ville, id_payeur) 
//                      VALUES ('$mail', '$pass', '$adresse', '$tel', '$code', '$ville', $nouvel_id_user)";
            
//             if (mysqli_query($conn, $sql2)) {
//                 $nouvel_id_famille = mysqli_insert_id($conn); // ID de la famille créée

//                 // 3. Mise à jour de l'utilisateur avec l'ID famille
//                 $sql3 = "UPDATE utilisateurs 
//                          SET id_famille = $nouvel_id_famille 
//                          WHERE id = $nouvel_id_user";

//                 if (mysqli_query($conn, $sql3)) {
//                     $status = "success";
//                     $infos = "inscription";

//                     // --- CONSTRUCTION PROPRE DE LA SESSION ---
                    
//                     // a) On récupère les infos fraîches de l'utilisateur depuis la BDD (avec l'ID famille à jour)
//                     $donnees_user_bdd = recup_donnees_byId($nouvel_id_user, $conn);
//                     $data = $donnees_user_bdd;
//                     // b) On fusionne : Données Formulaire + Données BDD
//                     // Les données BDD écraseront les données formulaire si doublons (c'est ce qu'on veut)
//                     $session_complete = array_merge($data, $donnees_user_bdd);
                    
//                     // c) On ajoute l'ID famille explicitement au cas où
//                     $session_complete['id_famille'] = $nouvel_id_famille;

//                     // d) SÉCURITÉ : On retire le mot de passe et l'action
//                     unset($session_complete['password']);
//                     unset($session_complete['action']);

//                     // e) Enregistrement
//                     $_SESSION['famille'] = $session_complete;

//                 } else {
//                     $status = "failed";
//                     $infos = "Erreur lors de la mise à jour user : " . mysqli_error($conn);
//                 }
//             } else {
//                 $status = "failed";
//                 $infos = "Erreur insertion famille : " . mysqli_error($conn);
//             }
//         } else {
//             $status = "failed";
//             $infos = "Erreur insertion utilisateur : " . mysqli_error($conn);
//         }
//     }
// }

// // ==========================================
// // CAS 4 : VÉRIFICATION SESSION
// // ==========================================
// elseif ($action == "connexion_session"){

//     if (isset($_SESSION['famille'])) {
//         echo json_encode([
//             "status" => "logged_in", 
//             "user" => $_SESSION['famille'],
//             "data" => $data
//         ]);
//     } else {
//         echo json_encode(["status" => "not_logged_in"]);
//     }
//     exit(); // On arrête le script ici pour ce cas précis
// }

// // --- ENVOI DE LA RÉPONSE JSON ---
// $reponse = [
//     "status" => $status,
//     "infos" => $infos,
// ];

// echo json_encode($reponse);
// ?>