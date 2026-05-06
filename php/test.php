<?php
include("../db/db_connect.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
header('Content-Type: application/json');

$entity   = $_GET['entity'] ?? '';
$option   = $_GET['option'] ?? '';
$id       = $_GET['id'] ?? null;
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$response = null;

switch($entity){
    case 'formule':
        if($option == "famille" && $id){
            $response = [
                "status" => "success",
                "msg" => "Bravo tu as la fomrule famille et id =${id}"
            ];
        }
        elseif ($option == "famille"){
            $response = [
                "status" => "success",
                "msg" => "Bravo tu as réussi tu as la formule Famille"
            ];
        }

}


echo json_encode($response);