// Importation des modules nécessaires
// Express : framework web pour Node.js permettant de créer des serveurs HTTP
const express = require("express");
// CORS : middleware pour gérer les requêtes cross-origin (permet les requêtes depuis d'autres domaines)
const cors = require("cors");

// mongoose : ODM (Object Document Mapper) pour MongoDB
const mongoose = require("mongoose");

// dotenv : module pour charger les variables d'environnement depuis un fichier .env
const dotenv = require("dotenv");

// Configuration de dotenv pour charger les variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();
// Définition du port sur lequel le serveur écoutera
const port = 3000;

// Middleware pour parser les requêtes JSON (convertit le body en objet JavaScript)
app.use(express.json());
// Middleware CORS pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour forcer l'encodage UTF-8 dans les réponses
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// Importation du pool de connexions MySQL (configuration centralisée)
const pool = require("./config/database");

// Connexion à MongoDB avec Mongoose
// MongoDB sera utilisé pour stocker les données de Contact et les horaires
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb://root:root@localhost:27017/vite_gourmand?authSource=admin";
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Connexion à MongoDB réussie");
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
  });

// Importation des modèles Mongoose
const Horaire = require("./models/Horaire");
const Contact = require("./models/Contact");

// Importation des routes API
const horairesRouter = require("./routes/api/horaires");
const contactRouter = require("./routes/api/contact");
const rolesRouter = require("./routes/api/roles");
const authRouter = require("./routes/api/auth");
const commandesRouter = require("./routes/api/commandes");
const menusRouter = require("./routes/api/menus");
const avisRouter = require("./routes/api/avis");

// Utilisation des routes API
app.use("/api/horaires", horairesRouter);
app.use("/api/contact", contactRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/auth", authRouter);
app.use("/api/commandes", commandesRouter);
app.use("/api/menus", menusRouter);
app.use("/api/avis", avisRouter);

// Route GET sur la racine "/"
// Cette route récupère tous les utilisateurs de la base de données
app.get("/", async (req, res) => {
  // Requête SQL pour sélectionner tous les utilisateurs
  let sql = "SELECT * FROM user";

  // Exécution de la requête (destructuration pour récupérer uniquement les lignes)
  const [rows] = await pool.query(sql);

  // Envoi de la réponse avec les données récupérées
  res.status(200).json(rows);
});

// Démarrage du serveur sur le port défini
// Le serveur écoute les requêtes entrantes sur toutes les interfaces (0.0.0.0)
// pour permettre les connexions depuis l'extérieur du conteneur Docker
app.listen(port, "0.0.0.0", () => {
  console.log(`server running on port ${port}`);
});
