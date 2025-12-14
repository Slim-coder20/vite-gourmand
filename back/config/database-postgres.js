// Configuration de la connexion PostgreSQL (Supabase)
// Ce fichier centralise la configuration de la base de données PostgreSQL
// pour pouvoir l'utiliser dans toutes les routes API

const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Configuration du pool de connexions PostgreSQL
// Supporte Supabase et autres services PostgreSQL cloud
let poolConfig;

// Pour Supabase, utilisez la connection string directement
if (process.env.DATABASE_URL) {
  // Si DATABASE_URL est définie, utiliser uniquement connectionString
  // Les autres propriétés seront ignorées
  // Supabase nécessite SSL, donc on l'active par défaut si DATABASE_URL contient 'supabase'
  const isSupabase = process.env.DATABASE_URL.includes("supabase");
  const requiresSSL =
    isSupabase || process.env.DB_SSL === "true" || process.env.DB_SSL === true;

  // Valider le format de DATABASE_URL
  if (
    !process.env.DATABASE_URL.startsWith("postgresql://") &&
    !process.env.DATABASE_URL.startsWith("postgres://")
  ) {
    console.error(
      "❌ ERREUR: DATABASE_URL doit commencer par 'postgresql://' ou 'postgres://'"
    );
    console.error(
      `Format actuel: ${process.env.DATABASE_URL.substring(0, 20)}...`
    );
  }

  // Pour Supabase, essayer deux approches selon l'environnement
  // Approche 1 : Utiliser connectionString avec SSL explicite
  // Approche 2 : Si ça ne marche pas, parser l'URL et utiliser les paramètres individuels

  if (isSupabase) {
    // Pour Supabase, forcer SSL de manière explicite
    poolConfig = {
      connectionString: process.env.DATABASE_URL,
      max: 5, // Réduire le nombre de connexions pour serverless
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 20000, // Timeout plus long pour cloud
      ssl: {
        rejectUnauthorized: false,
        require: true,
      },
      // Options supplémentaires pour Supabase
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    };
  } else {
    poolConfig = {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
      ssl: requiresSSL
        ? {
            rejectUnauthorized: false,
            require: true,
          }
        : undefined,
    };
  }

  // Log de la configuration SSL pour diagnostic
  if (isSupabase) {
    console.log("🔒 SSL activé (obligatoire pour Supabase)");
  }

  const dbUrlPreview = process.env.DATABASE_URL.replace(
    /:\/\/[^:]+:[^@]+@/,
    "://***:***@"
  );
  console.log(
    `✅ PostgreSQL configuré avec DATABASE_URL (SSL: ${
      requiresSSL ? "activé" : "désactivé"
    })`
  );
  console.log(`Connection string: ${dbUrlPreview}`);

  // Extraire et logger le hostname pour diagnostic DNS
  try {
    // Vérifier que DATABASE_URL est bien une string
    if (typeof process.env.DATABASE_URL !== "string") {
      console.error("❌ ERREUR: DATABASE_URL n'est pas une string");
      console.error(`   Type reçu: ${typeof process.env.DATABASE_URL}`);
    } else {
      const url = new URL(process.env.DATABASE_URL);
      console.log(`🔍 Hostname extrait: ${url.hostname}`);
      console.log(`🔍 Port extrait: ${url.port || "5432 (défaut)"}`);
      console.log(`🔍 Database extraite: ${url.pathname}`);

      // Vérifier que le hostname est complet
      if (!url.hostname.includes(".")) {
        console.error("❌ ERREUR: Hostname invalide (pas de point)");
      }
      if (url.hostname.endsWith(".sup")) {
        console.error(
          "❌ ERREUR: Hostname semble tronqué (se termine par .sup au lieu de .supabase.co)"
        );
        console.error(`   Hostname complet attendu: ${url.hostname}abase.co`);
      }
    }
  } catch (urlError) {
    console.error(
      "❌ ERREUR: Impossible de parser DATABASE_URL:",
      urlError.message
    );
    if (process.env.DATABASE_URL) {
      const urlPreview =
        typeof process.env.DATABASE_URL === "string"
          ? process.env.DATABASE_URL.substring(0, 50)
          : String(process.env.DATABASE_URL).substring(0, 50);
      console.error(`   URL reçue: ${urlPreview}...`);
    } else {
      console.error("   DATABASE_URL est undefined ou null");
    }
  }

  // Détecter et avertir si format Supabase suspect
  if (requiresSSL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      const hostname = url.hostname;
      const port = url.port || "5432";

      // Vérifier si on utilise le port pooler (6543) avec l'hostname direct
      if (
        hostname.includes("db.") &&
        hostname.includes(".supabase.co") &&
        port === "6543"
      ) {
        console.error("❌ ERREUR DE CONFIGURATION DÉTECTÉE:");
        console.error(
          "Vous utilisez le port 6543 (Transaction Pooler) avec l'hostname direct (db.*.supabase.co)"
        );
        console.error("Ces deux formats ne sont pas compatibles !");
        console.error("");
        console.error(
          "SOLUTION 1 - Connexion directe (recommandée pour Vercel):"
        );
        console.error(
          `  postgresql://postgres:[password]@${hostname}:5432/postgres`
        );
        console.error("");
        console.error("SOLUTION 2 - Transaction Pooler:");
        console.error("  Allez dans Supabase Dashboard → Settings → Database");
        console.error(
          "  Copiez la connection string du 'Transaction Pooler' (port 6543)"
        );
        console.error(
          "  Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
        );
      }
    } catch (e) {
      // Ignorer les erreurs de parsing URL
    }
  }
} else {
  // Configuration manuelle si DATABASE_URL n'est pas définie
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "vite_gourmand",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    ssl:
      process.env.DB_SSL === "true" || process.env.DB_SSL === true
        ? { rejectUnauthorized: false }
        : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
}

// Création lazy du pool pour environnement serverless
// Dans Vercel, créer le pool au chargement du module peut causer des problèmes DNS
// On crée le pool seulement quand il est utilisé pour la première fois
let pool = null;

function getPool() {
  if (!pool) {
    console.log("🔧 Création du pool PostgreSQL (lazy initialization)");
    pool = new Pool(poolConfig);
    
    // Gestion des erreurs de connexion
    pool.on("error", (err) => {
      console.error("❌ PostgreSQL Pool Error:", err);
      if (err.code === "ECONNREFUSED") {
        console.error(
          "PostgreSQL connection refused. Check your connection settings."
        );
      } else if (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN") {
        console.error("DNS resolution failed. Check DATABASE_URL hostname.");
        console.error(`Hostname: ${poolConfig.connectionString ? new URL(poolConfig.connectionString).hostname : 'N/A'}`);
      } else {
        console.error("PostgreSQL pool error details:", {
          code: err.code,
          message: err.message,
        });
      }
    });
  }
  return pool;
}

// Log de la configuration au démarrage
console.log("🔧 Configuration PostgreSQL:");
console.log(`  - Max connections: ${poolConfig.max}`);
console.log(`  - Connection timeout: ${poolConfig.connectionTimeoutMillis}ms`);
console.log(`  - SSL: ${poolConfig.ssl ? "activé" : "désactivé"}`);
if (poolConfig.connectionString) {
  const urlPreview = poolConfig.connectionString.replace(
    /:\/\/[^:]+:[^@]+@/,
    "://***:***@"
  );
  console.log(`  - Connection string: ${urlPreview}`);
}

// Test de connexion au démarrage pour diagnostiquer les problèmes
// Note: Dans un environnement serverless, cette connexion peut ne pas être établie immédiatement
// Utiliser un délai plus court pour serverless (Vercel)
const testDelay = process.env.VERCEL ? 100 : 1000; // 100ms pour Vercel, 1s pour local

// Test de connexion désactivé - le pool sera créé à la demande
// setTimeout(() => {
//   getPool()
//     .query("SELECT NOW() as current_time")
    .then((result) => {
      console.log("✅ PostgreSQL pool créé et connexion testée avec succès");
      console.log(`Heure serveur PostgreSQL: ${result.rows[0].current_time}`);
    })
    .catch((err) => {
      console.error("❌ Erreur lors du test de connexion PostgreSQL:", err);
      console.error(`Code d'erreur: ${err.code}`);
      console.error(`Message: ${err.message}`);

      // Extraire le hostname de l'URL pour diagnostic
      let hostnameInfo = "N/A";
      try {
        const url = new URL(process.env.DATABASE_URL);
        hostnameInfo = url.hostname;
        console.error(`🔍 Hostname utilisé: ${hostnameInfo}`);
      } catch (e) {
        console.error(`🔍 Impossible d'extraire le hostname de DATABASE_URL`);
      }

      console.error("Vérifiez que DATABASE_URL est correctement configurée");

      if (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN") {
        console.error("❌ Erreur DNS: Impossible de résoudre le nom d'hôte");
        console.error(`   Hostname qui a échoué: ${hostnameInfo}`);
        console.error(
          "   Vérifiez que l'URL de connexion Supabase est correcte"
        );
        console.error(
          "   Le hostname doit être COMPLET (ex: db.wfbwmyeyudxqqidgsmcc.supabase.co)"
        );
        console.error("");
        console.error("Formats Supabase valides:");
        console.error(
          "  1. Direct: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
        );
        console.error(
          "  2. Pooler: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
        );
        console.error("");
        console.error(
          "⚠️ Vérifiez dans Vercel → Settings → Environment Variables:"
        );
        console.error("   - DATABASE_URL ne doit PAS être tronquée");
        console.error(
          "   - Le hostname doit se terminer par .supabase.co (pas .sup)"
        );
      } else if (err.code === "ECONNREFUSED") {
        console.error(
          "❌ Connexion refusée: Vérifiez l'URL et les credentials"
        );
        console.error(`   Hostname: ${hostnameInfo}`);
      } else if (err.code === "ETIMEDOUT") {
        console.error(
          "❌ Timeout de connexion: Vérifiez votre connexion réseau"
        );
        console.error(`   Hostname: ${hostnameInfo}`);
      } else if (err.code === "28P01") {
        console.error(
          "❌ Erreur d'authentification: Vérifiez le mot de passe dans DATABASE_URL"
        );
      } else if (err.code === "3D000") {
        console.error(
          "❌ Base de données introuvable: Vérifiez le nom de la base dans DATABASE_URL"
        );
      }

      // Ne pas throw pour éviter de bloquer le démarrage, mais logger l'erreur
      console.error(
        "⚠️ L'application continuera mais les requêtes PostgreSQL échoueront"
      );
    });
});
// Gestion des erreurs de connexion
pool.on("error", (err) => {
  console.error("❌ PostgreSQL Pool Error:", err);
  if (err.code === "ECONNREFUSED") {
    console.error(
      "PostgreSQL connection refused. Check your connection settings."
    );
  } else if (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN") {
    console.error("DNS resolution failed. Check DATABASE_URL hostname.");
  } else {
    // Ne pas throw pour éviter de crasher l'application
    console.error("PostgreSQL pool error details:", {
      code: err.code,
      message: err.message,
    });
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
// Utiliser getPool() pour obtenir le pool à la demande (lazy initialization)
const poolQuery = async (text, params) => {
  let convertedText = text;
  try {
    // Obtenir le pool (créé à la demande)
    const currentPool = getPool();
    
    // 1. Convertir les fonctions MySQL en PostgreSQL
    convertedText = convertMySQLToPostgreSQL(text);

    // 2. Convertir les placeholders MySQL (?) en placeholders PostgreSQL ($1, $2, ...)
    let convertedParams = params || [];

    if (params && params.length > 0) {
      // Remplacer ? par $1, $2, etc.
      let paramIndex = 1;
      convertedText = convertedText.replace(/\?/g, () => `$${paramIndex++}`);
    }

    const result = await currentPool.query(convertedText, convertedParams);

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
        poolQuery.insertId = firstRow[idKey];
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
Object.defineProperty(poolQuery, "insertId", {
  get() {
    // Cette propriété sera définie après un INSERT avec RETURNING
    return poolQuery._lastInsertId || null;
  },
  set(value) {
    poolQuery._lastInsertId = value;
  },
});

// Exporter poolQuery comme interface principale
// Compatible avec l'utilisation existante : const pool = require("../../config/database");
module.exports = poolQuery;
