const { createApp, ref, onMounted, computed } = Vue;

createApp({
  setup() {
    const tab_res = ref([]);
    const triSelectionne = ref(""); 

    const get_activites = () => {
      axios.get("../../php/admin/activites").then(response => {
        tab_res.value = response.data;
      });
    };

    const activitesTriees = computed(() => {
      // On crée une copie pour ne pas toucher à l'original
      let items = [...tab_res.value];

      if (!triSelectionne.value) return items;

      return items.sort((a, b) => {
        if (triSelectionne.value === "prix-asc") return a.prix - b.prix;
        if (triSelectionne.value === "prix-desc") return b.prix - a.prix;
        
        // Pour les dates (format AAAA-MM-JJ recommandé)
        if (triSelectionne.value === "date-asc") return new Date(a.date) - new Date(b.date);
        if (triSelectionne.value === "date-desc") return new Date(b.date) - new Date(a.date);
        
        return 0;
      });
    });

    onMounted(() => {
      get_activites();
    });

    return {
      tab_res,
      triSelectionne,
      activitesTriees // C'est cette variable que le v-for utilise
    };
  }
}).mount('#app');  