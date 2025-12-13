// api/[...route].js - Fonction serverless unique pour toutes les routes API
const express = require('express');
const cors = require('cors');
const { createHandler } = require('./_utils/express-wrapper');
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

// Montage de toutes les routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/avis', avisRouter);
app.use('/api/commandes', commandesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/dashboard/user', dashboardUserRouter);
app.use('/api/employe', employeRouter);
app.use('/api/horaires', horairesRouter);
app.use('/api/menus', menusRouter);
app.use('/api/plats', platsRouter);
app.use('/api/roles', rolesRouter);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Export du handler Vercel
module.exports = createHandler(app);

