// Configuration de la connexion PostgreSQL (Supabase)
// Ce fichier centralise la configuration de la base de données PostgreSQL
// pour pouvoir l'utiliser dans toutes les routes API

const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Configuration du pool de connexions PostgreSQL
// Supporte Supabase et autres services PostgreSQL cloud
const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "vite_gourmand",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  ssl:
    process.env.DB_SSL === "true" || process.env.DB_SSL === true
      ? { rejectUnauthorized: false }
      : false,
  max: 10, // Nombre maximum de connexions dans le pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Pour Supabase, utilisez la connection string directement
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
}

// Création d'un pool de connexions PostgreSQL
const pool = new Pool(poolConfig);

// Gestion des erreurs de connexion
pool.on("error", (err) => {
  console.error("❌ PostgreSQL Pool Error:", err);
  if (err.code === "ECONNREFUSED") {
    console.error(
      "PostgreSQL connection refused. Check your connection settings."
    );
  } else {
    throw err;
  }
});

// Wrapper pour normaliser les résultats (compatible avec mysql2)
// MySQL retourne [rows, fields], on doit faire pareil pour PostgreSQL
const originalQuery = pool.query.bind(pool);

pool.query = async (text, params) => {
  try {
    // Convertir les placeholders MySQL (?) en placeholders PostgreSQL ($1, $2, ...)
    let convertedText = text;
    let convertedParams = params || [];

    if (params && params.length > 0) {
      // Remplacer ? par $1, $2, etc.
      let paramIndex = 1;
      convertedText = text.replace(/\?/g, () => `$${paramIndex++}`);
    }

    const result = await originalQuery(convertedText, convertedParams);

    // Normaliser le résultat pour être compatible avec mysql2
    // MySQL retourne [rows, fields], PostgreSQL retourne { rows, fields }
    // On doit retourner [rows, fields] pour compatibilité
    return [result.rows, result.fields || []];
  } catch (error) {
    console.error("PostgreSQL Query Error:", error);
    throw error;
  }
};

// Ajouter une propriété insertId pour compatibilité avec MySQL
// Note: Les requêtes INSERT doivent utiliser RETURNING pour que cela fonctionne
Object.defineProperty(pool, "insertId", {
  get() {
    // Cette propriété sera définie après un INSERT avec RETURNING
    return this._lastInsertId || null;
  },
  set(value) {
    this._lastInsertId = value;
  },
});

// Wrapper pour les événements (compatibilité)
pool.on = (event, callback) => {
  if (event === "connection") {
    // PostgreSQL n'a pas besoin de SET NAMES, mais on peut logger
    console.log("PostgreSQL connection established");
  } else {
    pool.on(event, callback);
  }
};

module.exports = pool;
