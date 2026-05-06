// const { response } = require("express");

// const { response } = require("express");

// const { response } = require("express");

// const { response } = require("express");

// const { response } = require("express");

const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const menuOpen = ref(false);
    const id_famille = ref(66);
    const payeur = ref([]);
    const activites = ref([]);
    const fifo_activite = ref([]);
    const data = ref([]);
    const nb_membre = ref(null);
    const displayMenu = ref(true);
    const choiceMenu = ref();
    const emplacements = ref([]);
    const month = ref(new Date().toISOString().slice(0, 7));
    const date_debut = ref();
    const date_fin = ref();
    const NumEmplacement = ref();
    const ResaEmplacement = ref([]);
    const ChoiceOverlay = ref(null);
    const Infos_activites = ref([]);



    const Pos_emplacements = [
    { id: 1, x: 0, y: 20 },
    { id: 2, x: 0, y: 0 },
    { id: 3, x: 0, y: 0 },
    { id: 4, x: 0, y: 0 },
    { id: 5, x: 0, y: 0 },
    { id: 6, x: 0, y: 0 },
    { id: 7, x: 0, y: 0 },
    { id: 8, x: 0, y: 0 },
    { id: 9, x: 0, y: 0 },
    { id: 10, x: 0, y: 0 },
    { id: 11, x: 0, y: 0 },
    { id: 15, x: 0, y: 0 },
    { id: 12, x: 0, y: 0 },
    { id: 13, x: 0, y: 0 },
    { id: 14, x: 0, y: 0 },
]

    data.value = {
      id_famille: id_famille.value,
    };


    const get_payeur = (id) => {
      axios.get(`../../php/utilisateur.php?entity=payeur&id=66`, {
        params: { id_famille: id }
      })
      .then((response) => {
        payeur.value = response.data;
        console.log("le payeur");
        console.log(payeur.value)
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


    const deleteFifo = (id) => {
      axios.get(`../../php/admin/activites/fifo/delete/`+id).then(response => {
        loadData();
      })
    }


    const addFifoMb = (id) => {
      data.value = {"nb_membre_aj" : nb_membre.value}
      console.log(data.value);
      console.log(id);
      axios.post(`../../php/utilisateur.php?entity=activites&option=fifo&secondOption=addM&id=${id}`,data.value).then(response => {
        loadData();
      })
    }
    const delFifoMb = (id) => {
      data.value = {"nb_membre_aj" : nb_membre.value}
      console.log(data.value);
      console.log(id);
      axios.post(`../../php/utilisateur.php?entity=activites&option=fifo&secondOption=delM&id=${id}`,data.value).then(response => {
        loadData();
      })
    }


    const deleteReservationActivite = (id_res_activite) => {
      console.log(id_res_activite);
      axios.get(`../../php/admin.php?entity=activites&option=reservations&secondOption=delete&id=${id_res_activite}`).then(response => {
        loadData();
      })
    }



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

    // const get_fifo_activites = (id_famille) => {
    //   axios.get(`../php/utilisateur.php?entity=activite&option=fifo&id=`${id_famille}).then(response=> {
    //     fifo_activite.value = response.data;
    //   })
    // }


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



const disconnect = () => {
  axios.get('../php/login/disconnected').then(response => {
    if(response.data.status == "disconnected"){
      window.location.href = "login.html";
    }else{
      console.log("error lors de la deconnexion");
    }
  })
}





const isConnected = () => {
  axios.get('../php/login/isConnected').then(response => {
    console.log("fonctionnement de connexion");
    console.log(response.data);
    var res = response.data;
    if(res['status'] == 'disconnected'){
      window.location.href = "login.html";
    }else{
      if(res['admin'] == "admin"){
        window.location.href = "admin.php";
      }else{
        console.log("connecter pr famille");
        id_famille.value = res['id'];
      }
    }
  })
}

const InfoActivite = (id_activite) => {
  ChoiceOverlay.value = 'InfoActivite';
  Infos_activites.value.id_activite = id_activite;
  axios.get(`../../php/utilisateur.php?entity=activites&id=${id_activite}`).then(reponse => {
    Infos_activites.value = reponse.data;
    console.log(reponse.data);
  })
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



    const MajInfos = () => {
      axios.post(`../../php/utilisateur.php?entity=users&option=update`, payeur.value).then(response =>{
        loadData();
        alert(" Succès : Vos informations ont bien été modifiées !")
      })

    }

    const loadData = () => {
      get_activites_with_reservations(id_famille.value);
      get_payeur(id_famille.value);
      nb_membre.value = null; 
      get_emplacements(); 
      get_reservation_famille();

    };

    onMounted(() => {
      isConnected();
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
      ResaEmplacement,
      Pos_emplacements,
      ChoiceOverlay,
      InfoActivite,
      Infos_activites,
      disconnect,
      menuOpen,
      deleteReservationActivite,
      deleteFifo,
      addFifoMb,
      delFifoMb,
      MajInfos
    };
  }
}).mount('#app');