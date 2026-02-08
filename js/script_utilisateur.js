
function recup_donnee(data) {
    // On ajoute 'return' ici pour renvoyer la promesse au code qui l'appelle
    return axios.post('../php/api.php', data)
        .then(response => {
            if (response.data.status == 'logged_in') {
                // On met à jour la variable globale si besoin
                ts_donnees = response.data.infos;
                
                // IMPORTANT : On renvoie les données pour le prochain .then()
                return ts_donnees; 
            } else {
                console.log("Non connecté");
                return null;
            }
        });
}
    // .catch(error => {
    //     console.error("Erreur serveur, par sécurité on déconnecte");
    //     //  window.location.href = "../html/connexion.html";
    // });

data = { action: "connexion_session" };

recup_donnee(data).then(infos => {
    affichage_donnees(infos);
    affiche_membres(infos);
    console.log(infos)
});



// data.action = "select_membres_famille_byId";




function affichage_donnees(donnees) {
    console.log(donnees)
    div_donnee = document.getElementById("donnees");
    user = donnees['user'];
    presentation = document.getElementById("presentation");
    sousPresentation = document.createElement("div");
    sousPresentation.id = "donnees_div_pres"
    create("label", "nom", sousPresentation, `${user['nom']} ${user['prenom']}`, null);
    create("label", "mail", sousPresentation, donnees['mail'], null);
    create("label", "telephone", sousPresentation, `+33 ${donnees['telephone']}`, null);
    create("label", "adresse", sousPresentation, `${donnees['adresse']} ${donnees['code_postal']} ${donnees['ville']}`, null);
    sousPresentation.innerHTML += `<img>`;
    presentation.appendChild(sousPresentation);


}

function affiche_membres(donnees) {
    sousMembre = document.getElementById("membres");
    sousMembre.innerHTML = "";
    console.log(donnees.membres);
    if (donnees.membres && donnees.membres.length > 0) {
        donnees.membres.slice(-5).forEach(membre => {
            const blocMembre = create("div", null, sousMembre, "", "membre-item");
            blocMembre.innerHTML += `<img class="user">`;
            create("span", null, blocMembre, `${membre.nom} ${membre.prenom}`, "nom");
            blocMembre.innerHTML += ` <img class="croix" src="#">`;
        });

    } else {
        sousMembre.innerHTML = "Aucun membre trouvé.";
    }
    blocMembret = create("div", null, sousMembre, "+", "membre-item");
    blocMembret.classList.add("last");






    plus = document.querySelector(".last");

    plus.addEventListener("click", function (event) {
        if (blocMembret.innerHTML === "+") {
            const nouvelleDiv = document.createElement('div');
            nouvelleDiv.classList.add("membre-item");
            nouvelleDiv.classList.add("nouveau");
            nouvelleDiv.innerHTML = "<input type='text' id='nom_input' placeholder='nom'> <input type='text' id='prenom_input' placeholder='prenom'> <input type='date' id='date_input' placeholder='date naissance'>";
            sousMembre.insertBefore(nouvelleDiv, blocMembret);
            blocMembret.innerHTML = "valider";
        } else {
            blocMembret.innerHTML = "+";
            nom = document.getElementById("nom_input").value;
            prenom = document.getElementById("prenom_input").value;
            date_naissance = document.getElementById("date_input").value;

            data = {
                "nom": nom,
                "prenom": prenom,
                "date_naissance": date_naissance,
                "action": "inscription_user_by_idFamille",
                "id_famille": donnees['id_famille']
            }
            nouveau_f(data);
        }

    });

}





function nouveau_f(data) {
    console.log(data);
    axios.post('../php/api.php', data)
        .then(response => {
            if (response.data.status = "success"){
            rafraichir_membres();
            }else{
                console.log(response.data.infos);
            }
        }
        )
        .catch(error => {
            console.error("Pas reussi a le créee");
        });
}


function rafraichir_membres() {
    recup_donnee({ action: "connexion_session" }).then(infos => {
        console.log("Données mises à jour !");
        affiche_membres(infos);
    });
}


    // console.log(plus);
    // plus.addEventListener("click", function(event) {
    //     console.log("click")
    //     const nouvelleDiv = document.createElement('div');
    //     nouvelleDiv.innerHTML = "<input type='text' placeholder='nom'> <input type='text' placeholder='prenom'>";
    //     nouvelleDiv.classList.add("membre-item")
    //     nouvelleDiv.classList.add("nouveau")
    //     sousMembre.insertBefore(nouvelleDiv,blocMembret);
    //     blocMembret.innerHTML = "check"

    // });





//     presentation.appendChild(sousPresentation);
// }


function create(balise, id_donnee = null, parent = null, contenu = '', nomClasse = null) {
    const temp = document.createElement(balise);

    if (id_donnee) temp.id = id_donnee;

    if (nomClasse) temp.classList.add(nomClasse);

    temp.innerHTML = contenu;

    if (parent) {
        parent.appendChild(temp);
    }

    return temp;
}





