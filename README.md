# Clairi-re-Bleue
Projet Camping Clairière Bleue

Projet Camping avec possibilité de naviguer entre les pages, possibilités de s'inscrire à des activités, de réserver son emplacement de tentes

                        |----------------------------------------------------------|
                        |                     Connexion Serveur                    |
                        |----------------------------------------------------------|

________________________________________________________________
                    Soit par FileZilla 
________________________________________________________________
  Hôte : 51.68.91.213
  Protocole : SFTP
  Port : 22
  Utilisateur : info7
  mdp : 9rB


________________________________________________________________
                      Soit par Putty
________________________________________________________________
Requete ssh : putty.exe -ssh info7@51.68.91.213 -P 22
mdp : 9rB


________________________________________________________________
                      Soit par terminal Linux
________________________________________________________________
Requete ssh : ssh info7@51.68.91.213
mdp : 9rB


________________________________________________________________
                      PHP_MY_ADMIN
________________________________________________________________
LIEN : http://51.68.91.213/phpmyadmin/
mdp : 9rB
Utilisateur : info7



________________________________________________________________
                      INSTALLER GIT SUR VSCODE
________________________________________________________________

etape 1 : Installer Git sur votre Ordi
etape 2 : creer un dossier vide( j'ai dit vide ) quil recevera ce qu'il y a sur le github
etape 3 : Vous ouvrez ce dossier sur vscode (le bon dossier VIDE et vous verifier que vous etes bien dedans, pas a un autre emplacement)
etape 4 : vous ouvrez un terminal -> en haut a gauche vs avez FICHIER EDIT ...TERMINAL -> New Terminal
Si vs etes bon vs devrier avoir comme ligen de commande un truc qui ressemble a ça:
  "~/Bureau/www/html/projet$" parce que il est ds mon dossier projet qui est VIDE
etape 5 : vous collez ces lignes de code dans le terminal
  ligne 1 : git config --global user.name "Ton Pseudo"  <- Et la si y a un tdc qui me met pseudo je l'enc**** vous mettez votre pseudo Github
  ligne 2 : git config --global user.email "ton@email.com" <- de même tu met ton adresse mail
etape final : tu tapes "git clone https://github.com/GekoPlay/Clairi-re-Bleue.git ." <- laisse le point ou je te marrave, et ça sert a rien de changer le lien je lai fait pour pas qu'il y est d'erreur
Si ça marche pas -> tu me demandes sur insta ok mais tu fais pas de la merde sinon goulag



________________________________________________________________
                      UTILISER GIT SUR VSCODE
________________________________________________________________
OK normalemnt sur ton magnifique dossier vide que t'as crée au debut sur ton ordi, y a tous les truc que y a sur GITHUB -> bravo t'as reussi la connexion
Avant de commencer a coder tu devras tjrs respecter ces etapes



tu cliques la dessus 
<img width="26" height="31" alt="image" src="https://github.com/user-attachments/assets/b2d7f3dd-9c07-4474-a31b-f790db20a68e" />

t'as un truc comme ça qui apparait -> tu vas sur les 3 petits point a coté de changes -> il apparaissent qd tu met ta souris par labas
<img width="341" height="470" alt="image" src="https://github.com/user-attachments/assets/b06b37f4-d54c-4fc4-9e85-0e3db4ae73f2" />

tu selectionne Pull -> ça recup ce qui a été mis sur github et ça le mt dans ton dossier crée (celui qui était vide)


Maintenant imaginons je fais une modif d'une ligne de code sur vscode 
<img width="417" height="309" alt="image" src="https://github.com/user-attachments/assets/1e76809e-fb10-46cd-8ad1-aed5b179c863" />
J'AI MIS LE TRUC " explication github" que y avait pas

si je retourne sur le 
<img width="100" height="65" alt="image" src="https://github.com/user-attachments/assets/04422321-3b3d-4b30-bd73-acccb0641d12" />
y a un 1 qui apparait -> ça a modif 1 fichier

<img width="399" height="407" alt="image" src="https://github.com/user-attachments/assets/cbd293b2-f1eb-4b13-83d1-142cde456d2e" />
ici il me dit quel fichier a été modif -> le fichier index.html

j'ecris un message du style-> "ajout expli githbub" et j'appuie sur commit

Le commit c'est un peu un crtl S ça sauvegarde si vs faites une merde -> c un genre d'historique ou on peut revenir en arriere

Pour le mettre après sur le github il suffit de faire sync changes

Sur ce Bon courage à tous
