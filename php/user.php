<?php


function getUsers($conn) {
$sql = "SELECT * FROM `utilisateurs`";
$requete = mysqli_prepare($conn,$sql);
mysqli_stmt_execute($requete);
$res = mysqli_stmt_get_result($requete);
return mysqli_fetch_all($res, MYSQLI_ASSOC) ?: [];
}

function getUserById($conn, $id) {
    $sql = "SELECT * FROM `utilisateurs` WHERE id = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "i", $id);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_assoc($res) ?: null;
}

function get_payeur($conn, $id) {
    $sql = "SELECT *
    FROM familles f
    JOIN utilisateurs u ON u.id = f.id_payeur
    WHERE f.id_famille = ?";
    $requete = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($requete, "i", $id);
    mysqli_stmt_execute($requete);
    $res = mysqli_stmt_get_result($requete);
    return mysqli_fetch_assoc($res) ?: null;
}



?>