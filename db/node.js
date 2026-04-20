const express = require('express');
const cors = require('cors'); 
const mysql = require('mysql2/promise'); // Un seul import, version promise
const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.static('.')); 

const session = require('express-session');

app.use(session({
    secret: 'ma_cle_secrete_123', // Change cela par une phrase aléatoire
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // 'false' car tu es en HTTP local
}));

const dbConfig = {
    host: 'localhost',
    user: 'admin',
    password: 'admin',      
    database: 'projet_web_L2_S2'
};

// --- FONCTIONS DE RÉCUPÉRATION ---

async function get_familles() {
    try {
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute("SELECT * FROM familles");
        await db.end();
        return rows; 
    } catch (err) {
        console.error("Erreur récup familles:", err);
        throw err;
    }
}

async function get_activites() {
    try {
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute("SELECT * FROM activites");
        await db.end();
        return rows; 
    } catch (err) {
        console.error("Erreur récup activités:", err);
        throw err;
    }
}


// async function fullData(id_famille) {

//     try{
//         const familles = await get_familles_byIdF(id_famille);
//         const data_membres = await get_membres_byIdF(id_famille);
//         const data_reservations = await get_reservations_byIdF(id_famille);
//         const laFamille = familles[0];

//         laFamille.membres = data_membres;
//         laFamille.reservations = data_reservations;
//         return laFamille;

//         } catch (err) {
//             throw err
//     }

// }


async function get_familles_byIdF(id_famille) {
    try{
        const db = await mysql.createConnection(dbConfig);
        const sql = "SELECT * FROM familles WHERE id_famille = ?";
        const [rows] = await db.execute(sql, [id_famille]);
        await db.end();
        return rows; 
    }catch (err) {
        console.error("Erreur récup activités:", err);
        throw err;
    }
}
async function get_membres_byIdF(id_famille) {
    try{
        const db = await mysql.createConnection(dbConfig);
        const sql = "SELECT * FROM utilisateurs WHERE id_famille = ?";
        const [rows] = await db.execute(sql, [id_famille]);
        await db.end();
        return rows; 
    }catch (err) {
        console.error("Erreur récup activités:", err);
        throw err;
    }
}
async function get_reservations_byIdF(id_famille) {
    try{
        const db = await mysql.createConnection(dbConfig);
        const sql = `SELECT 
        activites.*, 
        reservation_activites.nb_membre,
        reservation_activites.id_reservation_activite,
        reservation_activites.status,
    CASE 
        WHEN reservation_activites.status IS NULL THEN 0 
        ELSE reservation_activites.status
        END AS status
    FROM activites
    LEFT JOIN reservation_activites 
    ON reservation_activites.id_activite = activites.id 
    AND reservation_activites.id_famille = ?
    ORDER BY activites.id`;
        const [rows] = await db.execute(sql, [id_famille]);
        await db.end();
        return rows; 
    }catch (err) {
        console.error("Erreur récup activités:", err);
        throw err;
    }
}



app.post('/api/activites', async (req, res) => {
    try {
        const data = await get_activites();
        // On renvoie "bonjour" + les données pour que ton IF dans le JS soit content
        res.json({ 
            status: "success", 
            message: "bonjour", 
            donnees: data 
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Erreur serveur" });
    }
});

app.post('/api/utilisateur', async (req, res) => {
    try {
        const data = await get_familles();
        res.json({ 
            status: "success", 
            message: "bonjour", 
            donnees: data 
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Erreur serveur" });
    }
});


app.post('/api/donnee', async (req, res) => {
    try {
        const data_familles = await get_familles();
        const data_activites = await get_activites();
        res.json({ 
            status: "success", 
            message: "bonjour", 
            activites: data_activites,
            familles : data_familles
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Erreur serveur" });
    }
})


const bcrypt = require('bcrypt');

app.post('/html/api/login', async (req, res) => {
    const { action } = req.body;
    const db = await mysql.createConnection(dbConfig);

    try {
        if (action === "connexion_famille") {
            const { mail, password } = req.body;
            const [familles] = await db.execute("SELECT * FROM familles WHERE mail = ?", [mail]);

            if (familles.length > 0) {
                const famille = familles[0];
                const match = await bcrypt.compare(password, famille.password);

                if (match) {
                    req.session.id_famille = famille.id_famille;
                    return res.json({ status: "success", message: "Connexion famille réussie" });
                } else {
                    return res.json({ status: "failed", message: "Mot de passe incorrect" });
                }
            } else {
                return res.json({ status: "failed", message: "Utilisateur introuvable" });
            }
        } 

        else if (action === "inscription_famille&payeur") {
            const { nom, prenom, date_naissance, mail, password, adresse, telephone, code_postal, ville } = req.body;

            const [verif] = await db.execute("SELECT id_famille FROM familles WHERE mail = ?", [mail]);
            if (verif.length > 0) {
                return res.json({ status: "failed", message: "Adresse email déjà utilisée" });
            }

            const sql_payeur = "INSERT INTO utilisateurs (nom, prenom, date_naissance) VALUES (?, ?, ?)";
            const [res_p] = await db.execute(sql_payeur, [nom, prenom, date_naissance]);
            const nouvel_user_id = res_p.insertId;

            const password_hache = await bcrypt.hash(password, 10);

            const sql_f = "INSERT INTO familles (mail, password, adresse, telephone, code_postal, id_payeur, ville) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const [res_f] = await db.execute(sql_f, [mail, password_hache, adresse, telephone, code_postal, nouvel_user_id, ville]);
            const nouvel_famille_id = res_f.insertId;

            const sql_upd = "UPDATE utilisateurs SET id_famille = ? WHERE id = ?";
            await db.execute(sql_upd, [nouvel_famille_id, nouvel_user_id]);

            req.session.id_famille = nouvel_famille_id;
            return res.json({ 
                status: "success", 
                message: "Inscription réussie !",
                id_famille: nouvel_famille_id 
            });
        } 
        
        else {
            return res.status(400).json({ status: "error", message: "Action non reconnue" });
        }

    } catch (err) {
        console.error("Erreur Backend:", err);
        return res.status(500).json({ status: "error", message: "Erreur serveur interne" });
    } finally {
        if (db) await db.end();
    }
});


// Lancement du serveur
app.listen(3000, () => {
    console.log("🚀 Serveur Node lancé sur http://localhost:3000");
});
