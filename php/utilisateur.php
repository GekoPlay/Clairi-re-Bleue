<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("../db/db_connect.php");
include("familles.php");
include("user.php");
include("activites.php");
include("emplacements.php");

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
        } else {
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