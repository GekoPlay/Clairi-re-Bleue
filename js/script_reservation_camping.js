const estConnecte = localStorage.getItem('client_connecte');

if (estConnecte !== 'true') {
    alert("Vous devez être connecté pour accéder à la réservation.");
    window.location.href = "connexion.html"; 
}

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

let placesDb = [];
let mesSelections = [];
let toutesLesReservations = []; // 📦 Va contenir la VRAIE base de données

// --- 1. INITIALISATION ---
document.addEventListener('DOMContentLoaded', async function() {
    
    // On demande toutes les réservations au PHP via Axios !
    try {
        const reponse = await axios.post('../php/api.php', { action: 'all_reservations' });
        if (Array.isArray(reponse.data)) {
            toutesLesReservations = reponse.data;
        }
    } catch(e) {
        console.error("Erreur de chargement des réservations avec le serveur", e);
    }

    flatpickr(".champ-date", {
        locale: "fr",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function() {
            mettreAJourLePlan(); // Dès qu'on modifie une date, le plan réagit
        }
    });
    
    initBaseDeDonnees();
    mettreAJourLePlan();
});

// --- 2. BASE DE DONNÉES LOCALE (Pour afficher les tentes) ---
function initBaseDeDonnees() {
    placesDb = [];
    for (let i = 1; i <= NB_EMPLACEMENTS; i++) {
        const coords = positionsTentes.find(p => p.id === i) || positionsMobilome.find(p => p.id === i) || positionsCampingcar.find(p => p.id === i);
        placesDb.push({ id: i, etat: 'libre', top: coords ? coords.top : '0%', left: coords ? coords.left : '0%' });
    }
}

// --- 3. COLORIAGE DYNAMIQUE (Rouge = Occupé, Vert = Libre) ---
function mettreAJourLePlan() {
    const dateDebutStr = document.getElementById('date-debut-global').value;
    const dateFinStr = document.getElementById('date-fin-global').value;

    // Si le client n'a pas encore choisi ses dates, toutes les tentes sont libres
    if (!dateDebutStr || !dateFinStr) {
        placesDb.forEach(place => place.etat = 'libre');
        afficherPlan();
        return;
    }

    const dDebut = new Date(dateDebutStr);
    const dFin = new Date(dateFinStr);

    placesDb.forEach(place => {
        place.etat = 'libre';
        
        // On vérifie dans la vraie BDD si la tente est occupée à ces dates
        const estOccupe = toutesLesReservations.some(resa => {
            // (status 1 = En attente, status 2 = Confirmé)
            if (resa.num_emplacement == place.id && (resa.status == 1 || resa.status == 2)) {
                const rDebut = new Date(resa.date_debut);
                const rFin = new Date(resa.date_fin);
                // Si les dates se chevauchent :
                return (dDebut < rFin && dFin > rDebut);
            }
            return false;
        });

        // Si c'est occupé, on colorie en rouge et on retire du panier si besoin
        if (estOccupe) {
            place.etat = 'occupe';
            mesSelections = mesSelections.filter(id => id !== place.id);
        }
    });

    afficherPlan();
}

function afficherPlan() {
    const planDiv = document.getElementById('plan-camping');
    if(!planDiv) return;
    planDiv.innerHTML = ""; 

    placesDb.forEach(place => {
        const div = document.createElement('div');
        div.classList.add('emplacement');
        div.style.top = place.top;
        div.style.left = place.left;
        div.title = "Emplacement N° " + place.id;

        if (place.id >= 1 && place.id <= 29) div.classList.add('tente');
        else if (place.id >= 30 && place.id <= 37) div.classList.add('mobilhome');
        else if (place.id === 38 || place.id === 39) div.classList.add('campingcar');

        let classeEtat = place.etat;
        if (mesSelections.includes(place.id)) classeEtat = 'selectionne';
        div.classList.add(classeEtat);

        // LE CLIC DYNAMIQUE
        if (place.etat !== 'occupe') {
            div.onclick = () => toggleSelection(place.id);
        } else {
            // Si c'est rouge, on ouvre le calendrier de secours !
            div.onclick = () => afficherDispoSpecifique(place.id);
        }

        planDiv.appendChild(div);
    });
    updateInterface();
}

// --- 4. LE CALENDRIER DE SECOURS (AVEC VRAIES DATES DE LA BDD) ---
function afficherDispoSpecifique(idTente) {
    const zone = document.getElementById('zone-calendrier-indispo');
    zone.style.display = 'block'; 

    // On isole les réservations de CETTE tente précise
    const resasTente = toutesLesReservations.filter(r => r.num_emplacement == idTente && (r.status == 1 || r.status == 2));
    
    // On formate les dates pour bloquer Flatpickr
    const datesInvalides = resasTente.map(r => {
        return {
            from: r.date_debut.split(' ')[0], 
            to: r.date_fin.split(' ')[0]
        };
    });

    zone.innerHTML = `
        <div style="background: #ffebee; padding: 20px; border-radius: 8px; border: 2px solid #ffcdd2;">
            <h3 style="color: #c62828; margin-top: 0; text-align: center;">Emplacement N°${idTente} indisponible à vos dates</h3>
            <p style="color: #333; text-align: center;">Voici le calendrier de cet emplacement (les dates grisées sont occupées par d'autres campeurs) :</p>
            <div style="display: flex; justify-content: center; margin-top: 15px;">
                <input type="text" id="cal-secours-${idTente}" style="display:none;">
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <button onclick="document.getElementById('zone-calendrier-indispo').style.display='none'" style="background: #c62828; color: white; padding: 10px 20px; border-radius: 5px; border: none; cursor: pointer;">Fermer ce calendrier</button>
            </div>
        </div>
    `;

    flatpickr(`#cal-secours-${idTente}`, {
        locale: "fr",
        inline: true, // Le calendrier s'affiche ouvert
        minDate: "today",
        disable: datesInvalides // On bloque les VRAIES dates du serveur !
    });
    
    // On glisse doucement l'écran vers le bas
    zone.scrollIntoView({ behavior: 'smooth' });
}

// --- 5. GESTION DU PANIER ---
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

// --- 6. VALIDER LA RÉSERVATION (ENVOI AU SERVEUR) ---
const btnReserver = document.getElementById('btn-reserver');
if (btnReserver) {
    btnReserver.addEventListener('click', async () => {
        
        const dateDebut = document.getElementById('date-debut-global').value;
        const dateFin = document.getElementById('date-fin-global').value;
        const nbPers = document.getElementById('nb-pers-global').value;

        if (dateDebut === "" || dateFin === "" || dateFin <= dateDebut || nbPers === "") {
            alert("Merci de remplir correctement vos dates et le nombre de personnes en haut de la page.");
            return; 
        }

        if (mesSelections.length > 0) {
            let toutEstOk = true;

            for (let idPlace of mesSelections) {
                
                // Le colis pour le PHP
                const data = { 
                    action: "reservation_emplacement",
                    id_famille: 51, // Famille 51 forcée pour tester sans inscription
                    num_emplacement: idPlace,
                    date_debut: dateDebut + " 12:00:00",
                    date_fin: dateFin + " 12:00:00"
                };

                try {
                    const response = await axios.post('../php/api.php', data);
                    if (response.data.status === "error" || response.data.status === "failed") {
                        toutEstOk = false;
                    }
                } catch (error) {
                    console.error("Erreur serveur", error);
                    toutEstOk = false;
                }
            }

            if (toutEstOk) {
                alert("🎉 Réservation validée ! Vos emplacements sont bien enregistrés.");
                window.location.href = "../index.html"; // On renvoie à l'accueil
            } else {
                alert("Mince, une erreur est survenue lors de la communication avec le serveur.");
            }
        }
    });
}

// Reset Admin
const btnReset = document.getElementById('btn-reset');
if(btnReset) {
    btnReset.addEventListener('click', () => {
        mesSelections = [];
        document.getElementById('date-debut-global').value = "";
        document.getElementById('date-fin-global').value = "";
        mettreAJourLePlan();
        document.getElementById('zone-calendrier-indispo').style.display = 'none';
    });
}