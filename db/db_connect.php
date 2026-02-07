<?php
$servername = "localhost";
$username = "admin";            
$password = "admin";         
$dbname = "projet_web_L2_S2";             

$conn = mysqli_connect($servername, $username, $password, $dbname); // <--- Make sure it includes ", 3306" here

if (!$conn) {
    die("Erreur de connexion à la base de données : " . mysqli_connect_error());
}else

?>