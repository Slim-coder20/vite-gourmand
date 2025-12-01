# 🍽️ Vite & Gourmand

Application web de commande de repas en ligne avec livraison. Plateforme permettant aux utilisateurs de commander des menus personnalisés avec différentes options (Brasserie, Fitness, Végétarien, Équilibre).

## 📋 Table des matières

- [Technologies utilisées](#-technologies-utilisées)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration Backend](#-configuration-backend)
- [Configuration Frontend](#-configuration-frontend)
- [Containerisation Docker](#-containerisation-docker)
- [Services disponibles](#-services-disponibles)
- [Structure du projet](#-structure-du-projet)
- [Commandes utiles](#-commandes-utiles)
- [Documentation](#-documentation)

---

## 🛠️ Technologies utilisées

### Backend

- **Node.js** avec **Express 5.1.0** : Framework web pour l'API REST
- **MySQL 9.5.0** : Base de données relationnelle principale
- **MongoDB 8.0** : Base de données NoSQL pour Contact et Horaires
- **JWT** (jsonwebtoken) : Authentification par tokens
- **bcrypt** : Hashage des mots de passe
- **Mongoose** : ODM pour MongoDB
- **mysql2** : Driver MySQL pour Node.js
- **Nodemon** : Redémarrage automatique en développement

### Frontend

- **React 19.2.0** : Bibliothèque JavaScript pour l'interface utilisateur
- **Vite 7.2.4** : Build tool et serveur de développement
- **CSS Modules** : Styles modulaires par composant
- **ESLint** : Linter pour la qualité du code

### Infrastructure

- **Docker** & **Docker Compose** : Containerisation et orchestration
- **Adminer** : Interface web pour MySQL
- **Mongo Express** : Interface web pour MongoDB

---

## 🏗️ Architecture

L'application suit une architecture **monorepo** avec séparation claire entre backend et frontend :

```
vite_gourmand/
├── back/          # API Node.js + Express
├── frontend/      # Application React + Vite
├── doc/           # Documentation
└── docker-compose.yml
```

### Services Docker

- **Frontend** : Application React accessible sur le port 5173
- **Backend** : API Express accessible sur le port 3000
- **MySQL** : Base de données principale sur le port 3306
- **MongoDB** : Base de données NoSQL sur le port 27017
- **Adminer** : Interface MySQL sur le port 8080
- **Mongo Express** : Interface MongoDB sur le port 8081

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version 2.0 ou supérieure)
- **Git**

Pour vérifier vos installations :

```bash
docker --version
docker-compose --version
git --version
```

---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <url-du-repository>
cd vite_gourmand
```

### 2. Démarrer tous les services avec Docker

```bash
docker-compose up -d
```

Cette commande va :

- Construire les images Docker pour le backend et le frontend
- Démarrer tous les conteneurs (MySQL, MongoDB, Adminer, Mongo Express, Server, Frontend)
- Exécuter automatiquement les scripts SQL d'initialisation (si le volume MySQL est vide)

### 3. Vérifier que tous les services sont démarrés

```bash
docker-compose ps
```

Vous devriez voir tous les conteneurs avec le statut "Up".

### 4. Exécuter les scripts SQL (si nécessaire)

Si les tables ne sont pas créées automatiquement, exécutez manuellement :

```bash
# Script de migration (création des tables)
docker-compose exec -T db mysql -uroot -proot vite_gourmand < back/mysql_data/migration-v001.sql

# Script de données de test
docker-compose exec -T db mysql -uroot -proot vite_gourmand < back/mysql_data/data-test-menus.sql
```

---

## ⚙️ Configuration Backend

### Structure du Backend

```
back/
├── config/
│   └── database.js          # Configuration MySQL
├── middleware/
│   └── auth.js              # Middleware d'authentification JWT
├── models/
│   ├── Contact.js           # Modèle MongoDB pour les contacts
│   └── Horaire.js           # Modèle MongoDB pour les horaires
├── routes/
│   └── api/
│       ├── auth.js          # Routes d'authentification
│       ├── commandes.js     # Routes des commandes
│       ├── contact.js        # Routes des contacts
│       ├── horaires.js       # Routes des horaires
│       ├── menus.js          # Routes des menus
│       └── roles.js          # Routes des rôles
├── mysql_data/
│   ├── migration-v001.sql   # Script de création des tables
│   └── data-test-menus.sql  # Données de test
├── index.js                 # Point d'entrée de l'application
├── node.dockerfile          # Dockerfile pour le backend
└── package.json
```

### Variables d'environnement Backend

Les variables d'environnement sont définies dans `docker-compose.yml` :

- `DB_HOST=db` : Host de la base de données MySQL
- `MONGODB_URI=mongodb://root:root@mongodb:27017/vite_gourmand?authSource=admin` : URI de connexion MongoDB
- `JWT_SECRET=rou2KL6nZnKVBo1UVkOoKIpxVzNl85xrFIdzzPj+eRMKlLfvB6jkt6yI3LLJB9q/DK5AoSQKsytxfa3/Ir3oxw==` : Clé secrète pour JWT

### Scripts disponibles

```bash
# Développement (avec hot reload)
npm run dev

# Installer les dépendances (dans le conteneur)
docker-compose exec server npm install
```

### Base de données MySQL

**Structure des tables principales :**

- `role` : Rôles utilisateurs (utilisateur, admin, employe)
- `user` : Utilisateurs de l'application
- `menu` : Menus disponibles
- `plat` : Plats individuels
- `commande` : Commandes des utilisateurs
- `avis` : Avis des utilisateurs
- `allergene` : Allergènes
- `regime` : Régimes alimentaires (Classique, Végétarien, Vegan)
- `theme` : Thèmes de menus (Classique, Noël, Pâques, Événement)

**Connexion MySQL :**

- Host : `localhost` (ou `db` depuis un conteneur Docker)
- Port : `3306`
- Utilisateur : `root`
- Mot de passe : `root`
- Base de données : `vite_gourmand`

### Base de données MongoDB

**Collections :**

- `contacts` : Messages de contact
- `horaires` : Horaires d'ouverture

**Connexion MongoDB :**

- Host : `localhost` (ou `mongodb` depuis un conteneur Docker)
- Port : `27017`
- Utilisateur : `root`
- Mot de passe : `root`
- Base de données : `vite_gourmand`

---

## 🎨 Configuration Frontend

### Structure du Frontend

```
frontend/
├── public/
│   └── images/              # Images statiques
├── src/
│   ├── components/
│   │   ├── footer/          # Composant Footer
│   │   ├── header/          # Composant Header
│   │   ├── hero/            # Composant Hero
│   │   ├── howItWorks/      # Composant "Comment ça marche"
│   │   └── promoBanner/     # Bandeau promotionnel
│   ├── App.jsx              # Composant principal
│   ├── main.jsx             # Point d'entrée React
│   └── index.css            # Variables CSS globales
├── Dockerfile               # Dockerfile pour le frontend
├── vite.config.js           # Configuration Vite
└── package.json
```

### Variables d'environnement Frontend

- `VITE_API_URL=http://localhost:3000/api` : URL de l'API backend

### Charte graphique

Les variables CSS sont définies dans `src/index.css` :

**Couleurs :**

- Primaire : `#c41e3a` (Rouge bordeaux)
- Secondaire : `#f5a623` (Orange doré)
- Arrière-plan : `#fffbf7` (Beige très clair)

**Polices :**

- Titres : `Playfair Display` (serif)
- Corps : `Inter` (sans-serif)

### Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint

# Installer les dépendances (dans le conteneur)
docker-compose exec frontend npm install
```

### Composants React

- **Header** : Navigation avec logo centré, menu burger responsive
- **PromoBanner** : Bandeau promotionnel jaune
- **Hero** : Section hero avec image en arrière-plan
- **HowItWorks** : Section "Comment ça marche" avec 4 étapes
- **Footer** : Pied de page avec horaires, réseaux sociaux, liens légaux

---

## 🐳 Containerisation Docker

### Architecture Docker

L'application utilise **Docker Compose** pour orchestrer 6 services :

1. **db** (MySQL) : Base de données principale
2. **mongodb** : Base de données NoSQL
3. **adminer** : Interface web MySQL
4. **mongo-express** : Interface web MongoDB
5. **server** : API Node.js + Express
6. **frontend** : Application React + Vite

### Volumes Docker

- `./back/mysql_data:/docker-entrypoint-initdb.d` : Scripts SQL d'initialisation
- `mongodb_data:/data/db` : Données persistantes MongoDB
- `./back:/app` : Code source backend (hot reload)
- `./frontend:/app` : Code source frontend (hot reload)

### Hot Reload

Les modifications dans `./back` et `./frontend` sont automatiquement reflétées grâce aux volumes montés. Pas besoin de reconstruire les images à chaque modification.

### Commandes Docker essentielles

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Voir le statut des conteneurs
docker-compose ps

# Redémarrer un service spécifique
docker-compose restart server

# Reconstruire les images
docker-compose build

# Exécuter une commande dans un conteneur
docker-compose exec server npm install
docker-compose exec frontend npm install
```

Pour plus de détails, consultez le fichier [`doc/docker-services.md`](./doc/docker-services.md).

---

## 🌐 Services disponibles

Une fois tous les services démarrés, vous pouvez accéder à :

| Service           | URL                   | Description           |
| ----------------- | --------------------- | --------------------- |
| **Frontend**      | http://localhost:5173 | Interface utilisateur |
| **Backend API**   | http://localhost:3000 | API REST              |
| **Adminer**       | http://localhost:8080 | Interface MySQL       |
| **Mongo Express** | http://localhost:8081 | Interface MongoDB     |

### Connexion Adminer

- **Système** : MySQL
- **Serveur** : `db`
- **Utilisateur** : `root`
- **Mot de passe** : `root`
- **Base de données** : `vite_gourmand`

### Connexion Mongo Express

- **Username** : `admin`
- **Password** : `admin`

---

## 📁 Structure du projet

```
vite_gourmand/
├── back/                    # Backend Node.js + Express
│   ├── config/             # Configuration
│   ├── middleware/         # Middlewares Express
│   ├── models/             # Modèles MongoDB
│   ├── routes/             # Routes API
│   ├── mysql_data/         # Scripts SQL
│   ├── index.js            # Point d'entrée
│   ├── node.dockerfile     # Dockerfile backend
│   └── package.json
├── frontend/               # Frontend React + Vite
│   ├── public/             # Fichiers statiques
│   ├── src/               # Code source React
│   ├── Dockerfile         # Dockerfile frontend
│   └── package.json
├── doc/                    # Documentation
│   └── docker-services.md # Documentation Docker
├── docker-compose.yml      # Configuration Docker Compose
└── README.md              # Ce fichier
```

---

## 🔧 Commandes utiles

### Développement

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f server
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart server
docker-compose restart frontend
```

### Base de données

```bash
# Exécuter un script SQL
docker-compose exec -T db mysql -uroot -proot vite_gourmand < chemin/script.sql

# Accéder au shell MySQL
docker-compose exec db mysql -uroot -proot vite_gourmand

# Accéder au shell MongoDB
docker-compose exec mongodb mongosh -u root -p root
```

### Maintenance

```bash
# Reconstruire les images
docker-compose build

# Reconstruire sans cache
docker-compose build --no-cache

# Nettoyer les conteneurs arrêtés
docker-compose rm

# Nettoyer les volumes non utilisés
docker volume prune
```

---

## 📚 Documentation

- **Documentation Docker** : [`doc/docker-services.md`](./doc/docker-services.md)

  - URLs de tous les services
  - Commandes Docker complètes
  - Configuration et dépannage

- **Documentation Backend** : Consultez les fichiers dans `back/doc/`
  - Authentification
  - Routes API
  - Tests Postman

---

## 🐛 Dépannage

### Les tables MySQL ne sont pas créées

Si vous ne voyez pas de tables dans Adminer :

```bash
# Exécuter manuellement les scripts SQL
docker-compose exec -T db mysql -uroot -proot vite_gourmand < back/mysql_data/migration-v001.sql
docker-compose exec -T db mysql -uroot -proot vite_gourmand < back/mysql_data/data-test-menus.sql
```

### Les ports sont déjà utilisés

Vérifiez quels processus utilisent les ports :

```bash
# macOS/Linux
lsof -i :3000
lsof -i :5173
lsof -i :3306
```

### Les conteneurs ne démarrent pas

Vérifiez les logs :

```bash
docker-compose logs -f
```

### Reconstruire depuis zéro

```bash
# Arrêter et supprimer tous les conteneurs et volumes
docker-compose down -v

# Reconstruire les images
docker-compose build --no-cache

# Redémarrer
docker-compose up -d
```

---

## 👥 Auteurs

- **Slim** - Développement initial

---

## 📄 Licence

Ce projet est sous licence ISC.

---

## 🙏 Remerciements

Merci d'avoir utilisé Vite & Gourmand ! 🍽️
