function api(data) {
    return axios.post('../php/api.php', data)
        .then(response => {
            console.log(response.data);
            if (response.data.currentDonnees.session === "famille") {
                DonnesPack = response.data;
                return response.data;
            }
            // else if (response.data.currentDonnees.session == "admin") {
            //     window.location.href = "../html/admin.html"; // Maintenant on peut rediriger
            // } else if (response.data.currentDonnees.session == "moderator") {
            //     window.location.href = "../html/admin.html"; // Maintenant on peut rediriger
            // } else if (response.data.currentDonnees.session == "scrib") {
            //     window.location.href = "../html/admin.html"; // Maintenant on peut rediriger
            // } else {
            //     window.location.href = "../html/connexion.html"; // Maintenant on peut rediriger

            // }
        }
        )
        .catch(error => {
            console.error("Erreur API :", error);
            throw error;
        });
}

const data_recup = { action: "session" };
let DonnesPack = null;



async function Affichage_Principal() {
    response = await api(data_recup);
    donnees = response.currentDonnees;
    if (response) {
        affichage_donnees(donnees);
    }
}

// On lance la fonction
Affichage_Principal();



function affichage_donnees(donnees) {
    if ('payeur' in donnees) {
        affichage_donnees_famille(donnees);
    }
}



function affichage_donnees_famille(donnees) {
    affiche_planning(donnees.reservations);
    affiche_membres(donnees);
    affiche_payeur(donnees);
}


function affiche_payeur(donnees) {
    payeur = donnees.payeur
    presentation = document.getElementById("presentation");
    sousPresentation = document.createElement("div");
    sousPresentation.id = "donnees_div_pres"
    create("label", "nom", sousPresentation, `${payeur['nom']} ${payeur['prenom']}`, null);
    create("label", "mail", sousPresentation, donnees['mail'], null);
    create("label", "telephone", sousPresentation, `+33 ${donnees['telephone']}`, null);
    create("label", "adresse", sousPresentation, `${donnees['adresse']} ${donnees['code_postal']} ${donnees['ville']}`, null);
    sousPresentation.innerHTML += `<img>`;
    presentation.appendChild(sousPresentation);
}

function affiche_planning(reservations) {
    // console.log("les reservaiotns");
        // console.log(reservations);
     const planning = document.getElementById("planning");
     const center = document.getElementsByClassName("center")[0];
    
     planning.innerHTML = "<h2>Activités à venir</h2>";

     if (!DonnesPack || !DonnesPack.currentDonnees) {
         planning.innerHTML += "<p>Erreur de chargement des données utilisateur.</p>";
         return;
     }

    const mesResas = reservations.filter(resa => {
        return resa.id_famille == DonnesPack.currentDonnees.id_famille;
    });

    if (mesResas.length === 0) {
        planning.innerHTML += "<p>Aucune activité prévue pour le moment.</p>";
        return; 
    }

    mesResas.forEach((resa) => {
        const activiteDiv = document.createElement("div");
        activiteDiv.classList.add("reservation-item");

        let status_act = resa.status == "0" ? "N'a pas réservé" : (resa.status == "1" ? "En attente" : "Réservé");
        
        activiteDiv.innerHTML = `
            <h3>${resa.nom}</h3>
            <p>Prix : ${resa.prix}€</p>
            <p>Statut : <strong>${status_act}</strong></p>`;

        activiteDiv.addEventListener("click", function () {
            center.classList.toggle("translate");
            affiche_reservation(resa);

        });

        planning.appendChild(activiteDiv);
    });
}


function affiche_reservation(resa) {
    const right_content = document.getElementById("bas");
    id_resa = resa.id_reservation_activite;
    console.log(id_resa);

    right_content.innerHTML = `
    <h2>${resa.nom}</h2>
    <p>Prix : ${resa.prix}€</p>
    ${resa.pos_fifo ? `<p>Mise en attente : ${resa.pos_fifo} position</p>` : ''}
`;

    if (resa.status == "1" || resa.status == "2") {
        right_content.innerHTML += `<button onclick="gerer_action('desinscription', ${id_resa})">Se désinscrire</button>`;
    } else {
        right_content.innerHTML += `
        <input type="number" name="number" id="number">
        <button onclick="gerer_action('inscription', ${resa.id})">S'inscrire</button>`;
    }
}
async function gerer_action() {
    let data = {action: "inscription_activite",id_activite : 3, nb_membre : 2, id_famille : 51 }
    
    // const package = await api(data);
    // console.log("jai besoin v1");
    // console.log(package);

    // data.nb_membre = 5;
    // data.id_famille = 52;

    //  const packagev2 = await api(data);
    // console.log("jai besoin v2");
    // console.log(packagev2);
    

    data.action = "desinscription_activite";
    // data.id_famille = 51;

    const packagev3 = await api(data);
    console.log("jai besoin v3");
    console.log(packagev3);


    
}

gerer_action();
//     const idFamilleActuelle = DonnesPack.currentDonnees.id_famille;
    
//     let data = { action: type + "_activite" };
//     let id_activite_fixe;

//     const resaAvantAction = DonnesPack.currentDonnees.reservations.find(r => 
//         (type === 'inscription' && r.id == id_unique) || 
//         (type === 'inscription' && r.id == id_unique) || 
//         (type === 'desinscription' && r.id_reservation_activite == id_unique)
//     );

//     if (!resaAvantAction) {
//         console.error("Impossible de retrouver l'activité correspondante.");
//         return;
//     }

//     id_activite_fixe = resaAvantAction.id;

//     if (type === 'inscription') {
//         const inputNb = document.querySelector("#number");
//         data.id_activite = id_activite_fixe; 
//         data.nb_membre = inputNb ? inputNb.value : 1;
//         data.id_famille = idFamilleActuelle;
//     } else {
//         data.id_reservation = id_unique; 
//         data.id_activite = id_activite_fixe; 
//     }

//     const package = await api(data);
//     const tabMaj = package.currentDonnees.reservations;

//     const ReservationMisAJour = tabMaj.find(resa => 
//         resa.id == id_activite_fixe && 
//         resa.id_famille == idFamilleActuelle
//     );

//     if (ReservationMisAJour) {
//         console.log("Mise à jour réussie pour :", ReservationMisAJour.nom);
//         affiche_reservation(ReservationMisAJour);
//     }
    
//     // On rafraîchit le planning (Liste centrale)
//     affiche_planning(tabMaj);
// }




















function affiche_membres(donnees) {
    sousMembre = document.getElementById("membres");
    sousMembre.innerHTML = "";
    if (donnees.membres.length > 5) {
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

            nouveau_membre(data);
        }

    });

}


async function nouveau_membre(data) {
    response = await api(data);
    affiche_membres(response.currentDonnees);

}

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

function menu_left() {
    left.classList.toggle("affiche");
}


let btnDeconnexion = document.getElementById("deconnexion");

btnDeconnexion.addEventListener("click", function (e) {
    e.preventDefault();

    let data = { action: "deconnexion" };


    api(data).then(donnees => {
        console.log(donnees);
    })
    // recup_donnee(data).then(donnees => {
    //     if (donnees) {
    //         window.location.href = "../html/connexion.html"; // Maintenant on peut rediriger
    //     }
    // });
});



// 1. Déclare la variable en dehors pour qu'elle soit accessible partout
let calendar;

function chargerEvenementsDansCalendrier(reservations) {
    if (!calendar) return; // Sécurité si le calendrier n'est pas encore prêt

    // On vide les anciens événements
    calendar.removeAllEvents();

    reservations.forEach(res => {
        // // On transforme "2026-03-13 14:00:00" en "2026-03-13T14:00:00"
        const dateISO = res.date_d.replace(' ', 'T');

        // On ajoute l'événement avec l'heure
        calendar.addEvent({
            id: res.id,
            title: res.nom,
            start: dateISO,
            allDay: false, // OBLIGATOIRE pour voir l'heure
            extendedProps: {
                status: res.status
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    // 2. On assigne le calendrier à la variable globale
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        events: [
            {
                title: 'Réunion importante',
                start: '2026-03-13T14:30:00',
                allDay: false
            }
        ],
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }
    });

    calendar.render();
});


sejout = document.getElementById("sejour");
total = document.getElementById("total");

sejout.addEventListener("mouseover", function (event) {
    total.style.display = "flex";
});

sejout.addEventListener("mouseout", function (event) {
    total.style.display = "none";
});

sejout.addEventListener("click", () => {
    let box = document.querySelector(".center");
    let right = document.querySelector(".right");

    box.style.transform = "translateY(-100vh)";
    right.style.transform = "translateY(-100vh)";
})


function formulaire_payer() {
    return new Promise((resolve, reject) => {
        payement = document.getElementById("payement"); // Assure-toi que cet ID existe
        const topp = document.getElementById("top");

        // surplus.style.display = "flex";
        // payement.innerHTML = "";
        surplus = document.getElementById("surplus");
        surplus.style.display = "flex";



        confirmOrder = document.getElementsByName("confirmOrder")[0];
        previousStep = document.getElementsByName("previousStep")[0];


        confirmOrder.addEventListener("click", () => {
            const formData = new FormData(topp);
            const utilisateur_data = Object.fromEntries(formData.entries());

            payement.style.alignItems = "center";
            payement.style.justifyContent = "center";
            payement.innerHTML = "<h2>Payement Effectué</h2>"; // Message temporaire

            setTimeout(() => {
                surplus.style.display = "none";
                resolve(); // On résout après le message
                payement.innerHTML = `<div id="payement">
            <img src="" alt="">
            <div id="right">
                <form id="top">
                    <h1>Détail du Payement</h1>
                    <div class="line">
                        <div class="line-cote">
                            <label for="">Nom de la Carte</label>
                            <input type="text" name="nom_carte">
                        </div>

                        <div class="line-cote">
                            <label for="">Numéro de Carte</label>
                            <input name="num_carte" type="text">
                        </div>
                    </div>

                    <div>
                    <label for="date d'expiration">Date d'expiration de la carte</label>
                    <div class="line">
                    <div class="line-cote">
                    <select name="mois" id="">
                        <option value="" selected disabled>--Veuillez choisir une option--</option>
                        <option>Janvier</option>
                        <option>Fevriee</option>
                        <option>Mars</option>
                        <option>Avril</option>
                        <option>Mai</option>
                        <option>Juin</option>
                        <option>Juillet</option>
                        <option>Août</option>
                        <option>Septembre</option>
                        <option>Octobre</option>
                        <option>Novembre</option>
                        <option>Decembre</option>
                    </select>
                    </div>
                     <div class="line-cote">
                    <select name="annee" id="">
                        <option value="" selected disabled>--Veuillez choisir une option--</option>
                        <option>2015</option>
                        <option>2016</option>
                        <option>2017</option>
                        <option>2018</option>
                        <option>2019</option>
                        <option>2020</option>
                        <option>2021</option>
                        <option>2022</option>
                        <option>2023</option>
                        <option>2024</option>
                        <option>2026</option>
                        <option>2027</option>
                        <option>2028</option>
                        <option>2029</option>
                        <option>2030</option>
                    </select>
                    </div>
                    </div>
                    </div>

                    <div class="line">
                    <label for="cvv">CVV</label>
                    <input name="cvv" type="number">
                    </div>

                </form>
                <div id="bottom">
                    <button name="previousStep">Previous Step</button>
                    <button name="confirmOrder">Confirm Order →</button>
                </div>
            </div>
        </div>`;
            }, 2000);

        })

        previousStep.addEventListener("click", () => {
            surplus.style.display = "none";
            reject("Paiement annulé");
        }, { once: true });
    });
}


fifo = document.querySelector("#fifo");

