# Vite & Gourmand - Application de Commande de Repas en Ligne

Application web full-stack permettant aux clients de commander des repas en ligne, avec des espaces dédiés pour les clients, employés et administrateurs.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js** (version 18.x ou supérieure)
- **npm** (généralement inclus avec Node.js)
- **Git**
- **Base de données PostgreSQL** (Supabase recommandé) ou MySQL
- **MongoDB** (pour les messages de contact et les horaires)
- Un compte **Supabase** (pour le stockage des images de profil)

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd vite_gourmand
```

### 2. Installer les dépendances

#### À la racine du projet
```bash
npm install
```

#### Dans le dossier `back/`
```bash
cd back
npm install
cd ..
```

#### Dans le dossier `frontend/`
```bash
cd frontend
npm install
cd ..
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Type de base de données (postgres ou mysql)
DB_TYPE=postgres

# URL de connexion PostgreSQL (Supabase)
DATABASE_URL=postgresql://user:password@host:port/database

# URL de connexion MongoDB
MONGODB_URI=mongodb://localhost:27017/vite_gourmand

# JWT Secret (générez une clé secrète)
JWT_SECRET=votre_cle_secrete_jwt

# Configuration email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application

# URL du frontend
FRONTEND_URL=http://localhost:5173

# Configuration Supabase (pour le stockage des images)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role

# URL de l'API (pour le frontend)
VITE_API_URL=http://localhost:3000/api
```

**Note :** Pour le frontend, créez également un fichier `.env` dans le dossier `frontend/` :

```env
VITE_API_URL=http://localhost:3000/api
```

### Génération d'une clé JWT secrète

Vous pouvez générer une clé JWT secrète en utilisant le script fourni :

```bash
node scripts/generate-jwt-secret.js
```

## 🗄️ Base de données

### Option 1 : PostgreSQL (Supabase) - Recommandé

1. Créez un projet sur [Supabase](https://supabase.com)
2. Récupérez votre `DATABASE_URL` depuis les paramètres du projet
3. Exécutez les scripts de migration dans l'ordre :
   ```bash
   # Création des tables
   psql $DATABASE_URL -f back/mysql_data/migration-postgresql-v001.sql
   
   # Correction des séquences (si import depuis MySQL)
   psql $DATABASE_URL -f back/mysql_data/fix-postgresql-sequences.sql
   ```

### Option 2 : MySQL

1. Créez une base de données MySQL
2. Exécutez les scripts de migration :
   ```bash
   mysql -u user -p database_name < back/mysql_data/migration-v001.sql
   ```

### Configuration Supabase Storage

1. Dans votre projet Supabase, créez un bucket nommé `user-avatars`
2. Configurez les politiques RLS :
   - **INSERT** : Authenticated users uniquement
   - **SELECT** : Public (pour afficher les images)

## 🏃 Lancement de l'application

### Développement

#### 1. Lancer le backend

```bash
cd back
npm run dev
```

Le backend sera accessible sur `http://localhost:3000`

#### 2. Lancer le frontend (dans un autre terminal)

```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

### Production locale

#### Backend
```bash
cd back
node index.js
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Structure du projet

```
vite_gourmand/
├── api/                    # Routes API Vercel (serverless)
├── back/                   # Backend Express.js
│   ├── config/            # Configuration (DB, email, etc.)
│   ├── middleware/        # Middlewares (auth, roles)
│   ├── models/            # Modèles Mongoose
│   ├── routes/            # Routes API
│   └── mysql_data/        # Scripts SQL de migration
├── frontend/              # Frontend React + Vite
│   ├── public/            # Fichiers statiques
│   └── src/
│       ├── components/    # Composants React
│       ├── pages/         # Pages de l'application
│       ├── services/      # Services API
│       └── styles/        # Styles CSS
├── scripts/               # Scripts utilitaires
└── vercel.json           # Configuration Vercel
```

## 🛠️ Technologies utilisées

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** (Supabase) / **MySQL**
- **MongoDB** (Mongoose)
- **JWT** pour l'authentification
- **bcrypt** pour le hachage des mots de passe
- **Nodemailer** pour l'envoi d'emails
- **Multer** pour l'upload de fichiers
- **Supabase Storage** pour le stockage des images

### Frontend
- **React 19**
- **Vite**
- **React Router** pour la navigation
- **CSS Modules** pour le styling

## 👥 Rôles utilisateurs

L'application dispose de trois types d'utilisateurs :

1. **Client** (`role_id: 1`) : Peut commander des repas, gérer son profil
2. **Admin** (`role_id: 2`) : Accès complet à l'administration
3. **Employé** (`role_id: 3`) : Gestion des commandes, avis, plats, menus

## 🔐 Création d'un compte administrateur

Pour créer un compte administrateur, utilisez le script fourni :

```bash
cd back
node create-admin-hash.js
```

Puis insérez manuellement l'utilisateur dans la base de données avec `role_id = 2`.

## 📝 Scripts disponibles

- `npm run build` : Build du frontend
- `npm run export-mysql` : Export des données MySQL vers PostgreSQL
- `cd back && npm run dev` : Lancement du backend en mode développement
- `cd frontend && npm run dev` : Lancement du frontend en mode développement

## 🐛 Dépannage

### Erreur de connexion à la base de données

- Vérifiez que `DATABASE_URL` est correctement configurée
- Vérifiez que `DB_TYPE` correspond à votre base de données
- Pour Supabase, utilisez le Session Pooler (port 5432)

### Erreur CORS

- Assurez-vous que `FRONTEND_URL` correspond à l'URL du frontend
- Vérifiez la configuration CORS dans `api/[...route].js`

### Images non affichées

- Vérifiez que le bucket Supabase `user-avatars` existe
- Vérifiez les politiques RLS du bucket
- Vérifiez que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont configurés

## 📚 Documentation supplémentaire

- `DOCUMENTATION_DEPLOIEMENT_VERCEL_POSTGRESQL.md` : Guide de déploiement sur Vercel
- `GUIDE_ADAPTATION_POSTGRESQL.md` : Guide d'adaptation MySQL → PostgreSQL
- `GUIDE_CREATION_TABLES_SUPABASE.md` : Guide de création des tables

## 📄 Licence

ISC

## 👤 Auteur

Vite & Gourmand - ECF STUDI 2026

