<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include("../db/db_connect.php");
include("familles.php");
include("user.php");
include("activites.php");
include("emplacements.php");

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

$entity   = $_GET['entity'] ?? '';
$id       = $_GET['id'] ?? null;
$option   = $_GET['option'] ?? '';
$secondOption = $_GET['secondOption'] ?? null;

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$response = null;

switch ($entity) {
    case 'payeur':
        $response = get_payeur($conn, $id);
        break;
    case 'users':
        if ($option === 'reservation') {
            if ($secondOption === 'add') {
                $resultat = putReservationActiviteWithUpdate($conn, $data);
                $response = [
                    "status" => ($resultat === "success") ? "success" : $resultat,
                    "msg" => $resultat
                ];
            
            }elseif($secondOption === 'delete'){
            
                $resultat = deleteReservation($conn, $id);
                $response = [
                "status" => ($resultat === "success") ? "success" : $resultat,
                "msg" => $resultat];
            }
            else {
                $response = $id ? getUserById($conn, $id) : getUsers($conn);
            }
        }elseif($option === 'update'){
                $res = updateFamily($conn,$data);
                $response = [
                    "status" => $res ? "success" : $res,
                    "msg" => $res ? $res : $res
                ];
        }else {
            $response = $id ? getUserById($conn, $id) : getUsers($conn);
        }
        break;
    case 'activites':
        if ($option === 'with_reservations' && $id) {
            $response = getActivitesWithReservations($conn, $id);
        }elseif($option === 'ajouter_membre') {
            $resultat = UpdateReservationActivite($conn, $data,"add");
            $response = [
                "status" => ($resultat === "success") ? "success" : $resultat,
                "msg" => $resultat
            ];
        }elseif($option === 'retirer_membre') {
            $resultat = UpdateReservationActivite($conn, $data,"delete");
            $response = [
                "status" => ($resultat === "success") ? "success" : $resultat,
                "msg" => $resultat
            ];
        }elseif($option === 'delete' && $id){
                $resultat = deleteReservation($conn, $id);
                $response = [
                    "status" => $resultat ? "success" : "error",
                    "msg" => $resultat
                ];
        }elseif($option === 'fifo'){

            if( $secondOption === 'addM' && $id){
                $data['signe'] = "+";

                $resultat = UpdateNbMembreFifo($conn,$data,$id);
                $response = [
                    "status" => $resultat ? "success" : "error",
                    "msg" => $resultat
                ];
            }elseif( $secondOption === 'delM' && $id){
                $data['signe'] = "-";
                $resultat = UpdateNbMembreFifo($conn,$data,$id);
                $response = [
                    "status" => $resultat ? "success" : "error",
                    "msg" => $resultat
                ];
            }
        }elseif($id){
            $response = getActiviteById($conn,$id);
            
        }else {
            $response = getActivites($conn);
        }
        break;
        case 'emplacements':
        if ($option === 'reservation') {
            if($id){
                $response = get_reservation_famille($conn, $id);
            }else{
            $response = PutReservationsEmplacement($conn, $data);
            }
        }elseif($option === 'delete' && $id){
            $resultat = deleteReservationEmplacement($conn, $id);
            $response = [
                "status" => $resultat ? "success" : "error",
                "msg" => $resultat
            ];
        }
        
        else {
            // $response = getEmplacements($conn);
        }
        break;
}

echo json_encode($response);
?>