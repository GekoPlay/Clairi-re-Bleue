<?php
session_start();
header('Content-Type: application/json');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

include("../db/db_connect.php");

$mail = $data['mail'] ?? '';
$password = $data['password'] ?? '';

$stmt = $conn->prepare("SELECT * FROM familles WHERE mail = ?");
$stmt->bind_param("s", $mail);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['id_famille'] = $user['id_famille'];
    $_SESSION['nom'] = $user['nom'];
    echo json_encode(["status" => "success", "nom" => $user['nom']]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "msg" => "Identifiants incorrects"]);
}

?>