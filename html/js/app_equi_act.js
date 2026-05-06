const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {

    const activite = ref({
      "nom" : '',
      "prix" : '',
      "description" : "",
      "date_d":"",
      "date_f":"",
      "lieu":"",
      "cap_act":""
    });


    const activites = ref([]);

    const get_activites = () => {
      axios.get("../../php/admin/activites").then(response => {
        activites.value = response.data;
      });
    };

    const get_activite_by_Id = () => {
      
    }




    // const update_activites = () => {
    //   axios.post("",data.value).then(response =>{
    //     activite.value = response.data;        
    //   })
    // }


    const creation_activites = () => {
      console.log(activite.value);
      axios.post('../../php/admin.php?entity=activites&option=add', activite.value)
        .then(response => {
          // console.log("gooo");
          console.log(response.data);
        })
        .catch(error => console.error('Erreur POST:', error));
    };
    onMounted(() => {
      get_activites();
    });

    return {
      activite,
      activites,
      creation_activites
    };
  }
}).mount('#app');  