const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const age = ref(15);

    const prenom = ref();


    const ageplus = () =>{
      console.log(age.value);
      age.value = age.value +1;
    }

    const dico = ref({"nom" : "mael", "age" : 20});

    const tab = ref([{"nom" : "mael", "age" : 20},{"nom" : prenom, "age" : 20}]);

    

    const tab_act = ref([{"prix" : 12, "date_d" : "2026-04-02 09:12:44", "date_f" : "2026-04-02 09:12:44","id" : 87, "nom" : "Kayak", "cap_act" : 15, "description" : "venez faire du kayak svp", "lieu" : "Pontons du lac"}, 
      {"prix" : 15, "date_d" : "2026-04-03 09:12:44", "date_f" : "2026-04-03 10:12:44","id" : 150, "nom" : "Yoga", "cap_act" : 20, "description" : "venez faire du yoga svp", "lieu" : "Salle de yoga"}])

    

  



    onMounted(() => {
    });

    return { 
        age,
        ageplus,
        tab,
        dico,
        tab_act,
    };
  }
}).mount('#app');