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
    charset: "utf8mb4", // Encodage UTF-8 pour les caractères spéciaux
  })
  .promise(); // Conversion en promesses pour utiliser async/await

// Forcer l'encodage UTF-8 pour toutes les connexions du pool
pool.on("connection", (connection) => {
  connection.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
});

module.exports = pool;
