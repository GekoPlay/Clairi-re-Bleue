les fonctions a faire :


activites :
PutFamilyFiFo($conn,$data) return boolean
ds data tu as i_famille	id_activite	nb_membre	date_inscription	id_attente	(<- pas bsoein de le definir ce un auto incremente);
quand tu met date_inscription tu prends la dete actuekle et lehrue actuelle du moment ou tu fais la focntion


emplacements.php 
La meme chose mais avec reservation_emplacement
PutEmplacementReservation($conn,$data) return boolean
id_famille
num_emplacement
date_debut
date_fin
id_res_empl(auto incremente)


PutEmplacementFiFo($conn,$data) return boolean
la meme que pr fifo au dessus 






familles.php
updateFamily($conn,$data) tu modifie ts les valeurs return boolean
avec data  = ecxple de data pr celui la

{"id_famille":66,"mail":"maelgaborit1407@gmail.com","adresse":"260 route de Coutalon Areches","telephone":768680116,"payeur_id":119,"ville":"Areches","nom":"Gaborit","prenom":"Ma\u00ebl","date_naissance":"2006-07-14","user_id":119}
 ne doit modifier que 
id_famille
mail
password
adresse
telephone
code_postal
id_payeur
ville
pr familles