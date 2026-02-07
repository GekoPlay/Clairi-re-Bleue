

// // RECUP LE GET DE LA BARRE DE URL
// const urlParams = new URLSearchParams(window.location.search);
// formule = urlParams.get('formule');
// console.log(formule);

// url_pos = document.getElementById("url");
// url_pos.innerHTML = "La formule choisie est : " + formule;


data = {
  "id_famille": 40,
  "action": "inscription_famille&payeur",
  "mail": "c@gmail.com",
  "password" : "mdp",
  "adresse" : "999 route du diable",
  "code_postal" : "666",
  "telephone" : "66666666",
  "ville" : "Enfer",
  "date_naissance" : "1066-07-14",
  "prenom" : "Lucifer",
  "nom": "Morningstar",
};

function recup_session(data){

    axios.post('../php/api.php',data)
        .then(response =>{
            console.log(response.data)
            if(response.data.status == 'success'){
                console.log(response.data.infos);
            }else{
                console.log(response.data.infos);
            }
        })
        .catch(error => {
            console.error("erreur lors de l'envoie");
            console.log(response.data.infos);
        })
    }

