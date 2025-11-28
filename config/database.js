// Configuration de la connexion MySQL
// Ce fichier centralise la configuration de la base de données MySQL
// pour pouvoir l'utiliser dans toutes les routes API

const mysql2 = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

// Création d'un pool de connexions MySQL
// Un pool permet de réutiliser les connexions et d'améliorer les performances
const pool = mysql2
  .createPool({
    host: process.env.DB_HOST || "localhost", // Adresse du serveur MySQL
    database: "vite_gourmand", // Nom de la base de données
    user: "root", // Utilisateur MySQL
    password: "root", // Mot de passe MySQL
  })
  .promise(); // Conversion en promesses pour utiliser async/await

module.exports = pool;
