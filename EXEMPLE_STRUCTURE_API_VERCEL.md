# 📁 Exemple de Structure API pour Vercel

Ce document montre comment structurer les fichiers API pour le déploiement sur Vercel.

## Structure des dossiers

```
vite_gourmand/
├── api/                          # Serverless Functions Vercel
│   ├── _utils/
│   │   └── express-wrapper.js    # Wrapper pour convertir Express en handler Vercel
│   ├── index.js                  # Initialisation MongoDB (connexion réutilisable)
│   ├── auth/
│   │   └── [...route].js         # Routes d'authentification
│   ├── commandes/
│   │   └── [...route].js         # Routes des commandes
│   ├── menus/
│   │   └── [...route].js         # Routes des menus
│   ├── avis/
│   │   └── [...route].js         # Routes des avis
│   ├── contact/
│   │   └── [...route].js         # Routes de contact
│   ├── horaires/
│   │   └── [...route].js         # Routes des horaires
│   ├── plats/
│   │   └── [...route].js         # Routes des plats
│   ├── admin/
│   │   └── [...route].js         # Routes admin
│   ├── employe/
│   │   └── [...route].js         # Routes employé
│   ├── dashboard/
│   │   └── user/
│   │       └── [...route].js     # Routes dashboard utilisateur
│   └── roles/
│       └── [...route].js         # Routes des rôles
```

## Fichiers à créer

### 1. `api/_utils/express-wrapper.js`

```javascript
// api/_utils/express-wrapper.js
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
```

### 2. `api/index.js` (Initialisation MongoDB)

```javascript
// api/index.js
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
```

### 3. Exemple : `api/auth/[...route].js`

```javascript
// api/auth/[...route].js
const express = require('express');
const cors = require('cors');
const authRouter = require('../../back/routes/api/auth');
const { createHandler } = require('../_utils/express-wrapper');
const { connectMongo } = require('../index');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser MongoDB avant les routes
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

// Routes
app.use('/api/auth', authRouter);

// Handler Vercel
module.exports = createHandler(app);
```

### 4. Exemple : `api/menus/[...route].js`

```javascript
// api/menus/[...route].js
const express = require('express');
const cors = require('cors');
const menusRouter = require('../../back/routes/api/menus');
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

app.use('/api/menus', menusRouter);

module.exports = createHandler(app);
```

### 5. Exemple : `api/commandes/[...route].js`

```javascript
// api/commandes/[...route].js
const express = require('express');
const cors = require('cors');
const commandesRouter = require('../../back/routes/api/commandes');
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

app.use('/api/commandes', commandesRouter);

module.exports = createHandler(app);
```

## Script de génération automatique

Vous pouvez créer un script pour générer automatiquement tous les fichiers API :

### `scripts/generate-vercel-api.js`

```javascript
// scripts/generate-vercel-api.js
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

// Template pour une route API
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

// Créer les dossiers et fichiers
routes.forEach(route => {
  const routePath = path.join(__dirname, '..', 'api', route);
  const filePath = path.join(routePath, '[...route].js');
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(routePath)) {
    fs.mkdirSync(routePath, { recursive: true });
  }
  
  // Créer le fichier
  fs.writeFileSync(filePath, routeTemplate(route));
  console.log(`✅ Created ${filePath}`);
});

// Routes dashboard
dashboardRoutes.forEach(route => {
  const routePath = path.join(__dirname, '..', 'api', route);
  const filePath = path.join(routePath, '[...route].js');
  const routeName = route.split('/').pop();
  
  if (!fs.existsSync(routePath)) {
    fs.mkdirSync(routePath, { recursive: true });
  }
  
  const template = `// api/${route}/[...route].js
const express = require('express');
const cors = require('cors');
const ${routeName}Router = require('../../../back/routes/api/${routeName}');
const { createHandler } = require('../../_utils/express-wrapper');
const { connectMongo } = require('../../index');

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

app.use('/api/${route}', ${routeName}Router);

module.exports = createHandler(app);
`;
  
  fs.writeFileSync(filePath, template);
  console.log(`✅ Created ${filePath}`);
});

console.log('\n🎉 All API routes generated!');
```

Exécutez le script :

```bash
node scripts/generate-vercel-api.js
```

## Notes importantes

1. **Convention de nommage** : Vercel utilise `[...route].js` pour capturer toutes les routes sous ce chemin.

2. **Connexions MongoDB** : La connexion est réutilisée entre les appels pour améliorer les performances.

3. **CORS** : Assurez-vous d'inclure le middleware CORS pour permettre les requêtes depuis le frontend.

4. **Gestion d'erreurs** : Toujours gérer les erreurs de connexion à la base de données.

5. **Variables d'environnement** : Utilisez `dotenv` pour charger les variables d'environnement.

## Vérification

Après avoir créé tous les fichiers, vérifiez la structure :

```bash
tree api/ -L 3
```

Vous devriez voir tous les dossiers et fichiers créés.

