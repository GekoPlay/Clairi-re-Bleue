
const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const action = ref('connexion');
    
    const connexion = ref({
        mail_saisi: '',
        password_saisi: ''
    });

    const inscription = ref({
      nom : '',
      prenom : '',
      date_n : '',
      mail : '',
      tel : '',
      adresse : '',
      ville : '',
      code_postal : '',
      password : '',
      confirm_password : ''
    })

    const error = ref(null);

    const handleLogin = () => {
      console.log(connexion.value);
      axios.post('../../php/login/connected',connexion.value).then(response => {
        let res = response.data;
        if (res.status == "success"){
          if(res.role == "equipe_tech"){
            window.location.href = "admin.html";
          }else{
            window.location.href = "utilisateur.html";
          }
        } else if(res.status == "failed" && res.debug){
          console.log(res);
          error.value = "Mot de Passe ou Adresse Mail Incorrect";
        }else{
          console.log("error");
        }
      })
    }

    const handleRegister = () => {
      if (inscription.value.confirm_password != inscription.value.password){
        error.value = "Les mots de passe ne correspondent pas";
      }else{
        console.log("mdp correspondent")
        axios.post('../php/admin/familles/create',inscription.value).then(response =>  {
          if(response.data.status == "success"){
            connexion.value.mail_saisi = inscription.value.mail;
            connexion.value.password_saisi = inscription.value.password;
            console.log(connexion.value);
            handleLogin();
          }else{
            console.log(response.data);
            error.value = response.data.msg;
          }
        })
      }
    }











    onMounted(() => {
    });

    return { 
        action,
        connexion,
        handleLogin,
        error,
        inscription,
        handleRegister
    };
  }
}).mount('#app');