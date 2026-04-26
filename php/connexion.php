<?php

function connected($conn,$data){

    $res = [
        "status" => "error",
        "role" => null,
    ];

    $password_saisi = $data['password_saisi'];
    $mail_saisi = $data['mail_saisi'];
    $sql = "SELECT * FROM familles WHERE mail = ?";
    $stmt = mysqli_prepare($conn,$sql);
    mysqli_stmt_bind_param($stmt,"s",$mail_saisi);
    mysqli_stmt_execute($stmt);
    $resultat_sql = mysqli_stmt_get_result($stmt);

    if ($famille = mysqli_fetch_assoc($resultat_sql)) {
        
        if (password_verify($password_saisi, $famille['password'])) {
            $res['status'] ="success";
            $res['role'] = "famille";
            $_SESSION['famille'] = $famille['id_famille'];
        } else {
            $res['status'] =  "failed";
            $res['debug'] = "Mot de passe Incorrect";
        }
       
    } else {
        $res['status'] = "failed";
        $res['debug'] = "Aucun compte trouvé avec cette adresse mail";


        $sql = "SELECT * FROM equipe_technique WHERE mail = ?";
        $stmt = mysqli_prepare($conn,$sql);
        mysqli_stmt_bind_param($stmt,"s",$mail_saisi);
        mysqli_stmt_execute($stmt);
        $resultat_sql = mysqli_stmt_get_result($stmt);
        

        if ($equipe_tech = mysqli_fetch_assoc($resultat_sql)) {
        
            if (password_verify($password_saisi, $equipe_tech['password'])) {
                $_SESSION['equipe_tech'] = $equipe_tech['id_equipe_tech'];
                $res['status'] = "success";
                $res['role'] = "equipe_tech";
            } else {
                $res['status'] = "failed";
                $res['debug'] = "Mot de passe Incorrect Compte Admin";
            }
        }else{
            $res['status'] = "failed";
            $res['debug'] = "Adresse mail Incorrect";
        }
        
    }
    return $res;
}


function disconnected() {
    session_unset();

    if (session_destroy()) {
        $res = "disconnected";
    } else {
        $res = "error_disconnecting";
    }

    return $res;
}


function verifConnect(){
    $res = [];
    if(isset($_SESSION['famille'])){
        $res = [
            "id" => $_SESSION['famille'],
            "Role" => "famille"
        ];
    }elseif(isset($_SESSION['admin'])){
        $res = [
            "id" => $_SESSION['admin'],
            "Role" => "admin"
        ];
    }
    else{
        $res = "NoConnection";
    }
    return $res;
}

?>