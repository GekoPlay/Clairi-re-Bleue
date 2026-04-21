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


    const reserverActivite = (id_activite) => {
      data.value.id_activite = id_activite;
      data.value.nb_membre = nb_membre.value;

      axios.post('../../php/utilisateur.php?entity=users&option=reservation&secondOption=add',data.value) .then((response) => {
        console.log("Réservation ajoutée :", response.data);
        loadData(); // Recharger les données après la réservation
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

    const deleteReservation = (id_reservation_activite) => {
      axios.delete(`../../php/utilisateur.php?entity=activites&option=delete&id=${id_reservation_activite}`)
        .then((response) => {
          console.log("Réservation supprimée :", response.data);
          loadData(); // Recharger les données après la suppression
        })
        .catch(err => console.error("Erreur API :", err));
    }

    const loadData = () => {
      get_activites_with_reservations(id_famille.value);
      get_payeur(id_famille.value);
      nb_membre.value = null; 
      get_emplacements(); 
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
      choiceMenu,emplacements
    };
  }
}).mount('#app');