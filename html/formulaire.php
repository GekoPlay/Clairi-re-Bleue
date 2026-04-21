<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    
        <link rel="stylesheet" href="../css/style_formulaire.css">

    <title>Formulaire</title>
    body>
  <div class="wrapper">
    <h2>Vos informations</h2>
       <form action="" method="get">
        <div class="input-box">
          <input type="number" name="nom" placeholder="Entrez votre nom" >
        </div>
        <div class="input-box">
          <input type="text" name="prenom" placeholder="Entrez votre prénom" >
        </div>
        <div class="input-box">
          <input type="number" name="age" placeholder="Entrez votre âge" >
        </div>
        <div class="input-box">
          <input type="date" name="date_naissance" placeholder="Entrez votre date de naissance" >
        </div>
        <div class="input-box button">
          <input type="Submit" value="Envoyer">
</head>
<body>
    <h1>Formulaire</h1>
    <div id="url"></div>
</body>
<script defer src="../js/script_formulaire.js"></script>
</html>