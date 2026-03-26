//const estConnecte = localStorage.getItem('client_connecte');

//if (estConnecte !== 'true') {
  //  alert("Vous devez être connecté pour accéder à la réservation.");
    // Redirige vers ta page de connexion (à adapter selon le nom de ton fichier)
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
// ---A faire : ajouter les coordonnées pour les mobilomes et les camping-cars  ---
const positionsMobilome = [
    { id: 30, top: '50%', left: '20%' },
    { id: 31, top: '50%', left: '25%' },
    { id: 32, top: '50%', left: '30%' },
    { id: 33, top: '50%', left: '35%' },
    { id: 34, top: '50%', left: '40%' },
    { id: 35, top: '50%', left: '45%' },
    { id: 36, top: '50%', left: '50%' },
    { id: 37, top: '50%', left: '55%' }
];

const positionsCampingcar = [
    { id: 30, top: '50%', left: '20%' },
    { id: 31, top: '50%', left: '25%' }
];

const DATE_OUVERTURE_SAISON = "2026-01-01";
const DATE_FERMETURE_SAISON = "2026-12-31"; 


// --- 1. INITIALISATION ---
document.addEventListener('DOMContentLoaded', function() {
    gestionDates();
    initBaseDeDonnees();
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
        const placesLibres = [1, 3, 4, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

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

// --- 4. GESTION DU PLAN ---
const planDiv = document.getElementById('plan-camping');

function afficherPlan() {
    if(!planDiv) return;
    planDiv.innerHTML = ""; 

    placesDb.forEach(place => {
        const div = document.createElement('div');
        div.classList.add('emplacement');
        
        // C'EST ICI QUE LES COORDONNÉES SONT APPLIQUÉES
        div.style.top = place.top;
        div.style.left = place.left;
        
        div.title = "Emplacement N° " + place.id;

        let classeEtat = place.etat;
        if (mesSelections.includes(place.id)) classeEtat = 'selectionne';
        div.classList.add(classeEtat);

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
        const debut = document.getElementById('date-debut').value;
        const fin = document.getElementById('date-fin').value;

        if (!debut || !fin) {
            alert("Veuillez sélectionner vos dates.");
            return;
        }
        
        document.getElementById('etape-1').style.display = 'none';
        document.getElementById('etape-2').style.display = 'block';
        
        afficherPlan();
    });
}

const btnReserver = document.getElementById('btn-reserver');
if(btnReserver) {
    btnReserver.addEventListener('click', () => {
        if (mesSelections.length > 0) {
            
            // 1. Au lieu de marquer "occupé", on met les choix dans un "Panier"
            localStorage.setItem('panier_en_cours', JSON.stringify(mesSelections));
            
            // 2. On sauvegarde aussi les dates et les personnes pour le récapitulatif
            localStorage.setItem('resa_debut', document.getElementById('date-debut').value);
            localStorage.setItem('resa_fin', document.getElementById('date-fin').value);
            
            // 3. On redirige vers la page de paiement
            console.log("Les emplacements " + mesSelections.join(", ") + " sont réservés pour les dates du " + localStorage.getItem('resa_debut') + " au " + localStorage.getItem('resa_fin')); 
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