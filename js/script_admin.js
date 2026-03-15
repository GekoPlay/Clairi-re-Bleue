function api(data) {
    return axios.post('../php/api.php', data)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error("Erreur API :", error);
            throw error; 
        });
}


data_ss_admin  = { action : "session" }

api(data_ss_admin);