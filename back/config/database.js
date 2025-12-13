// Configuration de la connexion base de données
// Ce fichier centralise la configuration et choisit automatiquement entre MySQL et PostgreSQL
// selon la variable d'environnement DB_TYPE

const dotenv = require("dotenv");
dotenv.config();

// Déterminer le type de base de données à utiliser
const DB_TYPE = process.env.DB_TYPE || "mysql"; // Par défaut MySQL pour compatibilité

let pool;

if (DB_TYPE === "postgres" || DB_TYPE === "postgresql") {
  // Utiliser PostgreSQL (Supabase)
  console.log("Configuration PostgreSQL (Supabase)");
  const postgresPool = require("./database-postgres");
  pool = postgresPool;
} else {
  // Utiliser MySQL (par défaut)
  console.log("📊 Configuration MySQL");
  const mysql2 = require("mysql2");

  // Configuration du pool de connexions MySQL
  // Supporte les connexions locales (Docker) et cloud (PlanetScale, Railway, etc.)
  const poolConfig = {
    host: process.env.DB_HOST || "localhost", // Adresse du serveur MySQL
    database: process.env.DB_NAME || "vite_gourmand", // Nom de la base de données
    user: process.env.DB_USER || "root", // Utilisateur MySQL
    password: process.env.DB_PASSWORD || "root", // Mot de passe MySQL
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // Port MySQL
    charset: "utf8mb4", // Encodage UTF-8 pour les caractères spéciaux
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  // Configuration SSL pour les connexions cloud (PlanetScale, etc.)
  if (process.env.DB_SSL === "true" || process.env.DB_SSL === true) {
    poolConfig.ssl = {
      rejectUnauthorized: false, // Pour PlanetScale et autres services cloud
    };
  }

  // Création d'un pool de connexions MySQL
  // Un pool permet de réutiliser les connexions et d'améliorer les performances
  pool = mysql2.createPool(poolConfig).promise();

  // Forcer l'encodage UTF-8 pour toutes les connexions du pool
  pool.on("connection", (connection) => {
    connection.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
  });

  // Gestion des erreurs de connexion
  pool.on("error", (err) => {
    console.error("❌ MySQL Pool Error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("MySQL connection lost. Reconnecting...");
    } else {
      throw err;
    }
  });
}

module.exports = pool;
