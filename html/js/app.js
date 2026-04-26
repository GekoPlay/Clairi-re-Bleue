
const { createApp, ref, onMounted, computed} = Vue;

createApp({
  setup() {
    const familles = ref([]);
    const activites = ref([]);
    const fifo_activites = ref([]);
    const participants = ref([]);
    const visibleChoice = ref();
    const visible = ref();
    visible.value = false;
    visibleChoice.value = false;
    const Choice = ref(null);
    const fifo_emplacements = ref([]);
    const emplacements = ref([]);
    const msg = ref(null);
    
    const aujourdhui = new Date();
    console.log("aujourdhui" + aujourdhui);

    const debutAnnee = new Date(aujourdhui.getFullYear(),0,0);
    console.log(debutAnnee);


const month = ref(new Date().toISOString().slice(0, 7));


    // Fonction pour générer un état vide
    const nullnvlFamille = () => ({
      nom: null,
      prenom: null,
      date_n: null,
      mail: null,
      tel: null,
      adresse: null,
      ville: null,
      code_postal: null,
      password: null
    });

    const currentDate = ref(new Date());

    const NumEmplacementChoisi = ref(null);
// Formatage pour affichage SQL
const today = computed(() => 
    currentDate.value.toISOString().slice(0, 10) // "2026-04-01"
);

const todayEU = computed(() => {
    const [year, month, day] = today.value.split('-');
    return `${day}/${month}/${year}`; // "01/04/2026"
});

const datePrev = () => {
    const d = new Date(currentDate.value);
    d.setDate(d.getDate() - 1);
    currentDate.value = d;
    loadData();
};

const dateNext = () => {
    const d = new Date(currentDate.value);
    d.setDate(d.getDate() + 1);
    currentDate.value = d;
    loadData();
};

    const nvlFamille = ref(nullnvlFamille());

    const FamilleChoice_id = ref();

    const nullnvlActivite  = () => ({
      nom: null,
      prix: null,
      cap_act: null,
      date_d: null,
      date_f: null
    });

    const NBMembres = ref();

    const reservations_emplacements = ref([]);

    


    const nouvelleActivite = ref(nullnvlActivite());

    const apiGet = (url) => {
      return axios.get(url).then(res => res.data).catch(err => console.error(err));
    };

    const afficheFamille = () => {
      apiGet('../../php/admin/familles/withPayeur').then(data => {
        if (data) {
          familles.value = data;
          familles.value.forEach((famille, index) => {
            apiGet(`../../php/admin/familles/NbMembre/${famille.id_famille}`).then(nb => {
              familles.value[index].nb_membres = nb;
            });
          });
          console.log(familles.value);
        }
      });
    };
















































    

    const loadData = () => {
      afficheFamille();
      console.log("afficher la famille");
      console.log(familles);
      apiGet('../../php/admin/activites').then(data => activites.value = data);
      apiGet('../../php/admin/activites/fifo').then(data => fifo_activites.value = data);
      apiGet('../../php/admin/emplacements').then(data => emplacements.value = data);
      // apiGet('../../php/admin/emplacements/reservations').then(data => reservations_emplacements.value = data);
      apiGet(`../../php/admin/emplacements/reservations/BetweenDate/${today.value}`).then(data => reservations_emplacements.value = data ?? []);
      ChercherEmplacements();
      };

    const handleDelete = (id) => {
      if (confirm("Supprimer ?")) {
        apiGet('../../php/admin/activites/delete/' + id).then(result => {
          if (result.status === "success") {
            activites.value = activites.value.filter(a => a.id !== id);
          }
        });
      }
    };

    const reservationDelete = (id) => {
  if(confirm("Supprimer")) {
    axios.get("../php/admin/activites/reservations/delete/" + id).then(result => {
      if(result.data.status === 'success') {
        participants.value = participants.value.filter(p => p.id_famille !== id)
      }
    })
  }
}

    const handleAccept = (donnes) => {
      axios.post("../../php/admin/activites/fifo/accept",donnes).then(response =>{
        const result = response.data;
        if (result.msg === "success"){
          loadData();
        }else{
          alert("Error : "+ result.msg );
        }
      })
    }

    const findParticipantsActivite = (id) => {
      axios.get("../../php/admin/activites/participants/" + id).then(response => {
          participants.value = response.data;
          visible.value = true;
      })
    }




 const InscrireFamilleAFifo = (id_activite) => { // Correction du nom (ajout du 's')
    
    // On vérifie que NBMembres n'est pas vide
    if (!NBMembres.value) {
        alert("Veuillez saisir un nombre de membres.");
        return;
    }

    const data = {
        id_activite: id_activite,
        id_famille: FamilleChoice_id.value,
        nb_membre: NBMembres.value 
    };

    axios.post("../../php/admin/activites/fifo/add", data)
        .then(response => {
            if (response.data.status === "success") {
                alert("Inscription réussie !");
                loadData(); 
                Choice.value = null;
                NBMembres.value = null;
                console.log("Choice est a " + Choice.value);
            } else {
                alert("Erreur : " + response.data.msg);
            }
        })
        .catch(err => console.error("Erreur d'envoi :", err));
};

 const InscrireF_A = (id_activite) => { // Correction du nom (ajout du 's')
    
    // On vérifie que NBMembres n'est pas vide
    if (!NBMembres.value) {
        alert("Veuillez saisir un nombre de membres.");
        return;
    }

    const data = {
        id_activite: id_activite,
        id_famille: FamilleChoice_id.value,
        nb_membre: NBMembres.value 
    };

    axios.post("../../php/admin/activites/reservations/add", data)
        .then(response => {
            if (response.data.status === "success") {
                alert("Inscription réussie !");
                loadData(); 
                Choice.value = null;
                NBMembres.value = null;
                console.log("Choice est a " + Choice.value);
            } else {
                alert("Erreur : " + response.data.msg);
            }
        })
        .catch(err => console.error("Erreur d'envoi :", err));
};

      //finir ça faire page admin.php --> nomralement ds fichier activites il y etst deaj une focntion faites


    const handleRefuse = (id) => {
      if (confirm("Refuser ?")) {
        apiGet('../../php/admin/activites/fifo/delete/' + id).then(result => {
          if (result.status === "success") {
            fifo_activites.value = fifo_activites.value.filter(f => f.id_attente !== id);
          }
        });
      }
    };


const dateDebutEmplacement = ref(null);
const dateFinEmplacement = ref(null);
const FamillesFrise = ref([]);
// const calendrier = ref([]);

const eventTimeline = () => {
  const events = FamillesFrise.value.map(item => {
    const [y1, m1, d1] = item.date_debut.split('-');
    const [y2, m2, d2] = item.date_fin.split('-');

    return {
      start_date: { year: y1, month: m1, day: d1 },
      end_date:   { year: y2, month: m2, day: d2 },
      text: {
        headline: `Réservation #${item.id_res_empl}`,
        text:     `Famille : ${item.id_famille}`
      }
    };
  });

  return events;
};


const calendrier = ref([]);
const msgInscription = ref(null);


const InscrireF_E = (num_emplacement) => {
  const data = {
    num_emplacement: num_emplacement,
    id_famille: FamilleChoice_id.value,
    nb_membre: NBMembres.value,
    date_debut: dateDebutEmplacement.value,
    date_fin: dateFinEmplacement.value
  };

  console.log("Données envoyées à l'API :", data);

  axios.post('../../php/admin/emplacements/reservations/add', data).then(response =>{
    if (response.data.status === 'compromis'){

    
    calendrier.value = response.data.calendrier;
    console.log("la focntion")
    console.log(calendrier.value);
    creneauxDispo();
    }
    else if(response.data.status === 'success'){
      Choice.value = 'S';
    }
  })
  loadData();
};


const InscrireFamilleEmplacment =(num_emplacement) => {
  InscrireF_E(num_emplacement);
}



const creneaux = ref([]);


const creneauxDispo = () => {
  console.log(calendrier.value);

  const datesLibres = calendrier.value
    .filter(cal => cal.reservation === null)
    .map(cal => cal.date);

  creneaux.value = grouperDatesConsecutives(datesLibres);
  console.log("Voici les créneaux :", creneaux.value);
};












  // const res = await InscrireF_E(num_emplacement); // ✅ attend le résultat

  // if (res.status === "success") {
  //   loadData();
  //   msg.value = "Inscription Réussie";

  // } else if (res.status === "compromis") {
  //   msg.value = res.msg;                          // ✅ res, pas response
  //   FamillesFrise.value = res.familles;  
  // }
 

const reservationEmpDelete = (id_res_empl) => {
  if (confirm("Supprimer cette réservation ?")) {
    axios.get("../../php/admin/emplacements/reservations/delete/" + id_res_empl).then(result => {
      if (result.data.status === 'success') {
        loadData();
      } else {
        alert("Erreur : " + (result.data ? result.data.msg : "Pas de réponse"));
      }
    }).catch(err => console.error(err));
  }
}



const dateDispo = ref([]);

const parcourirDates = (dateDebut, dateFin) => {
  dateDispo.value = [];
  let dateCourante = new Date(dateDebut);
  const dateLimite = new Date(dateFin);

  while (dateCourante <= dateLimite) {

    // console.log("Date traitée :", dateCourante.toDateString());
    res = RerservationDurantCetteDate(dateCourante);

    if (res){
      console.log("il ya des gens");
    }
    else{
      dateDispo.value.push(new Date(dateCourante))
    }

    dateCourante.setDate(dateCourante.getDate() + 1);
  }
};


const RerservationDurantCetteDate = (date) => {
  let familleTrouvee = null;
  
  // On crée une copie de la date de test à MINUIT
  const dTest = new Date(date);
  dTest.setHours(0, 0, 0, 0);

  FamillesFrise.value.forEach(famille => {
    const debut = new Date(famille.date_debut);
    debut.setHours(0, 0, 0, 0);
    
    const fin = new Date(famille.date_fin);
    fin.setHours(0, 0, 0, 0);

    if (dTest >= debut && dTest <= fin) {
      familleTrouvee = famille;
    }
  });
  return familleTrouvee;
};


const grouperDatesConsecutives = (dates) => {
  // 1. Si pas de dates, on s'arrête.
  if (dates.length === 0) return [];

  const creneaux = [];
  let debut = dates[0]; 
  let fin = dates[0];

  for (let i = 1; i < dates.length; i++) {
    const lendemainAttendu = new Date(fin.split(' ')[0]);
    lendemainAttendu.setDate(lendemainAttendu.getDate() + 1);

    const lendemainStr = lendemainAttendu.toISOString().split('T')[0];
    
    const jourActuelStr = dates[i].split(' ')[0];

    if (lendemainStr === jourActuelStr) {
      fin = dates[i]; 
    } else {
      creneaux.push({ 
        id: creneaux.length + 1, 
        debut: debut,
        fin: fin      
      });
      debut = dates[i];
      fin = dates[i];
    }
  }

  creneaux.push({ 
    id: creneaux.length + 1, 
    debut: debut,
    fin: fin
  });

  return creneaux;
};

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;

  };

const reserverCreneau = (creneau) => {

  dateDebutEmplacement.value = creneau.debut
  dateFinEmplacement.value = creneau.fin;
  
  console.log("Nouvelles dates :", dateDebutEmplacement.value, dateFinEmplacement.value);
  InscrireF_E(NumEmplacementChoisi.value);
  
};







const getDuree = (date_debut, date_fin) => {
    const debut = new Date(date_debut);
    const fin = new Date(date_fin);
    const joursBloc = (fin - debut) / (1000 * 60 * 60 * 24);
    
    // total de la frise = du premier au dernier jour dans msg
    const premierJour = new Date(msg.value[0].date_debut);
    const dernierJour = new Date(msg.value[msg.value.length - 1].date_fin);
    const joursTotal = (dernierJour - premierJour) / (1000 * 60 * 60 * 24);
    
    return (joursBloc / joursTotal) * 100; // % sur la frise
};





    const createFamily = () => {
      axios.post("../../php/admin/familles/create", nvlFamille.value)
        .then(response => {
          const result = response.data;
          if (result.status === "success") {
            loadData();
            nvlFamille.value = nullnvlFamille(); 
          } else {
            alert("Erreur : " + result.msg);
          }
        })
        .catch(err => console.error(err));
    };




    const SuprimerFamille = (id) => {
    if (!confirm("Supprimer cette famille ?")) return;
    
    apiGet("../../php/admin/familles/delete/" + id).then(result => {
        if (result && result.status === 'success') {
            familles.value = familles.value.filter(f => f.id_famille !== id);
        } else {
            alert("Erreur : " + (result ? result.msg : "Pas de réponse"));
        }
    });
};


const ChercherEmplacements = () => {

  axios.get('../../php/admin/emplacements/mois/' + month.value).then(response => {
    emplacements.value = response.data
    console.log(response.data);
   });
}

    
    const ajoutAct = () => {
      axios.post('../../php/admin.php?entity=activites&option=add', nouvelleActivite.value)
        .then(response => {
          const result = response.data;
          if (result.status === "success") {
            loadData();
            nouvelleActivite.value = nullnvlActivite();
          } else {
            alert("Erreur : " + (result ? result.msg : "Données reçues nulles"));
          }
        })
        .catch(error => console.error('Erreur POST:', error));
    };

    onMounted(loadData);

    return { 
    familles, activites, participants, nouvelleActivite, fifo_activites, 
    handleDelete, ajoutAct, handleRefuse, nvlFamille, createFamily, SuprimerFamille,
    handleAccept, findParticipantsActivite, visible, visibleChoice, reservationDelete,
    Choice, FamilleChoice_id, NBMembres, InscrireF_A, InscrireFamilleAFifo,
    emplacements, fifo_emplacements, reservations_emplacements, todayEU,
    datePrev, dateNext,InscrireF_E,dateDebutEmplacement,dateFinEmplacement,NumEmplacementChoisi,msg,getDuree,reserverCreneau,InscrireFamilleEmplacment,calendrier,creneaux,month,ChercherEmplacements,reservationEmpDelete
  };
  }
}).mount('#app');