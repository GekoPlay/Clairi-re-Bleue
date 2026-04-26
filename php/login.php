<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include("../db/db_connect.php");
include("connexion.php");

// Autorise n'importe quelle origine (ton Swagger)
header("Access-Control-Allow-Origin: *");
// Autorise les méthodes HTTP classiques
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
// Autorise les headers comme Content-Type ou Authorization (pour ton Bearer Token)
header("Access-Control-Allow-Headers: Content-Type, Authorization");


// Très important : Gérer la requête de "pré-vérification" (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
header('Content-Type: application/json');

$action= $_GET['action'];
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$response = null;

session_start();


switch($action){
    case 'connected':
        $res = connected($conn,$data);
        $response = $res;
        break;
    case 'disconnected':
        $res = disconnected($conn);
        $response = [
            "status" => ($res === "disconnected") ? $res : "connected",
            "msg" => ($res === "disconnected") ? "Déconnecter avec success" : $res
        ];
        break;
    case 'isConnected':
        $res = verifConnect();
        $response = [
            "status" => (isset($res['id'])) ? "connected" :"disconnected",
            "id" => (isset($res['id'])) ? $res['id'] : null,
            "role" => (isset($res['Role'])) ? $res['Role'] : null
        ];
}

echo json_encode($response);
?>