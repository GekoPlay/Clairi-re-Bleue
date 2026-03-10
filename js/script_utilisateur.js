
function recup_donnee(data) {
    return axios.post('../php/api.php', data)
        .then(response => {
            if (response.data.status == 'logged_in') {
                ts_donnees = response.data.infos;
                    return ts_donnees; 
            } else {
                console.log("Non connecté");
                //  window.location.href = "../html/connexion.html";
            }
        });
}
    // .catch(error => {
    //     console.error("Erreur serveur, par sécurité on déconnecte");
    //     //  window.location.href = "../html/connexion.html";
    // });

data = { action: "recuperation_session" };
console.log (data);

recup_donnee(data).then(infos => {
    console.log("Données récupérées !");
    console.log(infos);
    if  (infos.session == "famille") {
        console.log("c if");
        affiche_membres(infos);
    }
    affichage_donnees(infos);
    affiche_planning(infos);
});



// data.action = "select_membres_famille_byId";




function affichage_donnees(donnees) {
    console.log(donnees)

if ('user' in donnees) {
    user = donnees['user'];
}else if ('admin' in donnees) {
    user = donnees['admin'];
}else if ('membre' in donnees) {
    user = donnees['membre'];
}

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


function affiche_planning(donnees) {
    planning = document.getElementById("planning");
    planning.innerHTML = "";
    planning.innerHTML = "activités à venir";
    donnees.reservations.forEach(reservation => {
        const activiteDiv = document.createElement("div");
        activiteDiv.classList.add("reservation-item");
        dateSQL = reservation.date_d;
        const dateObj = new Date(dateSQL.replace(' ', 'T'));
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateLongueFR = dateObj.toLocaleDateString('fr-FR', options);
        status_act = reservation.status == "0" ? "Aucune réservation" : (reservation.status == "1" ? "En attente" : "Réservé");
        activiteDiv.innerHTML = `<p>${dateLongueFR}</p><h3>${reservation.nom_activite}</h3><p>${reservation.prix}€</p><p>${status_act}</p>`;
        planning.appendChild(activiteDiv);
    });

    right_content = document.getElementById("bas");
center = document.getElementsByClassName("center");
reservation = document.getElementsByClassName("reservation-item");
 for (let i = 0; i < reservation.length; i++) {
    reservation[i].addEventListener("click", function() {
        center[0].classList.toggle("translate");
        affiche_reservation(donnees, i);
    });
}

}

function affiche_membres(donnees) {
    sousMembre = document.getElementById("membres");
    sousMembre.innerHTML = "";
    console.log(donnees.membres);
    if (donnees.membres.length > 5){
        sousMembre.innerHTML = "<img id='autre_membres' src='#'>";
    }
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




home_menu = document.getElementById("home-menu");

left = document.getElementsByClassName("left")[0];


home_menu.addEventListener("click", menu_left); // Pas de () ici2

function menu_left(){
    console.log("oh hey")
    left.classList.toggle("affiche");
}


let btnDeconnexion = document.getElementById("deconnexion");

btnDeconnexion.addEventListener("click", function(e){
    e.preventDefault();

    let data = { action: "deconnexion" };
    
    recup_donnee(data).then(infos => {
        if (infos) {
            console.log("Déconnexion OK :", infos);
            window.location.href = "../html/connexion.html"; // Maintenant on peut rediriger
        } else {
            console.log("Erreur lors de la déconnexion.");
        }
    });
});

function affiche_reservation(donnees, index) {
    reservation = donnees.reservations[index];
    right_content = document.getElementById("bas");
    right_content.innerHTML = "";
    right_content.innerHTML = `
    <h2>${reservation.nom_activite}</h2>
    <p>Prix : ${reservation.prix}€</p>
    <p>Status : ${reservation.status}</p>
    `;
    console.log(reservation.status);
if (reservation.status == "2" || reservation.status == "1") {
        right_content.innerHTML += `<button id="btn" onclick="desinscription_activite(${index})">Se désinscrire</button> `;}
    else if (reservation.status == "0") {
        right_content.innerHTML += `<button id="btn" onclick="inscription_activite(${index})">S'inscrire</button> `;}
    }







function desinscription_activite(index) {
    let data = {
        action: "desinscription_activite",
        id_activite: ts_donnees.reservations[index].id_activite, // Vérifie bien ce chemin
        id_famille: ts_donnees.id_famille
    };
    
    console.log(data);
    axios.post('../php/api.php', data)
        .then(response => {
            if (response.data.status === "success") {
                console.log("Désinscription réussie :", response.data);
                
                recup_donnee({ action: "recuperation_session" }).then(infos => {
                    console.log("Données mises à jour après désinscription !");
                    affiche_planning(infos);
                    affiche_reservation(infos, index); // Recharge le bouton vers "S'inscrire"
                });
            } else {
                console.log(response.data.infos);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la désinscription", error);
        });
}


      document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth'
        });
        calendar.render();
      });















function inscription_activite(index) {
    data = {
        action: "inscription_activite",
        id_activite: ts_donnees.reservations[index].id_activite,
        id_famille: ts_donnees.id_famille,
        nb_membre: ts_donnees.membres.length
    }
    
    console.log(data);
   axios.post('../php/api.php', data)
        .then(response => {
            if (response.data.status = "success"){
                console.log(response.data);
                recup_donnee({ action: "recuperation_session" }).then(infos => {
                    console.log("Données mises à jour !");
                    console.log(infos);
                     affiche_planning(infos);
                     console.log(index);
                     affiche_reservation(infos, index);
                });
            }else{
                console.log(response.data.infos);
            }
        }
        )
        .catch(error => {
            console.error("Pas reussi a le créee", error);
        });
}





sejout = document.getElementById("sejour");
    total = document.getElementById("total");

sejout.addEventListener("mouseover", function(event) {
    console.log("hover");
    total.style.display = "flex";
});

sejout.addEventListener("mouseout", function(event) {
    console.log("unhover");
    total.style.display = "none";
});

const confirmOrder = document.getElementsByName("confirmOrder")[0]; // Attention au [0] !
topp = document.getElementById("top");

confirmOrder.addEventListener("click", () => {
    data = new FormData(topp); // me permt de plsu simplement récup les données --> obtient un tableau pas exploitable directement
    utilisateur_data = Object.fromEntries(data.entries()); //retranscit en un tableau
    payement.innerHTML = " mange ta grnd mere"
});

const surplus = document.getElementById("surplus");
const previousStep = document.getElementsByName("previousStep")[0];
previousStep.addEventListener("click", () => {
    console.log("ahaha")
    surplus.style.display = "none";

});
