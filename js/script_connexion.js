console.log("Script 'script_connexion.js' chargé avec succès.");
    const page = document.getElementById("formulaire");






function pageConnexion() {
    page.innerHTML = `
   <h1>De Retour ?</h1>
        <div clutilisateur.htmlass="label">
        <label for="mail">Adresse mail :</label>
        <input type="text" id="Mail" name="mail" required>
        </div>
        <div class="label">
        <label for="password">Mot de passe :</label>
        <input type="password" id="password" name="password" required></div>
                <input type="submit" id="submit" name="submit" >       
                <div class="links">
                <a href="#" id="NoInscrit" onclick="pageInscription()">Vous n'etes pas inscrit ?</a>
        <a href="#" id="MotDePasseOublie" onclick="MotDePasseOublie()">Oups..j'ai oublié mon mot de passe</a></div>
        <div id="notif"></div>
                `;
notif = document.getElementById("notif");

    document.getElementById("submit").addEventListener("click", function(event) {
            event.preventDefault();
            data = new FormData(page); // me permt de plsu simplement récup les données --> obtient un tableau pas exploitable directement
            utilisateur_data = Object.fromEntries(data.entries()); //retranscit en un tableau
            utilisateur_data.action = "connexion_famille";
            console.log(utilisateur_data);
            api(utilisateur_data);
    });
}

function pageInscription() {
    page.innerHTML = `
        <h1>Il y a une première fois à tous</h1>
        <div class="cote">
        <div class="label">
        <label for="Nom">Nom :</label>
        <input type="text" id="nom" name="nom" required>
        </div>

        <div class="label">
        <label for="Prenom">Prénom :</label>
        <input type="text" id="prenom" name="prenom" required>
        </div>
        </div>

        <div class="cote">
        

        <div class="label">
        <label for="Nom">Adresse Mail : </label>
        <input type="text" id="mail" name="mail" required>
        </div>

        <div class="label">
        <label for="telephone">Télephone</label>
        <input type="text" id="telephone" name="telephone" required>
        </div>
        </div>

        <div class="label">
        <label for="adresse">Adresse :</label>
        <input type="text" id="adresse" name="adresse" required>
        </div>

        <div class="cote">
        <div class="label">
        <label for="Adresse">Ville :</label>
        <input type="text" id="ville" name="ville" required>
        </div>

        <div class="label">
        <label for="Code">Code postal :</label>
        <input type="text" id="code_postal" name="code_postal" required>
        </div>
        </div>

        
        <div class="label">
        <label for="password">Mot de passe :</label>
        <input type="password" id="password" name="password" required></div>

        <div class="label">
        <label for="password">Confirmation Mot de passe :</label>
        <input type="password" id="confirm_password" name="confirm_password" required></div>
                       <div class="links">

        <button id="submit" name="submit" >S'inscrire</button>
                <div id="notif"></div>

        <a href="#" onclick="pageConnexion()">Retour</a>
    `;


    notif = document.getElementById("notif");
    document.getElementById("submit").addEventListener("click", function(event) {
        var password = document.getElementById("password").value;
                    event.preventDefault();

        var confirm_password = document.getElementById("confirm_password").value;
        if (password !== confirm_password) {
            document.getElementById("confirm_password").style.borderColor = "red";
        }else{
            data = new FormData(page); // me permt de plsu simplement récup les données --> obtient un tableau pas exploitable directement
            nvl_utilisateur = Object.fromEntries(data.entries()); //retranscit en un tableau
            nvl_utilisateur.action = "inscription_famille&payeur";
            console.log(nvl_utilisateur);
            api(nvl_utilisateur);    
        }
    });
}







function MotDePasseOublie(){
    page.innerHTML = `<h1>Ça arrive même au meilleur(e)s...</h1>
    
    <div class="label notif">
        <input type="email" id="mail">

    <p>Un mail vous sera envoyé pour reinitialiser votre mot de passe </p>
    <button id="submit">Envoyer</button>
    </div>
    <a href="#" onclick="pageConnexion()">Retour</a>
    `;

    document.getElementById("submit").addEventListener("click", function(event) {
        mail = document.getElementById("mail").value;
        console.log(mail);
    });

}




function api(data){

    axios.post('../php/api.php',data)
        .then(response =>{
            console.log(response.data)
            if(response.data.status == 'success'){
                if (response.data.action == 'connexion_famille') {
                    window.location.href="utilisateur.html";
                }else{
                    
                    verif_mail(response.data.infos.mail)
                }
            }else{
                console.log(response.data.infos);
            }
        })
        .catch(error => {
            console.error("erreur lors de l'envoie");
            console.log(response.data.infos);
        })
    }



































pageConnexion();

page.addEventListener("submit", function (event) {
    event.preventDefault();});


