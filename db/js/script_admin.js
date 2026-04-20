function api(data) {
    return axios.post('../php/api.php', data)
        .then(response => {
            if(response.data.currentDonnees != "NoSession"){
            console.log(response.data);
            generalDonnes = response.data.currentDonnees
            return response.data.currentDonnees;
            }else{
                window.location.href = "../html/utilisateur.html";

            }
        })
        .catch(error => {
            console.error("Erreur API :", error);
            throw error; 
        });
}


data_ss_admin  = { action : "session" }

let generalDonnes = [];

// -------------------- FUNCTION CREATE -------------------------------- //

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

// inscription();

// -------------------- FIFO RESERVATION EMPLACEMENT ------------------ //

const rightContent = document.getElementById("right_container");
const center = document.querySelector("#center_container");


afficheGeneral();
async function afficheGeneral(){
    response = await api(data_ss_admin);
    affiche_fifo_emplacement(response.file_attente_reservations);
    affiche_fifo_activites(response.file_attente_activite);   
}


async function affiche_fifo_emplacement(fifoEmplacement) {
    rightContent.innerHTML = "";
    create("h1", "", rightContent, "File d'attente des Réservations", "titre_fifo");

    fifoEmplacement.forEach(element => {

        let infosFamille = generalDonnes.les_familles.find(f=>id_famille = element.id_famille);
        let content = `
            <p>N° ${element.num_emplacement}</p>
            <p>Famille ${infosFamille.payeur.nom
            }</p>
        `;

        if (element.status == 1) {
            content += `
                <button name="accepter" class="Accepter">Accepter</button>
                <button name="refuser" class="Refuser">Refuser</button>
            `;
        }else if(element.status == -1){
            content += `<p>Reservation Annulée</p>`
        
        }else if(element.status == 2){
            content += `<p>Reservation Confirmée</p>`;
        }

        let div = create("div", "", rightContent, content, "element_attente");

        if (element.status == 1) {
            const boutons = div.querySelectorAll("button");
            boutons.forEach(bouton => {
                bouton.addEventListener("click", () => {
                    console.log(`Action ${bouton.name} sur l'emplacement ${element.num_emplacement}`);
                    gerer_action(bouton.name,"ReservationEmplacement",element.num_emplacement);
                });
            });
        }
    });
}

async function affiche_fifo_activites(fifoActivite) {
    center.innerHTML ="";
    if(fifoActivite){
        fifoActivite.forEach(activite =>{
        let infosFamille = generalDonnes.les_familles.find(f=> id_famille = activite.id_famille);
        let infosActivites = generalDonnes.activites.find(f=> id = activite.id_activite);
        console.log("les infos de la famille");
        console.log(infosFamille);
        content = `
            <p>Famille ${infosFamille.payeur.nom}</p>
            <p>Activites ${infosActivites.nom}<p>
        `
        console.log("activite");
        console.log(activite);

        if (activite.status ==1){
            // attente
            content += `
                <button name="accepter">Accepter</button>
                <button name="refuser">Refuser</button>
            `
// buttonRefuser.addEventListener("click", () => {
//     gerer_action("Refuser", activiteType, activite.id_activite);
// });
            
        }else if(activite.status == -1){
            //annulé
            content += `Reservation Annulée`
        }else{
            //confirmé
            content += 'Reservation Confirmée'
        }

        let div = create("div","",center,content,"");

        const boutons = div.querySelectorAll("button");
            boutons.forEach(bouton => {
                bouton.addEventListener("click", () => {
                    console.log(`Action ${bouton.name} et element ${activite.status} `);
                    gerer_action(bouton.name,"ReservationActivite",activite.id_activite);
                });
            });
        })
    }
}


async function gerer_action (action,type,clee){
    let data = {
        "action" :  action,
        "typeAction" :type,
        "clee" : clee
    }
    console.log(data);
    const confirmation = confirm("Voulez-vous vraiment " + action + " cette réservation ?");
    if (confirmation) {
    console.log(data);
    response = await api(data);
    if(type == "ReservationActivite"){
    affiche_fifo_activites(response.file_attente_activite)
    }else{
    affiche_fifo_emplacement(response.file_attente_reservations);
    }
}

}


async function inscription(){
    let data = {
        action : "reservation_emplacement",
        id_famille : 51,
        num_emplacement : 1,
        date_debut : "2026-03-15 12:58:07", 
        date_fin : "2026-03-17 12:58:07"
    }
    response = await api(data);
    console.log(response);}


function Deco(){
    console.log("deoc");
    let data = { action: "deconnexion" };
    api(data);
};