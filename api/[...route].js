// api/[...route].js - Fonction serverless unique pour toutes les routes API
const express = require('express');
const cors = require('cors');
const { connectMongo } = require('./index');

// Import de toutes les routes
const authRouter = require('../back/routes/api/auth');
const adminRouter = require('../back/routes/api/admin');
const avisRouter = require('../back/routes/api/avis');
const commandesRouter = require('../back/routes/api/commandes');
const contactRouter = require('../back/routes/api/contact');
const dashboardUserRouter = require('../back/routes/api/dashboardUser');
const employeRouter = require('../back/routes/api/employe');
const horairesRouter = require('../back/routes/api/horaires');
const menusRouter = require('../back/routes/api/menus');
const platsRouter = require('../back/routes/api/plats');
const rolesRouter = require('../back/routes/api/roles');

const app = express();

// Middleware globaux
app.use(cors());
app.use(express.json());

// Middleware de connexion MongoDB
app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return res.status(500).json({
      error: 'Database connection failed',
      message: error.message
    });
  }
});

// Montage de toutes les routes (sans le préfixe /api car Vercel le gère déjà)
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/avis', avisRouter);
app.use('/commandes', commandesRouter);
app.use('/contact', contactRouter);
app.use('/dashboard/user', dashboardUserRouter);
app.use('/employe', employeRouter);
app.use('/horaires', horairesRouter);
app.use('/menus', menusRouter);
app.use('/plats', platsRouter);
app.use('/roles', rolesRouter);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Handler Vercel - avec catch-all [...route].js, le chemin est déjà dans req.url
// Exemple: /api/menus -> req.url = '/menus'
module.exports = async (req, res) => {
  // Vercel passe déjà le chemin sans /api dans req.url
  // On doit préfixer avec /api pour que les routes Express fonctionnent
  const originalUrl = req.url || '/';
  
  if (!originalUrl.startsWith('/api')) {
    req.url = `/api${originalUrl}`;
    req.originalUrl = `/api${originalUrl}`;
  }
  
  return app(req, res);
};

