const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {

    const activite = {
      "nom" : '',
      "prix" : '',
      "description" : "",
      "date_d":"",
      "dare_f":"",
      "lieu":"",
      "capacite":""
    }


    const tab_res = ref([]);

    const get_activites = () => {
      axios.get("../../php/admin/activites").then(response => {
        
        tab_res.value = response.data;
      });
    };

    const get_activite_by_Id = () => {
      
    }

    onMounted(() => {
      get_activites();
    });

    return {
      tab_res,
      activite
    };
  }
}).mount('#app');  