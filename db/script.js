// Cette fonction est appelée, par exemple, lors du clic sur un bouton
function envoyerDonnees() {
    // 1. On prépare les données qu'on veut envoyer
    const data = {
        nom: "Mael",
        message: "Hello serveur !"
    };

    console.log("Envoi en cours...");

    // 2. On appelle l'API Node.js
    // Note : si ton HTML est servi par Node, tu peux mettre juste '/api/utilisateur'
    axios.post('/api/donnee', data)
        .then(response => {
            // 3. On reçoit la réponse du serveur
            console.log("Réponse du serveur :", response.data);

            // On vérifie si le serveur a bien envoyé "bonjour"
            if (response.data.message === "bonjour") {
                alert("Le serveur m'a dit : " + response.data.message);
                
                // Exemple : redirection après avoir reçu le bonjour
                // window.location.href = "utilisateur.html";
            }
        })
        .catch(error => {
            // En cas de serveur éteint ou d'erreur réseau
            console.error("Le serveur ne répond pas :", error);
        });
}

function activitesget() {
    // 1. On prépare les données qu'on veut envoyer
    const data = {
        nom: "Mael",
        message: "Hello serveur !"
    };

    console.log("Envoi en cours...");

    // 2. On appelle l'API Node.js
    // Note : si ton HTML est servi par Node, tu peux mettre juste '/api/utilisateur'
    axios.post('/api/activites', data)
        .then(response => {
            // 3. On reçoit la réponse du serveur
            console.log("Réponse du serveur :", response.data);

            // On vérifie si le serveur a bien envoyé "bonjour"
            if (response.data.message === "bonjour") {
                alert("Le serveur m'a dit : " + response.data.message);
                
                // Exemple : redirection après avoir reçu le bonjour
                // window.location.href = "utilisateur.html";
            }
        })
        .catch(error => {
            // En cas de serveur éteint ou d'erreur réseau
            console.error("Le serveur ne répond pas :", error);
        });
}