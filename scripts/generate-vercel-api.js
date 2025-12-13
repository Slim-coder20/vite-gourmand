// scripts/generate-vercel-api.js
// Script pour générer automatiquement les fichiers API pour Vercel
const fs = require('fs');
const path = require('path');

const routes = [
  'auth',
  'commandes',
  'menus',
  'avis',
  'contact',
  'horaires',
  'plats',
  'admin',
  'employe',
  'roles',
];

const dashboardRoutes = ['dashboard/user'];

// Template pour une route API simple
const routeTemplate = (routeName) => `// api/${routeName}/[...route].js
const express = require('express');
const cors = require('cors');
const ${routeName}Router = require('../../back/routes/api/${routeName}');
const { createHandler } = require('../_utils/express-wrapper');
const { connectMongo } = require('../index');

const app = express();

app.use(cors());
app.use(express.json());

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

app.use('/api/${routeName}', ${routeName}Router);

module.exports = createHandler(app);
`;

// Template pour les routes dashboard (avec sous-dossiers)
const dashboardRouteTemplate = (routePath, routeName) => {
  const depth = routePath.split('/').length;
  const backPath = '../'.repeat(depth) + 'back/routes/api';
  const utilsPath = '../'.repeat(depth) + '_utils/express-wrapper';
  const indexPath = '../'.repeat(depth) + 'index';
  
  return `// api/${routePath}/[...route].js
const express = require('express');
const cors = require('cors');
const ${routeName}Router = require('${backPath}/${routeName}');
const { createHandler } = require('${utilsPath}');
const { connectMongo } = require('${indexPath}');

const app = express();

app.use(cors());
app.use(express.json());

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

app.use('/api/${routePath}', ${routeName}Router);

module.exports = createHandler(app);
`;
};

// Créer le dossier _utils s'il n'existe pas
const utilsDir = path.join(__dirname, '..', 'api', '_utils');
if (!fs.existsSync(utilsDir)) {
  fs.mkdirSync(utilsDir, { recursive: true });
  console.log('✅ Created api/_utils directory');
}

// Créer le fichier express-wrapper.js
const wrapperPath = path.join(utilsDir, 'express-wrapper.js');
if (!fs.existsSync(wrapperPath)) {
  const wrapperContent = `// api/_utils/express-wrapper.js
const express = require('express');

/**
 * Wrapper pour convertir une application Express en handler Vercel
 * @param {Express} app - Application Express
 * @returns {Function} Handler Vercel
 */
function createHandler(app) {
  return async (req, res) => {
    // Vercel passe req et res directement
    return app(req, res);
  };
}

module.exports = { createHandler };
`;
  fs.writeFileSync(wrapperPath, wrapperContent);
  console.log('✅ Created api/_utils/express-wrapper.js');
}

// Créer le fichier index.js pour MongoDB
const indexPath = path.join(__dirname, '..', 'api', 'index.js');
if (!fs.existsSync(indexPath)) {
  const indexContent = `// api/index.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connexion MongoDB (réutilisable entre les fonctions)
let mongoConnection = null;

async function connectMongo() {
  if (mongoConnection && mongoose.connection.readyState === 1) {
    return mongoConnection;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    mongoConnection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
    return mongoConnection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connectMongo };
`;
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ Created api/index.js');
}

// Créer les routes simples
routes.forEach(route => {
  const routePath = path.join(__dirname, '..', 'api', route);
  const filePath = path.join(routePath, '[...route].js');
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(routePath)) {
    fs.mkdirSync(routePath, { recursive: true });
  }
  
  // Créer le fichier seulement s'il n'existe pas
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, routeTemplate(route));
    console.log(`✅ Created ${filePath}`);
  } else {
    console.log(`⏭️  Skipped ${filePath} (already exists)`);
  }
});

// Créer les routes dashboard
dashboardRoutes.forEach(route => {
  const routePath = path.join(__dirname, '..', 'api', route);
  const filePath = path.join(routePath, '[...route].js');
  const routeName = route.split('/').pop();
  
  if (!fs.existsSync(routePath)) {
    fs.mkdirSync(routePath, { recursive: true });
  }
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, dashboardRouteTemplate(route, routeName));
    console.log(`✅ Created ${filePath}`);
  } else {
    console.log(`⏭️  Skipped ${filePath} (already exists)`);
  }
});

console.log('\n🎉 Génération des routes API terminée !');
console.log('\n📝 Prochaines étapes :');
console.log('1. Vérifiez que tous les fichiers ont été créés');
console.log('2. Configurez les variables d\'environnement dans Vercel');
console.log('3. Déployez avec: vercel --prod');

