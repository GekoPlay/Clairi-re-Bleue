<?php



function getFamilles($conn) {
    $sql = "SELECT * FROM `familles`";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}

function getFamilleById($conn, $id) {
    $sql = "SELECT * FROM `familles` WHERE id_famille = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "i", $id);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_assoc($res) ?: null;
}
function getFamilleswithPayeur($conn) {
    $sql = "SELECT 
                f.id_famille, 
                f.mail, 
                f.adresse,
                f.telephone,
                f.id_payeur AS payeur_id,
                f.ville,
                u.nom,
                u.prenom,
                u.date_naissance,
                u.id AS user_id
            FROM familles f
            JOIN utilisateurs u ON f.id_payeur = u.id";
            
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}




function verif_mail($conn,$mail){
$sql = "SELECT * FROM familles WHERE mail = ?";
$requete = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($requete, "s", $mail);
mysqli_stmt_execute($requete);
$res = mysqli_stmt_get_result($requete);
return mysqli_num_rows($res) === 0; 
}




function createUser($conn,$data){

$nom = $data['nom'];
$prenom = $data['prenom'];
$date_naissance = $data['date_n'];

$sql = "INSERT INTO utilisateurs (nom,prenom,date_naissance) values (?,?,?)";
$requete = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($requete, "sss",$nom,$prenom,$date_naissance);
mysqli_stmt_execute($requete);
$res = mysqli_stmt_get_result($requete);
$nouvel_user_id = mysqli_insert_id($conn);
return $nouvel_user_id;
}

function createFamily($conn,$data,$id_user){

    $mail = $data['mail'];
    $password = $data['password'];
    $password_hache = password_hash($password, PASSWORD_DEFAULT);
    $adresse = $data['adresse'];
    $telephone = $data['tel'];
    $code_postal = $data['code_postal'];
    $ville = $data['ville'];

    $sql = "INSERT INTO familles (mail,password,adresse,telephone,code_postal,id_payeur,ville) values (?,?,?,?,?,?,?)";
    $requete = mysqli_prepare($conn,$sql);
mysqli_stmt_bind_param($requete, "sssiiis", $mail, $password_hache, $adresse, $telephone, $code_postal, $id_user, $ville);    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    $nouvel_famille_id = mysqli_insert_id($conn);
    return $nouvel_famille_id;
}


function UpdateUser($conn,$id_user,$id_famille){
    
    $sql = "UPDATE utilisateurs SET id_famille = ? WHERE id = ? ";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_bind_param($requete,"ii",$id_famille,$id_user);
    return mysqli_stmt_execute($requete);
}

function createPackFamily($conn, $data) {
    $msg = "";

    if (verif_mail($conn, $data['mail'])) {

        $id_user = createUser($conn, $data);
        if ($id_user) {

            $id_famille = createFamily($conn, $data, $id_user);
            if ($id_famille) {

                if (UpdateUser($conn, $id_user, $id_famille)) {
                    $msg = "success";
                } else {
                    $msg = "Erreur : impossible de lier l'utilisateur à la famille.";
                }
            } else {
                $msg = "Erreur : la famille n'a pas pu être créée.";
            }
        } else {
            $msg = "Erreur : impossible de créer le compte utilisateur.";
        }
    } else {
        $msg = "Désolé, ce mail est déjà utilisé.";
    }

    return $msg;
}


function getNbMembre($conn,$idFamille){
    $sql = "SELECT id FROM utilisateurs WHERE id_famille = ?";
    $requete = mysqli_prepare($conn,$sql);
    mysqli_stmt_bind_param($requete,"i",$idFamille);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_num_rows($res); 
}




// function GetPayeurId($conn,$id_famille){
//     $sql = "SELECT id_payeur FROM familles WHERE id_famille = ?";
//     $requete = mysqli_prepare($conn,$sql);
//     mysqli_stmt_bind_param($requete,'i',$id_famille);
//     mysqli_stmt_execute($requete);
//     $res = mysqli_stmt_get_result($requete);
//     return $res;
// }







function deleteFamille($conn, $id) {
    $msg = "";
    
    $sql = "UPDATE familles SET id_payeur = NULL WHERE id_famille = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, 'i', $id);
    mysqli_stmt_execute($requete);

    if (mysqli_stmt_affected_rows($requete) === 0) {
        return "Famille introuvable";
    }

    $sql = "DELETE FROM familles WHERE id_famille = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, 'i', $id);
    
    if (mysqli_stmt_execute($requete) && mysqli_stmt_affected_rows($requete) > 0) {
        $msg = "success";
    } else {
        $msg = "Pas reussi a supprimer la famille";
    }

    return $msg;
}

function updateFamily($conn, $data)
{
    $mail        = $data['mail'];
    $adresse     = $data['adresse'];
    $telephone   = $data['telephone'];
    $code_postal = $data['code_postal'] ?? null;
    $id_payeur   = $data['id_payeur'] ?? $data['payeur_id'];
    $ville       = $data['ville'];
    $id_famille  = $data['id_famille'];
    $hasPassword = !empty($data['password']);

    $sql = "UPDATE familles SET 
                mail        = ?,
                adresse     = ?,
                telephone   = ?,
                code_postal = ?,
                id_payeur   = ?,
                ville       = ?"
                . ($hasPassword ? ", password = ?" : "") . "
            WHERE id_famille = ?";

    $requete = mysqli_prepare($conn, $sql);

    if ($hasPassword) {
        $password = password_hash($data['password'], PASSWORD_BCRYPT);
        mysqli_stmt_bind_param($requete, "ssssissi", $mail, $adresse, $telephone, $code_postal, $id_payeur, $ville, $password, $id_famille);
    } else {
        mysqli_stmt_bind_param($requete, "ssssisi", $mail, $adresse, $telephone, $code_postal, $id_payeur, $ville, $id_famille);
    }

    $res = mysqli_stmt_execute($requete);
    
    if($res){
        return UpdateUserAll($conn, $data);
    } else {
        return "Impossible de mettre à jour familles : " . mysqli_error($conn);
    }
}

function UpdateUserAll($conn, $data){
    $nom = $data['nom'];
    $prenom = $data['prenom'];
    $date_naissance = $data['date_naissance'];
    $id_user = $data['id_utilisateur'] ?? $data['id']; // Assurez-vous d'avoir l'ID utilisateur

    $sql = "UPDATE utilisateurs SET
        nom = ?,
        prenom = ?,
        date_naissance = ? 
        WHERE id = ?";
        
    $requete = mysqli_prepare($conn, $sql);
    // Liaison des 4 paramètres (sss + i)
    mysqli_stmt_bind_param($requete, "sssi", $nom, $prenom, $date_naissance, $id_user);
    
    return mysqli_stmt_execute($requete);
}