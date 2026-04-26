const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const id_famille = ref(66);
    const payeur = ref([]);
    const activites = ref([]);
    const data = ref([]);
    const nb_membre = ref(null);
    const displayMenu = ref(true);
    const choiceMenu = ref('emplacement');
    const emplacements = ref([]);
    const month = ref(new Date().toISOString().slice(0, 7));
    const date_debut = ref();
    const date_fin = ref();
    const NumEmplacement = ref();
    const ResaEmplacement = ref([]);

    data.value = {
      id_famille: id_famille.value,
    };


    const get_payeur = (id) => {
      axios.get(`../../php/utilisateur.php?entity=payeur&id=66`, {
        params: { id_famille: id }
      })
      .then((response) => {
        payeur.value = response.data;
      })
      .catch(err => console.error("Erreur API :", err));
    };

    const get_reservation_famille = () => {
      console.log("Récupération de la réservation d'emplacement pour la famille ID :", id_famille.value);
      
      axios.get(`../../php/utilisateur.php?entity=emplacements&option=reservation&id=${id_famille.value}`)
        .then((response) => {
          console.log("Réponse de l'API pour la réservation d'emplacement :", response.data);
          ResaEmplacement.value = response.data;
          console.log("Réservation d'emplacement de la famille :", ResaEmplacement.value);
        })
        .catch(err => console.error("Erreur API :", err));
    }

    const reserverActivite = (id_activite) => {
      data.value.id_activite = id_activite;
      data.value.nb_membre = nb_membre.value;

      axios.post('../../php/utilisateur.php?entity=users&option=reservation&secondOption=add',data.value) .then((response) => {
        console.log("Réservation ajoutée :", response.data);
        loadData(); // Recharger les données après la réservation
      })
      .catch(err => console.error("Erreur API :", err));
    };




    const deleteReservation = (id_res_empl) => {
      axios.post(`../../php/utilisateur.php?entity=emplacements&option=delete&id=${id_res_empl}`)
        .then((response) => {
          alert("Réservation supprimée !");
          console.log("Réservation supprimée :", response.data);
          get_reservation_famille(); // Recharger les réservations après suppression
        })
        .catch(err => console.error("Erreur API :", err));
    };


    const get_activites_with_reservations = (id_famille) => {
      axios.get(`../../php/utilisateur.php?entity=activites&option=with_reservations&id=${id_famille}`).then((response) => {
        activites.value = response.data;
        console.log("Activités avec réservations :", activites.value); 
      }).catch(err => console.error("Erreur API :", err));
    };


    const get_emplacements = () => {
    axios.get('../../php/admin/emplacements/mois/' + month.value).then(response => {
    emplacements.value = response.data
    console.log(response.data);
   });
}



  const InscrireFamilleEmplacement = (num_emplacement) => { 
  const data = {
    num_emplacement: num_emplacement,
    id_famille: id_famille.value,
    nb_membre: nb_membre.value,
    date_debut: date_debut.value,
    date_fin: date_fin.value
  };

  NumEmplacement.value = num_emplacement;
  console.log("Numéro d'emplacement sélectionné :", NumEmplacement.value);
  console.log("Données envoyées à l'API :", data);

  axios.post('../../php/admin/emplacements/reservations/add', data).then(response =>{
    if (response.data.status === 'compromis'){

    calendrier.value = response.data.calendrier;
    console.log(calendrier.value);
    creneauxDispo();
    }
    else if(response.data.status === 'success'){
      alert("Réservation réussie !");
    }
  })
  loadData();
};
  
const calendrier = ref([]);

const creneaux = ref([]);



const creneauxDispo = () => {
  console.log(calendrier.value);

  const datesLibres = calendrier.value
    .filter(cal => cal.reservation === null)
    .map(cal => cal.date);

  creneaux.value = grouperDatesConsecutives(datesLibres);
  console.log("Voici les créneaux :", creneaux.value);
};



const grouperDatesConsecutives = (dates) => {
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


    const ajouterMembreActivite = (id_activite,id_res_act) => {
      data.value.id_activite = id_activite;
      data.value.id_reservation_activite = id_res_act;
      data.value.nb_membre = nb_membre.value;
      console.log("Données envoyées pour ajouter membre :", data.value);
      axios.post(`../../php/utilisateur.php?entity=activites&option=ajouter_membre`, data.value)
        .then((response) => {
          console.log("Membre ajouté :", response.data);
          loadData(); // Recharger les données après l'ajout

        })
        .catch(err => console.error("Erreur API :", err));
    }

    const retirerMembreActivite = (id_activite,id_res_act) => {
      data.value.id_activite = id_activite;
      data.value.id_reservation_activite = id_res_act;
      data.value.nb_membre = nb_membre.value;
      axios.post(`../../php/utilisateur.php?entity=activites&option=retirer_membre`, data.value)
        .then((response) => {
          console.log("Membre retiré :", response.data);
          loadData(); // Recharger les données après le retrait
        })
        .catch(err => console.error("Erreur API :", err));
    }



    const loadData = () => {
      get_activites_with_reservations(id_famille.value);
      get_payeur(id_famille.value);
      nb_membre.value = null; 
      get_emplacements(); 
      get_reservation_famille();
    };

    onMounted(() => {
      loadData();
    });

    return { 
      id_famille, // Ajouté pour pouvoir l'utiliser dans le HTML
      payeur,
      get_payeur,
      activites,
      get_activites_with_reservations,
      reserverActivite,
      deleteReservation,
      ajouterMembreActivite,
      retirerMembreActivite,
      nb_membre,
      displayMenu,
      choiceMenu,emplacements,
      date_debut,
      date_fin,
      InscrireFamilleEmplacement,
      creneaux,
      calendrier,
      NumEmplacement,
      ResaEmplacement

    };
  }
}).mount('#app');