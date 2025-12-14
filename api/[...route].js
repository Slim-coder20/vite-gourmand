// api/[...route].js - Fonction serverless unique pour toutes les routes API
const express = require("express");
const cors = require("cors");
const { connectMongo } = require("./index");

// Import de toutes les routes
const authRouter = require("../back/routes/api/auth");
const adminRouter = require("../back/routes/api/admin");
const avisRouter = require("../back/routes/api/avis");
const commandesRouter = require("../back/routes/api/commandes");
const contactRouter = require("../back/routes/api/contact");
const dashboardUserRouter = require("../back/routes/api/dashboardUser");
const employeRouter = require("../back/routes/api/employe");
const horairesRouter = require("../back/routes/api/horaires");
const menusRouter = require("../back/routes/api/menus");
const platsRouter = require("../back/routes/api/plats");
const rolesRouter = require("../back/routes/api/roles");

const app = express();

// Configuration CORS pour accepter toutes les origines Vercel
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser toutes les origines (y compris les preview URLs de Vercel)
    // En production, vous pouvez restreindre aux domaines spécifiques
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Middleware globaux
app.use(cors(corsOptions));
app.use(express.json());

// Middleware de connexion MongoDB
app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return res.status(500).json({
      error: "Database connection failed",
      message: error.message,
    });
  }
});

// Montage de toutes les routes
console.log("🔧 Montage des routes API...");
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/avis", avisRouter);
console.log("✅ Route /api/avis montée");
app.use("/api/commandes", commandesRouter);
app.use("/api/contact", contactRouter);
app.use("/api/dashboard/user", dashboardUserRouter);
app.use("/api/employe", employeRouter);
app.use("/api/horaires", horairesRouter);
app.use("/api/menus", menusRouter);
app.use("/api/plats", platsRouter);
app.use("/api/roles", rolesRouter);
console.log("✅ Toutes les routes montées");

// Route de santé
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Route de test de connexion PostgreSQL
app.get("/api/test-db", async (req, res) => {
  try {
    const pool = require("../back/config/database");
    console.log("🔍 Test de connexion PostgreSQL...");

    // Test de connexion simple
    const [rows] = await pool.query(
      "SELECT NOW() as current_time, version() as pg_version"
    );

    res.json({
      status: "ok",
      message: "Connexion PostgreSQL réussie",
      data: {
        current_time: rows[0].current_time,
        pg_version: rows[0].pg_version?.substring(0, 50) + "...",
      },
      env: {
        DB_TYPE: process.env.DB_TYPE || "non défini",
        DATABASE_URL: process.env.DATABASE_URL
          ? process.env.DATABASE_URL.replace(/:\/\/[^:]+:[^@]+@/, "://***:***@")
          : "non définie",
      },
    });
  } catch (error) {
    console.error("❌ Erreur test DB:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur de connexion PostgreSQL",
      error: {
        code: error.code,
        message: error.message,
        name: error.name,
      },
      env: {
        DB_TYPE: process.env.DB_TYPE || "non défini",
        DATABASE_URL: process.env.DATABASE_URL
          ? process.env.DATABASE_URL.replace(/:\/\/[^:]+:[^@]+@/, "://***:***@")
          : "non définie",
      },
    });
  }
});

// Middleware de gestion des routes non trouvées (404)
app.use((req, res) => {
  console.error(
    `❌ Route not found: ${req.method} ${req.originalUrl || req.url}`
  );
  console.error(`   req.path: ${req.path}`);
  console.error(`   req.baseUrl: ${req.baseUrl || "undefined"}`);
  console.error(
    `   Routes disponibles: /api/auth, /api/admin, /api/avis, /api/commandes, etc.`
  );
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl || req.url,
    method: req.method,
  });
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("❌ Express error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Handler Vercel - avec catch-all [...route].js
// Quand on accède à /api/menus, Vercel appelle cette fonction
// Le chemin dans req.url est '/menus' (sans le /api car c'est capturé par [...route])
// On doit ajouter /api devant pour que les routes Express fonctionnent
const { parse } = require("url");

module.exports = async (req, res) => {
  // Log au tout début pour voir si le handler est appelé
  console.log(`🚀 Handler Vercel appelé: ${req.method} ${req.url}`);
  console.log(`   Headers:`, {
    host: req.headers.host,
    origin: req.headers.origin,
    "user-agent": req.headers["user-agent"]?.substring(0, 50),
  });

  try {
    // Gérer CORS manuellement AVANT de modifier req.url
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
      );
    }

    // Gérer les requêtes OPTIONS (preflight)
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Avec [...route].js, Vercel passe le chemin dans req.url
    // Pour /api/menus, req.url peut être '/menus' ou '/api/menus'
    // On doit normaliser pour avoir toujours '/api/...'
    let originalUrl = req.url || "/";

    console.log(`🔍 URL originale reçue: ${originalUrl}`);
    console.log(`🔍 req.path: ${req.path || "undefined"}`);
    console.log(`🔍 req.originalUrl: ${req.originalUrl || "undefined"}`);

    // Si l'URL commence déjà par /api, on la garde telle quelle
    // Sinon, on l'ajoute (cas où Vercel passe juste le chemin après /api)
    if (!originalUrl.startsWith("/api")) {
      // Si ça commence par /, on ajoute /api devant
      // Sinon, on ajoute /api/
      if (originalUrl.startsWith("/")) {
        originalUrl = `/api${originalUrl}`;
      } else {
        originalUrl = `/api/${originalUrl}`;
      }
      console.log(`🔧 URL normalisée: ${originalUrl}`);
    }

    req.url = originalUrl;
    req.originalUrl = originalUrl;

    console.log(`📥 Request: ${req.method} ${req.url}`);

    // Reconstruire les propriétés Express nécessaires
    const parsedUrl = parse(req.url, true);
    req.path = parsedUrl.pathname;
    req.query = parsedUrl.query;
    req.hostname = req.headers.host || "";
    req.protocol = req.headers["x-forwarded-proto"] || "https";
    req.secure = req.protocol === "https";

    // S'assurer que la réponse est toujours en JSON
    res.setHeader("Content-Type", "application/json");

    // Appel de l'application Express
    return app(req, res);
  } catch (error) {
    console.error("❌ Error in API handler:", error);
    // S'assurer que même les erreurs retournent du JSON
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
