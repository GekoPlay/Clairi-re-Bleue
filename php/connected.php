<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['id_famille'])) {
    echo json_encode([
        "connecte" => true,
        "id" => $_SESSION['id_famille'],
        "nom" => $_SESSION['nom']
    ]);
} else {
    echo json_encode(["connecte" => false]);
}