//const estConnecte = localStorage.getItem('client_connecte');

//if (estConnecte !== 'true') {
  //  alert("Vous devez être connecté pour accéder à la réservation.");
    // Redirige vers ta page de connexion 
 //   window.location.href = "connexion.html"; 
//}

// --- CONFIGURATION DU CAMPING ---
const NB_EMPLACEMENTS = 39;

const positionsTentes = [
    // --- GROUPE EN HAUT A GAUCHE  ---
    { id: 1,  top: '24%', left: '28%' },
    { id: 2,  top: '22.5%', left: '31.5%' },
    { id: 3,  top: '22%', left: '34.5%' },
    { id: 4,  top: '22%', left: '38%' },
    { id: 5,  top: '22.5%', left: '41.5%' },
    { id: 6,  top: '24.5%', left: '44.5%' },
    { id: 7,  top: '26.5%', left: '48%' },
    { id: 8,  top: '28%', left: '51%' },
    { id: 9,  top: '28.5%', left: '54.5%' },

    // --- GROUPE EN HAUT A DROITE  ---
    { id: 10, top: '26%', left: '63%' },
    { id: 11, top: '24.5%', left: '66.5%' },
    { id: 12, top: '23.5%', left: '69.5%' },
    { id: 13, top: '23%', left: '72.5%' },
    { id: 14, top: '23%', left: '75.5%' },
    { id: 15, top: '23.5%', left: '78.5%' },
    { id: 16, top: '25.5%', left: '82%' },

    // --- GROUPE COLONNE DROITE ET EN BAS ---
    { id: 17, top: '31%', left: '85%' },
    { id: 18, top: '36.5%', left: '86%' },
    { id: 19, top: '42%', left: '86.5%' },
    { id: 20, top: '49%', left: '88.5%' },
    { id: 21, top: '55.5%', left: '90%' },
    { id: 22, top: '62%', left: '90%' },
    { id: 23, top: '67.5%', left: '87%' },
    { id: 24, top: '71%', left: '83.5%' },
    { id: 25, top: '74%', left: '79.5%' },

    // --- GROUPE COLONNE GAUCHE ---
    { id: 26, top: '48%', left: '7%' },
    { id: 27, top: '42%', left: '7%' },
    { id: 28, top: '36%', left: '7.5%' },
    { id: 29, top: '30%', left: '10%' }
];

const positionsMobilome = [
    { id: 30, top: '56%', left: '58%' },
    { id: 31, top: '59%', left: '53%' },
    { id: 32, top: '58.5%', left: '48%' },
    { id: 33, top: '55.5%', left: '44%' },
    { id: 34, top: '51.5%', left: '40.5%' },
    { id: 35, top: '58%', left: '37%' },
    { id: 36, top: '51%', left: '35%' },
    { id: 37, top: '56%', left: '31.5%' }
];

const positionsCampingcar = [
    { id: 38, top: '79%', left: '71.5%' },
    { id: 39, top: '75%', left: '66.75%' }
];

const DATE_OUVERTURE_SAISON = "2026-01-01";
const DATE_FERMETURE_SAISON = "2026-12-31"; 


// --- 1. INITIALISATION ---
document.addEventListener('DOMContentLoaded', function() {
    gestionDates();
    initBaseDeDonnees();
    afficherPlan();
});

// --- 2. GESTION DES DATES ---
function gestionDates() {
    const inputDebut = document.getElementById('date-debut');
    const inputFin = document.getElementById('date-fin');
    const today = new Date().toISOString().split('T')[0];

    let dateMin = today;
    if (DATE_OUVERTURE_SAISON > today) 
        dateMin = DATE_OUVERTURE_SAISON;

    if(inputDebut) {
        inputDebut.min = dateMin;
        inputDebut.max = DATE_FERMETURE_SAISON;
        
        inputDebut.addEventListener('change', function() {
            if(inputFin) {
                inputFin.min = this.value;
                if (inputFin.value && inputFin.value < this.value) inputFin.value = "";
            }
        });
    }
    
    if(inputFin) {
        inputFin.min = dateMin;
        inputFin.max = DATE_FERMETURE_SAISON;
    }
}

// --- 3. CHARGEMENT ET CORRECTION DES DONNÉES ---
let placesDb;
let mesSelections = [];

function initBaseDeDonnees() {
    // On charge la base existante
    let savedData = JSON.parse(localStorage.getItem('camping_data'));
    
    // Si la base n'existe pas, on la crée
if (!savedData || savedData.length === 0) {
        savedData = [];
        
        // Liste des numéros qui doivent être LIBRES (les autres seront occupés)
        const placesLibres = [1, 3, 4, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 30, 31, 32, 33, 35, 36, 37, 38];

        for (let i = 1; i <= NB_EMPLACEMENTS; i++) {
            // Si le numéro 'i' est dans la liste ci-dessus -> 'libre', sinon -> 'occupe'
            let etatInit = placesLibres.includes(i) ? 'libre' : 'occupe';
            
            savedData.push({ id: i, etat: etatInit });
        }
    }

    placesDb = savedData.map(place => {
        const coords = positionsTentes.find(p => p.id === place.id) || positionsMobilome.find(p => p.id === place.id) || positionsCampingcar.find(p => p.id === place.id);
        return {
            ...place,
            top: coords ? coords.top : '0%',
            left: coords ? coords.left : '0%'
        };
    });

    sauvegarder(); 
}

// --- 4. GESTION DU PLAN (AFFICHAGE) ---
const planDiv = document.getElementById('plan-camping');

function afficherPlan() {
    if(!planDiv) return;
    planDiv.innerHTML = ""; 

    placesDb.forEach(place => {
        const div = document.createElement('div');
        div.classList.add('emplacement');
        
        div.style.top = place.top;
        div.style.left = place.left;
        
        div.title = "Emplacement N° " + place.id;

        
        // IDs 1 à 29 -> c'est une Tente
        if (place.id >= 1 && place.id <= 29) {
            div.classList.add('tente');
        }
        // IDs 30 à 37 -> c'est un Mobil-home
        else if (place.id >= 30 && place.id <= 37) {
            div.classList.add('mobilhome');
        }
        // IDs 38 ou 39 -> c'est un Camping-car
        else if (place.id === 38 || place.id === 39) {
            div.classList.add('campingcar');
        }

        // Gestion de l'état (Libre/Occupé/Sélectionné)
        let classeEtat = place.etat;
        if (mesSelections.includes(place.id)) classeEtat = 'selectionne';
        div.classList.add(classeEtat);

        // Ajout du clic uniquement si libre
        if (place.etat !== 'occupe') {
            div.onclick = () => toggleSelection(place.id);
        }

        planDiv.appendChild(div);
    });
    
    updateInterface();
}

// --- 5. ACTIONS ---
function toggleSelection(id) {
    if (mesSelections.includes(id)) {
        mesSelections = mesSelections.filter(item => item !== id);
    } else {
        mesSelections.push(id);
    }
    afficherPlan();
}

function updateInterface() {
    const spanListe = document.getElementById('liste-places');
    const btn = document.getElementById('btn-reserver');
    if(!spanListe || !btn) return;

    if (mesSelections.length > 0) {
        mesSelections.sort((a, b) => a - b);
        spanListe.innerText = "N° " + mesSelections.join(", ");
        btn.disabled = false;
        btn.style.backgroundColor = "#2196F3";
        btn.style.color = "white";
        btn.style.cursor = "pointer";
    } else {
        spanListe.innerText = "Aucun";
        btn.disabled = true;
        btn.style.backgroundColor = "#e0e0e0";
        btn.style.color = "#888";
        btn.style.cursor = "not-allowed";
    }
}

// --- 6. BOUTONS ---
const btnVoir = document.getElementById('btn-voir-dispo');
if(btnVoir) {
    btnVoir.addEventListener('click', function() {
        if (mesSelections.length===0) {
            alert("Veuillez sélectionner au moins un emplacement.");
            return;
        }
        const conteneur = document.getElementById('conteneur-calendriers');
        conteneur.innerHTML = "";
        mesSelections.forEach(idTente => {
            conteneur.innerHTML += `
                <div class="form-dates" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
                    <h3>Emplacement N° ${idTente}</h3>
                    
                    <div class="champ">
                        <label>Date d'arrivée :</label>
                        <input type="text" class="champ-date" id="date-debut-${idTente}">
                    </div>
                    
                    <div class="champ">
                        <label>Date de départ :</label>
                        <input type="text" class="champ-date" id="date-fin-${idTente}">
                    </div>
                </div>
            `;
        });
        flatpickr(".champ-date", {
            locale: "fr",            // Pour avoir le calendrier en français
            dateFormat: "Y-m-d",     // Le format parfait pour ton serveur PHP (Année-Mois-Jour)
            minDate: "today"         // Bloque toutes les dates dans le passé !
            });
        
        document.getElementById('etape1').style.display = 'none';
        document.getElementById('etape2').style.display = 'block';
    });
}

const btnRetour = document.getElementById('retour-plan');
if(btnRetour) {
    btnRetour.addEventListener('click', function() {
    document.getElementById('etape2').style.display = 'none';
    document.getElementById('etape1').style.display = 'block';
    });
}

const btnReserver = document.getElementById('btn-reserver');
if(btnReserver) {
    btnReserver.addEventListener('click', () => {
        if (mesSelections.length > 0) {

            let erreur = false;
            let listeReservations = mesSelections.map(idPlace => {
                const dateDebutTente = document.getElementById(`date-debut-${idPlace}`).value;
                const dateFinTente = document.getElementById(`date-fin-${idPlace}`).value;
                if (dateDebutTente === "" || dateFinTente === "" || dateFinTente <= dateDebutTente) {
                    erreur = true;
                }

                return {
                    "id_emplacement": idPlace,
                    "nb_membre": 2, 
                    "date_d": dateDebutTente,
                    "date_f": dateFinTente
                };
            });

            if (erreur === true) {
                alert("Vérifiez vos dates : tous les champs doivent être remplis et la date de départ doit être APRÈS la date d'arrivée.");
                return; 
            }

            const data = { 
                action: "ajouter_reservation", 
                infos: listeReservations 
            };
            console.log(listeReservations);
        }
    });
}


const btnReset = document.getElementById('btn-reset');
if(btnReset) {
    btnReset.addEventListener('click', () => {
        if(confirm("Effacer toutes les réservations ?")) {
            localStorage.removeItem('camping_data');
            location.reload();
        }
    });
}


function sauvegarder() {
    localStorage.setItem('camping_data', JSON.stringify(placesDb));
}