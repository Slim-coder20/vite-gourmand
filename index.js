// Importation des modules nécessaires
// Express : framework web pour Node.js permettant de créer des serveurs HTTP
const express = require("express");
// CORS : middleware pour gérer les requêtes cross-origin (permet les requêtes depuis d'autres domaines)
const cors = require("cors");
// mysql2 : client MySQL pour Node.js avec support des promesses
const mysql2 = require("mysql2");

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

// Création d'un pool de connexions MySQL
// Un pool permet de réutiliser les connexions et d'améliorer les performances
const pool = mysql2
  .createPool({
    host: process.env.DB_HOST, // Adresse du serveur MySQL (depuis variable d'environnement)
    database: "vite_gourmand", // Nom de la base de données
    user: "root", // Utilisateur MySQL
    password: "root", // Mot de passe MySQL
  })
  .promise(); // Conversion en promesses pour utiliser async/await

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

// Route GET sur la racine "/"
// Cette route récupère tous les utilisateurs de la base de données
app.get("/", async (req, res) => {
  // Requête SQL pour sélectionner tous les utilisateurs
  let sql = "SELECT * FROM user";
  // Exécution de la requête (destructuration pour récupérer uniquement les lignes)
  const [rows] = await pool.query(sql);
  // Envoi de la réponse avec les données récupérées
  res.send(`Hello Wordl : ${rows}`);
});

// Démarrage du serveur sur le port défini
// Le serveur écoute les requêtes entrantes
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
