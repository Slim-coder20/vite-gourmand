# 🚀 Guide de Déploiement sur Vercel

Ce guide vous explique comment déployer l'application **Vite Gourmand** sur Vercel, en adaptant l'architecture pour utiliser les s de Vercel.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Prérequis](#prérequis)
- [Architecture de déploiement](#architecture-de-déploiement)
- [Étape 1 : Préparer les bases de données](#étape-1--préparer-les-bases-de-données)
- [Étape 2 : Restructurer le projet pour Vercel](#étape-2--restructurer-le-projet-pour-vercel)
- [Étape 3 : Configurer Vercel](#étape-3--configurer-vercel)
- [Étape 4 : Déployer sur Vercel](#étape-4--déployer-sur-vercel)
- [Étape 5 : Configurer les variables d'environnement](#étape-5--configurer-les-variables-denvironnement)
- [Dépannage](#dépannage)
- [Alternatives](#alternatives)

---

## 🎯 Vue d'ensemble

Vercel est une plateforme optimisée pour les applications frontend et les Serverless Functions. Pour déployer votre application complète, nous devons :

1. **Adapter le backend** : Convertir les routes Express en Serverless Functions Vercel
2. **Déployer le frontend** : Utiliser le build Vite standard
3. **Configurer les bases de données** : Utiliser des services cloud (Supabase PostgreSQL, MongoDB Atlas, etc.)
4. **Configurer les variables d'environnement** : Dans le dashboard Vercel

### ⚠️ Important : Distinction Développement / Production

**Votre projet utilise deux environnements distincts :**

| Environnement | Base de données | Configuration | Fichier |
|---------------|-----------------|---------------|---------|
| **Développement local** | MySQL (Docker) | `docker-compose.yml` | ✅ **NE PAS MODIFIER** |
| **Production (Vercel)** | PostgreSQL (Supabase) | Dashboard Vercel | Variables d'environnement |

**Points clés :**
- ✅ **Docker-compose.yml reste avec MySQL** pour le développement local
- ✅ **Vercel utilise PostgreSQL (Supabase)** via les variables d'environnement
- ✅ **Le système bascule automatiquement** selon la variable `DB_TYPE`
- ✅ **Aucune modification nécessaire** dans votre code de routes

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte [Vercel](https://vercel.com) (gratuit)
- ✅ [Vercel CLI](https://vercel.com/docs/cli) installé (`npm i -g vercel`)
- ✅ Un compte [Supabase](https://supabase.com) pour PostgreSQL (gratuit) - **Recommandé pour la production**
- ✅ Un compte pour MongoDB cloud (recommandé : [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - gratuit)
- ✅ Git installé et le projet versionné

### 📝 Note sur les bases de données

- **Développement local** : MySQL via Docker (déjà configuré dans `docker-compose.yml`) - **Ne pas modifier**
- **Production** : PostgreSQL via Supabase (à configurer dans Vercel)

---

## 🏗️ Architecture de déploiement

### Structure recommandée pour Vercel

```
vite_gourmand/
├── api/                    # Serverless Functions (backend)
│   ├── auth/
│   │   └── [...route].js   # Routes d'authentification
│   ├── commandes/
│   │   └── [...route].js   # Routes des commandes
│   ├── menus/
│   │   └── [...route].js   # Routes des menus
│   └── ...
├── frontend/               # Application React (déployée comme site statique)
│   ├── src/
│   ├── public/
│   └── ...
├── vercel.json             # Configuration Vercel
└── package.json           # Scripts de build
```

### Flux de requêtes

```
Utilisateur → Vercel Frontend (React) → Vercel Serverless Functions → Bases de données cloud
```

---

## 📦 Étape 1 : Préparer les bases de données

### ⚠️ Important : Ne pas modifier Docker-compose.yml

**Votre `docker-compose.yml` utilise MySQL pour le développement local. Ne le modifiez pas !**

Le système de bascule automatique permet d'utiliser :
- **MySQL** en développement local (via Docker)
- **PostgreSQL** en production (via Supabase sur Vercel)

### 1.1 PostgreSQL sur Supabase (recommandé pour la production)

1. Créez un compte sur [Supabase](https://supabase.com) (gratuit)
2. Créez un nouveau projet
3. Allez dans **Settings → Database** pour récupérer :
   - **Connection string** (ou les informations individuelles)
   - **Host** : `votre-projet.supabase.co`
   - **Database name** : `postgres`
   - **User** : `postgres`
   - **Password** : (celui que vous avez défini)
   - **Port** : `5432`

4. **Adapter le schéma SQL** :
   - Les scripts SQL dans `back/mysql_data/` sont pour MySQL
   - Vous devrez les adapter pour PostgreSQL (voir `GUIDE_ADAPTATION_POSTGRESQL.md`)
   - Ou utiliser l'éditeur SQL de Supabase pour créer les tables manuellement

5. **Exécuter les migrations** :
   - Via l'éditeur SQL de Supabase (onglet SQL Editor)
   - Ou via la CLI Supabase

**Note :** Le système de bascule automatique dans `back/config/database.js` détecte `DB_TYPE=postgres` et utilise PostgreSQL automatiquement.

### 1.2 Alternatives (si vous préférez MySQL en production)

Si vous préférez garder MySQL en production, vous pouvez utiliser :
- [PlanetScale](https://planetscale.com) (MySQL gratuit)
- [Railway](https://railway.app) (MySQL gratuit)
- [Aiven](https://aiven.io) (MySQL gratuit)

Dans ce cas, configurez `DB_TYPE=mysql` (ou ne définissez pas `DB_TYPE`) dans Vercel.

### 1.2 MongoDB sur MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (choisissez le tier gratuit M0)
3. Configurez un utilisateur de base de données
4. Ajoutez votre IP à la whitelist (ou `0.0.0.0/0` pour toutes les IPs - développement uniquement)
5. Récupérez la connection string :
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/vite_gourmand?retryWrites=true&w=majority
   ```

---

## 🔧 Étape 2 : Restructurer le projet pour Vercel

### 2.1 Créer le dossier `api` à la racine

Les Serverless Functions de Vercel doivent être dans un dossier `api/` à la racine du projet.

### 2.2 Créer un wrapper pour les routes Express

Vercel nécessite que chaque route soit une fonction serverless. Nous allons créer un wrapper qui convertit les routes Express en fonctions serverless.

**Créer `api/_utils/express-wrapper.js` :**

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

### 2.3 Créer les routes API comme Serverless Functions

Pour chaque route API, créez un fichier dans `api/` qui suit la structure de Vercel.

**Exemple : `api/auth/[...route].js` :**

```javascript
// api/auth/[...route].js
const express = require('express');
const authRouter = require('../../back/routes/api/auth');
const { createHandler } = require('../_utils/express-wrapper');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

module.exports = createHandler(app);
```

**Exemple : `api/menus/[...route].js` :**

```javascript
// api/menus/[...route].js
const express = require('express');
const menusRouter = require('../../back/routes/api/menus');
const { createHandler } = require('../_utils/express-wrapper');

const app = express();
app.use(express.json());
app.use('/api/menus', menusRouter);

module.exports = createHandler(app);
```

**Répétez pour toutes les routes :**
- `api/auth/[...route].js`
- `api/commandes/[...route].js`
- `api/menus/[...route].js`
- `api/avis/[...route].js`
- `api/contact/[...route].js`
- `api/horaires/[...route].js`
- `api/plats/[...route].js`
- `api/admin/[...route].js`
- `api/employe/[...route].js`
- `api/dashboard/user/[...route].js`
- `api/roles/[...route].js`

### 2.4 Créer le fichier `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/frontend/$1"
    }
  ]
}
```

### 2.5 Créer un fichier `package.json` à la racine

```json
{
  "name": "vite-gourmand",
  "version": "1.0.0",
  "scripts": {
    "build": "cd frontend && npm install && npm run build"
  },
  "dependencies": {
    "express": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.19.4",
    "mysql2": "^3.15.3",
    "nodemailer": "^6.9.15",
    "bcrypt": "^6.0.0"
  }
}
```

### 2.6 Configuration de la base de données (Déjà fait ✅)

**Le fichier `back/config/database.js` est déjà configuré** avec le système de bascule automatique :

- ✅ **Détecte automatiquement** le type de base de données via `DB_TYPE`
- ✅ **MySQL par défaut** (pour le développement local avec Docker)
- ✅ **PostgreSQL** si `DB_TYPE=postgres` (pour la production Vercel)
- ✅ **Aucune modification nécessaire** dans vos routes API

**Comment ça fonctionne :**

```javascript
// back/config/database.js (DÉJÀ CONFIGURÉ)
const DB_TYPE = process.env.DB_TYPE || "mysql"; // Par défaut MySQL

if (DB_TYPE === "postgres") {
  // Utilise PostgreSQL (Supabase) - PRODUCTION
  const postgresPool = require("./database-postgres");
  pool = postgresPool;
} else {
  // Utilise MySQL - DÉVELOPPEMENT LOCAL
  const mysql2 = require("mysql2");
  // ... configuration MySQL
}
```

**Vous n'avez rien à modifier !** Le système bascule automatiquement selon l'environnement.

### 2.7 Adapter `back/index.js` pour Vercel

Créez un fichier `api/index.js` qui initialise les connexions :

```javascript
// api/index.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connexion MongoDB (réutilisable entre les fonctions)
let mongoConnection = null;

async function connectMongo() {
  if (mongoConnection) {
    return mongoConnection;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined');
  }

  mongoConnection = mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return mongoConnection;
}

module.exports = { connectMongo };
```

Modifiez chaque route API pour initialiser MongoDB :

```javascript
// api/auth/[...route].js
const express = require('express');
const authRouter = require('../../back/routes/api/auth');
const { createHandler } = require('../_utils/express-wrapper');
const { connectMongo } = require('../index');

const app = express();
app.use(express.json());

// Initialiser MongoDB avant les routes
app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api/auth', authRouter);

module.exports = createHandler(app);
```

---

## ⚙️ Étape 3 : Configurer Vercel

### 3.1 Installer Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Se connecter à Vercel

```bash
vercel login
```

### 3.3 Initialiser le projet (optionnel)

```bash
vercel
```

---

## 🚀 Étape 4 : Déployer sur Vercel

### Option A : Déploiement via GitHub (recommandé)

1. **Pousser le code sur GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connecter le projet à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "New Project"
   - Importez votre repository GitHub
   - Vercel détectera automatiquement la configuration

3. **Configurer le build**
   - **Root Directory** : `/` (racine du projet)
   - **Build Command** : `cd frontend && npm install && npm run build`
   - **Output Directory** : `frontend/dist`

### Option B : Déploiement via CLI

```bash
# Depuis la racine du projet
vercel

# Pour la production
vercel --prod
```

---

## 🔐 Étape 5 : Configurer les variables d'environnement

### ⚠️ Distinction importante : Développement vs Production

**Il y a deux configurations distinctes :**

1. **Développement local (Docker)** : Variables dans `docker-compose.yml` - **NE PAS MODIFIER**
2. **Production (Vercel)** : Variables dans le dashboard Vercel - **À CONFIGURER**

### Configuration pour Vercel (Production)

Dans le dashboard Vercel, allez dans **Settings → Environment Variables** et ajoutez :

#### Variables Backend (API) - PostgreSQL (Supabase)

```
# Type de base de données (IMPORTANT : active PostgreSQL)
DB_TYPE=postgres

# Configuration Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
# OU (si vous préférez les variables individuelles)
DB_HOST=votre-projet.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre-mot-de-passe-supabase
DB_PORT=5432
DB_SSL=true

# MongoDB (pour Contact et Horaires)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vite_gourmand?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=rou2KL6nZnKVBo1UVkOoKIpxVzNl85xrFIdzzPj+eRMKlLfvB6jkt6yI3LLJB9q/DK5AoSQKsytxfa3/Ir3oxw==

# Configuration Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-application
SMTP_FROM=votre-email@gmail.com

# URL du frontend (pour les emails de réinitialisation)
FRONTEND_URL=https://votre-projet.vercel.app
```

#### Variables Frontend

```
VITE_API_URL=https://votre-projet.vercel.app/api
```

**Important :** Les variables frontend doivent être préfixées par `VITE_` pour être accessibles dans le code.

### Configuration pour le Développement Local (Docker)

**⚠️ NE PAS MODIFIER `docker-compose.yml`** - Il est déjà configuré pour MySQL :

```yaml
# docker-compose.yml (DÉVELOPPEMENT LOCAL - NE PAS MODIFIER)
services:
  server:
    environment:
      - DB_HOST=db                    # MySQL Docker
      - DB_NAME=vite_gourmand
      - DB_USER=root
      - DB_PASSWORD=root
      # Pas de DB_TYPE = MySQL par défaut
```

Le système détecte automatiquement :
- **Sans `DB_TYPE`** → Utilise MySQL (développement local)
- **Avec `DB_TYPE=postgres`** → Utilise PostgreSQL (production Vercel)

### Configuration par environnement dans Vercel

Vous pouvez définir des variables différentes pour :
- **Production** : Variables pour la production (branche `main`)
- **Preview** : Variables pour les branches de développement
- **Development** : Variables pour le développement local (non utilisé car Docker gère ça)

### 📝 Résumé des configurations

| Variable | Développement (Docker) | Production (Vercel) |
|----------|------------------------|---------------------|
| `DB_TYPE` | Non définie (MySQL par défaut) | `postgres` |
| `DB_HOST` | `db` (service Docker) | `votre-projet.supabase.co` |
| `DB_NAME` | `vite_gourmand` | `postgres` |
| `DB_USER` | `root` | `postgres` |
| `DB_PASSWORD` | `root` | Mot de passe Supabase |
| `DB_PORT` | `3306` (MySQL) | `5432` (PostgreSQL) |
| `DB_SSL` | `false` | `true` |
| Fichier | `docker-compose.yml` | Dashboard Vercel |

---

## 🛠️ Structure finale recommandée

```
vite_gourmand/
├── api/                          # Serverless Functions
│   ├── _utils/
│   │   └── express-wrapper.js
│   ├── index.js                  # Initialisation MongoDB
│   ├── auth/
│   │   └── [...route].js
│   ├── commandes/
│   │   └── [...route].js
│   ├── menus/
│   │   └── [...route].js
│   └── ...                       # Autres routes
├── back/                         # Code backend existant (réutilisé)
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend/                     # Application React
│   ├── src/
│   ├── public/
│   └── ...
├── vercel.json                   # Configuration Vercel
├── package.json                  # Dépendances racine
└── .env.example                  # Exemple de variables d'environnement
```

---

## 🐛 Dépannage

### Erreur : "Cannot find module"

**Solution :** Assurez-vous que toutes les dépendances sont dans le `package.json` à la racine.

### Erreur : "Database connection failed"

**Solutions :**
1. Vérifiez que les variables d'environnement sont correctement définies dans Vercel
2. Vérifiez que `DB_TYPE=postgres` est défini pour utiliser Supabase
3. Vérifiez que votre IP est autorisée dans MongoDB Atlas (ou utilisez `0.0.0.0/0` pour toutes les IPs)
4. Pour Supabase, vérifiez :
   - Que vous utilisez le bon host (`votre-projet.supabase.co`)
   - Que `DB_SSL=true` est défini
   - Que le mot de passe est correct
   - Que la base de données `postgres` existe
5. **En développement local** : Vérifiez que Docker est démarré (`docker-compose up`)

### Erreur : "Function timeout"

**Solution :** Les fonctions serverless ont une limite de temps. Pour les requêtes longues, utilisez Vercel Pro ou optimisez vos requêtes.

### Les routes API ne fonctionnent pas

**Solution :** Vérifiez que :
1. Les fichiers dans `api/` suivent la convention de nommage de Vercel
2. Le fichier `vercel.json` est correctement configuré
3. Les routes sont exportées correctement

### Le frontend ne trouve pas l'API

**Solution :** Vérifiez que `VITE_API_URL` est défini avec l'URL complète de votre déploiement Vercel (ex: `https://votre-projet.vercel.app/api`).

### Erreur : "DB_TYPE is not defined" ou connexion MySQL en production

**Solution :** Assurez-vous que `DB_TYPE=postgres` est défini dans les variables d'environnement Vercel. Sans cette variable, le système utilisera MySQL par défaut.

### Erreur : "Cannot connect to database" en développement local

**Solution :** 
- Vérifiez que Docker est démarré : `docker-compose up -d`
- Vérifiez que le service `db` (MySQL) est en cours d'exécution : `docker-compose ps`
- Les variables dans `docker-compose.yml` ne doivent **PAS** inclure `DB_TYPE` (MySQL par défaut)

---

## 🔄 Alternatives

### Alternative 1 : Utiliser MySQL en production (au lieu de PostgreSQL)

Si vous préférez garder MySQL en production :

1. **Créez un compte sur [PlanetScale](https://planetscale.com)** (MySQL cloud gratuit)
2. **Dans Vercel, configurez les variables** :
   ```
   DB_TYPE=mysql  # Ou ne définissez pas DB_TYPE (MySQL par défaut)
   DB_HOST=votre-host-planetscale.mysql.planetscale.com
   DB_NAME=vite_gourmand
   DB_USER=votre-username
   DB_PASSWORD=votre-password
   DB_PORT=3306
   DB_SSL=true
   ```
3. **Aucune adaptation SQL nécessaire** (déjà en MySQL)

### Alternative 2 : Backend séparé sur Railway/Render

Si vous préférez garder le backend sur une autre plateforme :

1. **Déployez le backend sur [Railway](https://railway.app) ou [Render](https://render.com)**
2. **Déployez uniquement le frontend sur Vercel**
3. **Configurez `VITE_API_URL`** avec l'URL de votre backend déployé
4. **Gardez `docker-compose.yml`** pour le développement local

### Alternative 3 : Utiliser Next.js

Pour une meilleure intégration avec Vercel, vous pourriez migrer vers Next.js qui offre :
- API Routes intégrées
- Server-side rendering
- Meilleure optimisation

**Note :** Cela nécessiterait une refactorisation complète du frontend.

---

## 📝 Checklist de déploiement

### Préparation

- [ ] Compte Supabase créé et projet configuré
- [ ] Compte MongoDB Atlas créé et cluster configuré
- [ ] Scripts SQL adaptés pour PostgreSQL (voir `GUIDE_ADAPTATION_POSTGRESQL.md`)
- [ ] Schéma de base de données créé dans Supabase

### Configuration du projet

- [ ] Dossier `api/` créé avec toutes les routes (`npm run generate-api`)
- [ ] Fichier `vercel.json` créé (déjà fait ✅)
- [ ] `package.json` à la racine avec toutes les dépendances (déjà fait ✅)
- [ ] Dépendance `pg` installée (`npm install pg`)

### Déploiement Vercel

- [ ] Code poussé sur GitHub
- [ ] Projet connecté à Vercel
- [ ] Variables d'environnement configurées dans Vercel :
  - [ ] `DB_TYPE=postgres`
  - [ ] Variables Supabase (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, etc.)
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] Variables SMTP
  - [ ] `VITE_API_URL`
  - [ ] `FRONTEND_URL`
- [ ] Déploiement réussi
- [ ] Tests de l'application en production

### Vérifications

- [ ] ✅ `docker-compose.yml` **N'A PAS ÉTÉ MODIFIÉ** (MySQL pour dev local)
- [ ] ✅ Variables Vercel configurées avec `DB_TYPE=postgres`
- [ ] ✅ Application fonctionne en production
- [ ] ✅ Application fonctionne toujours en développement local (Docker)

---

## 🎉 Félicitations !

Votre application est maintenant déployée sur Vercel ! 

**URLs typiques :**
- Frontend : `https://votre-projet.vercel.app`
- API : `https://votre-projet.vercel.app/api`

---

## 📚 Ressources supplémentaires

- [Documentation Vercel](https://vercel.com/docs)
- [Serverless Functions Vercel](https://vercel.com/docs/functions)
- [PlanetScale Documentation](https://docs.planetscale.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

## 💡 Notes importantes

1. **Cold Start** : Les Serverless Functions peuvent avoir un délai au premier appel (cold start). C'est normal.

2. **Limites Vercel Free** :
   - 100 GB de bande passante/mois
   - 100 heures de fonctions serverless/mois
   - Timeout de 10 secondes par fonction

3. **Base de données** : Les connexions MySQL/MongoDB doivent être gérées avec des pools pour éviter les limites de connexions.

4. **Variables d'environnement** : N'oubliez pas de les redéfinir si vous créez un nouveau projet Vercel.

---

**Besoin d'aide ?** Consultez la [documentation Vercel](https://vercel.com/docs) ou les logs de déploiement dans le dashboard Vercel.

#viteGourmand / mot de passe base de donnée PostgreSQL production 