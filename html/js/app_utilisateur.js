const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const id_famille = ref(66);
    const payeur = ref([]);
    const activites = ref([]);
    const data = ref([]);

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
      axios.post('../../php/reservation.php?entity=users&option=reservation&secondOption=add',data) .then((response) => {
        console.log("Réservation ajoutée :", response.data);
      })
      .catch(err => console.error("Erreur API :", err));
    };

    const deleteReservation = (id_reservation_activite) => {
      axios.delete('../../php/reservation.php?entity=users&option=reservation&secondOption=delete&id=' + id_reservation_activite).then((response) => {
        console.log("Réservation supprimée :", response.data);
      })
      .catch(err => console.error("Erreur API :", err));
    }

    const get_activites = () => {
      axios.get('../../php/admin/activites').then((response) => {
        activites.value = response.data;
      }).catch(err => console.error("Erreur API :", err));
    };

    onMounted(() => {
      get_payeur(id_famille.value);
      get_activites();
    });

    return { 
      id_famille, // Ajouté pour pouvoir l'utiliser dans le HTML
      payeur,
      get_payeur,
      activites,
      get_activites,
      reserverActivite,
      deleteReservation
    };
  }
}).mount('#app');