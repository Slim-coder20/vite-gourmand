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

/**
 * Convertit les fonctions SQL MySQL en équivalents PostgreSQL
 * @param {string} sql - Requête SQL MySQL
 * @returns {string} Requête SQL PostgreSQL
 */
function convertMySQLToPostgreSQL(sql) {
  let converted = sql;

  // 1. CURDATE() → CURRENT_DATE
  converted = converted.replace(/\bCURDATE\(\)/gi, "CURRENT_DATE");

  // 2. DATE_SUB(NOW(), INTERVAL X HOUR) → NOW() - INTERVAL 'X HOUR'
  // Gère les variations : HOUR, DAY, MONTH, YEAR, etc.
  converted = converted.replace(
    /\bDATE_SUB\s*\(\s*NOW\s*\(\s*\)\s*,\s*INTERVAL\s+(\d+)\s+(\w+)\s*\)/gi,
    (match, value, unit) => {
      // Convertir les unités si nécessaire
      const unitMap = {
        HOUR: "HOUR",
        DAY: "DAY",
        MONTH: "MONTH",
        YEAR: "YEAR",
        MINUTE: "MINUTE",
        SECOND: "SECOND",
      };
      const pgUnit = unitMap[unit.toUpperCase()] || unit.toUpperCase();
      return `NOW() - INTERVAL '${value} ${pgUnit}'`;
    }
  );

  // 3. GROUP_CONCAT(...) → STRING_AGG(...)
  // Pattern complexe: GROUP_CONCAT(DISTINCT column ORDER BY column SEPARATOR ', ')
  // Gère les cas avec et sans DISTINCT, avec et sans ORDER BY
  converted = converted.replace(
    /\bGROUP_CONCAT\s*\(\s*(DISTINCT\s+)?([^)]+?)\s+ORDER\s+BY\s+([^\s]+(?:\s+ASC|\s+DESC)?)\s+SEPARATOR\s+['"]([^'"]+)['"]\s*\)/gi,
    (match, distinct, expression, orderBy, separator) => {
      const distinctPart = distinct ? "DISTINCT " : "";
      // Nettoyer l'expression (enlever les espaces en trop)
      const cleanExpression = expression.trim();
      // PostgreSQL STRING_AGG syntax: STRING_AGG(DISTINCT expr, ', ' ORDER BY expr)
      return `STRING_AGG(${distinctPart}${cleanExpression}, '${separator}' ORDER BY ${orderBy.trim()})`;
    }
  );

  // 3b. GROUP_CONCAT avec SEPARATOR mais sans ORDER BY
  converted = converted.replace(
    /\bGROUP_CONCAT\s*\(\s*(DISTINCT\s+)?([^)]+?)\s+SEPARATOR\s+['"]([^'"]+)['"]\s*\)/gi,
    (match, distinct, expression, separator) => {
      const distinctPart = distinct ? "DISTINCT " : "";
      const cleanExpression = expression.trim();
      return `STRING_AGG(${distinctPart}${cleanExpression}, '${separator}')`;
    }
  );

  // 4. GROUP_CONCAT simple (sans ORDER BY ni SEPARATOR explicite)
  converted = converted.replace(
    /\bGROUP_CONCAT\s*\(\s*(DISTINCT\s+)?([^)]+)\s*\)/gi,
    (match, distinct, expression) => {
      const distinctPart = distinct ? "DISTINCT " : "";
      const cleanExpression = expression.trim();
      // Par défaut, utiliser ', ' comme séparateur
      return `STRING_AGG(${distinctPart}${cleanExpression}, ', ')`;
    }
  );

  return converted;
}

// Wrapper pour normaliser les résultats (compatible avec mysql2)
// MySQL retourne [rows, fields], on doit faire pareil pour PostgreSQL
const originalQuery = pool.query.bind(pool);

pool.query = async (text, params) => {
  let convertedText = text;
  try {
    // 1. Convertir les fonctions MySQL en PostgreSQL
    convertedText = convertMySQLToPostgreSQL(text);

    // 2. Convertir les placeholders MySQL (?) en placeholders PostgreSQL ($1, $2, ...)
    let convertedParams = params || [];

    if (params && params.length > 0) {
      // Remplacer ? par $1, $2, etc.
      let paramIndex = 1;
      convertedText = convertedText.replace(/\?/g, () => `$${paramIndex++}`);
    }

    const result = await originalQuery(convertedText, convertedParams);

    // Gérer insertId pour les INSERT avec RETURNING
    // Si c'est un INSERT et qu'il y a un RETURNING, extraire l'ID
    if (
      convertedText.trim().toUpperCase().startsWith("INSERT") &&
      result.rows &&
      result.rows.length > 0
    ) {
      // Chercher la colonne ID (peut être commande_id, user_id, etc.)
      const firstRow = result.rows[0];
      const idKey = Object.keys(firstRow).find(
        (key) => key.includes("_id") || key === "id"
      );
      if (idKey && firstRow[idKey]) {
        pool.insertId = firstRow[idKey];
      }
    }

    // Normaliser le résultat pour être compatible avec mysql2
    // MySQL retourne [rows, fields], PostgreSQL retourne { rows, fields }
    // On doit retourner [rows, fields] pour compatibilité
    return [result.rows, result.fields || []];
  } catch (error) {
    console.error("PostgreSQL Query Error:", error);
    console.error("Original SQL:", text);
    console.error("Converted SQL:", convertedText);
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
