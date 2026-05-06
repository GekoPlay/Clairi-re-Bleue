const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {


    const tab_res = ref([]);

    const get_activites = () => {
      axios.get("../../php/admin/activites").then(response => {
        
        tab_res.value = response.data;
      });
    };


    onMounted(() => {
      get_activites();
    });

    return {
      tab_res,
    };
  }
}).mount('#app');  