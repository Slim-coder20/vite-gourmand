# Vite & Gourmand - Application de Commande de Repas en Ligne

Application web full-stack permettant aux clients de commander des repas en ligne, avec des espaces dédiés pour les clients, employés et administrateurs.

## 📋 Prérequis

- **Node.js** (version 18.x ou supérieure)
- **npm** (inclus avec Node.js)
- **Git**
- **PostgreSQL** : en production, base hébergée sur **Supabase**
- **MongoDB** : formulaire de contact, horaires d’ouverture, statistiques côté admin
- **Supabase** : base de données (PostgreSQL) + **Supabase Storage** pour l’upload des images (avatars, etc.)

## 🗄️ Stack technique et données

| Usage | Technologie |
|--------|-------------|
| **Production (données métier)** | **Supabase** (PostgreSQL) — utilisateurs, rôles, menus, plats, avis, commandes |
| **Contact, horaires, stats admin** | **MongoDB** (Mongoose) — messages de contact, horaires, statistiques de commandes |
| **Upload d’images** | **Supabase Storage** — avatars utilisateurs, images plats/menus |

MySQL n’est pas utilisé : le projet est en **PostgreSQL (Supabase)** en prod.

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd vite_gourmand
```

### 2. Installer les dépendances

À la racine, dans `back/` et dans `frontend/` :

```bash
npm install
cd back && npm install && cd ..
cd frontend && npm install && cd ..
```

## ⚙️ Configuration

### Variables d’environnement

Fichier `.env` à la racine (et/ou `back/.env`, `frontend/.env` selon le mode de lancement). Exemple :

```env
# Base de données principale (Supabase)
DB_TYPE=postgres
DATABASE_URL=postgresql://user:password@host:port/database

# MongoDB (contact, horaires, statistiques admin)
MONGODB_URI=mongodb://root:root@localhost:27017/vite_gourmand?authSource=admin

# JWT
JWT_SECRET=votre_cle_secrete_jwt

# Frontend (liens emails, etc.)
FRONTEND_URL=http://localhost:5173

# SMTP (emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASSWORD=mot_de_passe_application
SMTP_FROM=votre_email@gmail.com

# Supabase Storage (upload d’images)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role

# Frontend : URL de l’API
VITE_API_URL=http://localhost:3000/api
```

Génération d’une clé JWT :

```bash
node scripts/generate-jwt-secret.js
```

### Base de données PostgreSQL (Supabase)

1. Créer un projet sur [Supabase](https://supabase.com).
2. Récupérer `DATABASE_URL` dans les paramètres du projet.
3. Exécuter les migrations (depuis la racine) :

```bash
psql "$DATABASE_URL" -f back/mysql_data/migration-postgresql-v001.sql
psql "$DATABASE_URL" -f back/mysql_data/fix-postgresql-sequences.sql
```

### Supabase Storage (images)

1. Dans le projet Supabase, créer un bucket `user-avatars` (ou selon votre code).
2. Configurer les politiques RLS (INSERT pour utilisateurs authentifiés, SELECT public si besoin).

## 🐳 Conteneurisation (Docker)

Le projet est entièrement conteneurisable : frontend, backend et services (PostgreSQL, MongoDB) sont décrits dans `docker-compose.yml`.

### Services définis dans `docker-compose.yml`

| Service | Rôle | Port(s) |
|--------|------|--------|
| **db** | PostgreSQL (données métier) | 5432 |
| **mongodb** | MongoDB (contact, horaires, stats) | 27017 |
| **db-init** | Initialisation des tables Postgres (migrations) | — |
| **adminer** | Interface web de gestion PostgreSQL | 8080 |
| **mongo-express** | Interface web de gestion MongoDB | 8081 |
| **server** | Backend Express (API) | 3000 |
| **frontend** | Application React (Vite) | 5173 |

### Lancer l’application avec Docker

À la racine du projet :

```bash
docker-compose up -d
```

- **Frontend** : http://localhost:5173  
- **API** : http://localhost:3000  
- **Adminer** (PostgreSQL) : http://localhost:8080  
- **Mongo Express** : http://localhost:8081  

Le service **server** dépend de `db`, `mongodb` et `db-init`. Le **frontend** dépend du **server**. Les variables d’environnement (Supabase, JWT, SMTP, etc.) sont définies dans `docker-compose.yml` pour les conteneurs ; en local sans Docker, utilisez les fichiers `.env` (racine, `back/`, `frontend/`).

### Lancer uniquement les bases (dev local back + front sur la machine)

```bash
docker-compose up -d db mongodb
# puis : cd back && npm run dev  et  cd frontend && npm run dev
```

## 🏃 Lancement sans Docker (développement)

1. Démarrer PostgreSQL (Supabase ou local) et MongoDB (ex. `docker-compose up -d mongodb` si seulement MongoDB en Docker).
2. Configurer les `.env` (voir ci-dessus).
3. Backend : `cd back && npm run dev` → http://localhost:3000  
4. Frontend : `cd frontend && npm run dev` → http://localhost:5173  

## 📁 Structure du projet

```
vite_gourmand/
├── api/                    # Routes API Vercel (serverless)
├── back/                   # Backend Express.js
│   ├── config/             # Configuration (DB, email, Supabase, etc.)
│   ├── middleware/         # Auth, rôles
│   ├── models/             # Modèles Mongoose (Contact, Horaire, etc.)
│   ├── routes/             # Routes API
│   └── mysql_data/         # Scripts SQL (migrations PostgreSQL)
├── frontend/                # Frontend React + Vite
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── styles/
├── Diagralmme BD/          # Diagrammes (MCD, MLD, MPD, cas d’utilisation, séquence)
├── scripts/
└── vercel.json
```

## 🛠️ Technologies utilisées

### Backend

- **Node.js** + **Express.js**
- **PostgreSQL** (Supabase) — données métier
- **MongoDB** (Mongoose) — contact, horaires, statistiques admin
- **JWT** (authentification), **bcrypt** (mots de passe)
- **Nodemailer** (emails), **Multer** (fichiers)
- **Supabase Storage** (upload d’images)

### Frontend

- **React 19**, **Vite**, **React Router**
- **CSS Modules**, charte graphique (variables CSS)

## 👥 Rôles

1. **Client** (`role_id: 1`) : commandes, profil  
2. **Admin** (`role_id: 2`) : administration complète, statistiques  
3. **Employé** (`role_id: 3`) : commandes, avis, plats, menus, horaires  

## 🔐 Compte administrateur

```bash
cd back
node create-admin-hash.js
```

Puis créer l’utilisateur en base avec `role_id = 2`.

## 📝 Scripts

- `npm run build` : build du frontend  
- `npm run export-mysql` : export MySQL → PostgreSQL (migration)  
- `cd back && npm run dev` : backend en dev  
- `cd frontend && npm run dev` : frontend en dev  

## 📐 Diagrammes

Les diagrammes du projet sont dans le dossier **`Diagralmme BD/`** :

| Document | Fichier | Description |
|----------|---------|-------------|
| **Modèle physique des données (MPD)** | [MPD.jpeg](./Diagralmme%20BD/MPD.jpeg) | Schéma physique des tables (PostgreSQL) |
| **Modèle logique des données (MLD)** | [Diagramme MLD.jpeg](./Diagralmme%20BD/Diagramme%20MLD.jpeg) | Relations et structure logique |
| **Modèle conceptuel des données (MCD)** | [Diagramme MCD.jpeg](./Diagralmme%20BD/Diagramme%20MCD.jpeg) | Entités et associations |
| **Cas d’utilisation** | [Diagramme _cas_d'utilisation.jpeg](./Diagralmme%20BD/Diagramme%20_cas_d%27utilisation.jpeg) | Acteurs et cas d’usage |

## 🐛 Dépannage

- **Connexion PostgreSQL** : vérifier `DATABASE_URL` et `DB_TYPE=postgres` (Supabase, port 5432).  
- **Connexion MongoDB** : `ECONNREFUSED 127.0.0.1:27017` → lancer MongoDB (ex. `docker-compose up -d mongodb`) et définir `MONGODB_URI` dans `.env`.  
- **CORS** : vérifier `FRONTEND_URL` et la config CORS de l’API (Vercel ou back).  
- **Images** : vérifier le bucket Supabase, RLS, `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.  

## 🎨 Maquettes

[Maquettes Wireframe et Mockup](./maquette-wireframe-mockup/Vite%20%26%20Gourmand%20ECF%20Maquette%20Wireframe%20et%20Mockup.pdf)

## 📄 Licence

ISC  

**Vite & Gourmand** – Slim Abida – ECF STUDI 2026
