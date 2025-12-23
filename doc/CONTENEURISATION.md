# Documentation du Système de Conteneurisation - Vite Gourmand

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Docker](#architecture-docker)
3. [Dockerfiles : Construction des images](#dockerfiles--construction-des-images)
   - [Backend - `back/node.dockerfile`](#-backnode.dockerfile)
   - [Frontend - `frontend/Dockerfile`](#-frontenddockerfile)
4. [Docker Compose : Orchestration](#docker-compose--orchestration)
   - [Fichier `docker-compose.yml`](#-docker-composeyml)
   - [Services Docker Compose](#services-docker-compose)
5. [Volumes et persistance](#volumes-et-persistance)
6. [Réseau et ports](#réseau-et-ports)
7. [Variables d'environnement](#variables-denvironnement)
8. [Démarrage et utilisation](#démarrage-et-utilisation)
9. [Maintenance et dépannage](#maintenance-et-dépannage)

---

## Vue d'ensemble

Le projet **Vite Gourmand** utilise **Docker** et **Docker Compose** pour orchestrer tous les services nécessaires au fonctionnement de l'application. Cette approche permet :

- **Isolation** : Chaque service fonctionne dans son propre conteneur
- **Reproductibilité** : Environnement identique sur toutes les machines
- **Simplicité** : Démarrage en une seule commande
- **Scalabilité** : Facilite le déploiement et la montée en charge

---

## Architecture Docker

### Services conteneurisés

Le projet contient **7 services** principaux :

1. **PostgreSQL** : Base de données principale
2. **MongoDB** : Base de données pour Contact et Horaires
3. **Adminer** : Interface web pour PostgreSQL
4. **Mongo Express** : Interface web pour MongoDB
5. **db-init** : Service d'initialisation de la base de données
6. **server** : API Backend (Node.js/Express)
7. **frontend** : Application React (Vite)

### Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │   MongoDB    │  │   Adminer    │  │
│  │   (db)       │  │  (mongodb)   │  │  (adminer)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘  │
│         │                │                             │
│         │                │                             │
│  ┌──────▼──────────┐     │                             │
│  │   db-init       │     │                             │
│  │  (init script)  │     │                             │
│  └──────┬──────────┘     │                             │
│         │                │                             │
│  ┌──────▼──────────┐  ┌──▼──────────┐  ┌──────────────┐│
│  │    Server       │  │ Mongo       │  │   Frontend   ││
│  │   (Backend)     │  │ Express     │  │   (React)    ││
│  └─────────────────┘  └─────────────┘  └──────────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Dockerfiles : Construction des images

### Qu'est-ce qu'un Dockerfile ?

Un **Dockerfile** est un fichier texte contenant une série d'instructions qui décrivent comment construire une **image Docker**. Une image Docker est un modèle immuable qui contient tout ce qui est nécessaire pour exécuter une application : le système d'exploitation, les dépendances, le code source, et les configurations.

**Processus de build** :

```
Dockerfile → docker build → Image Docker → docker run → Conteneur
```

### Comment Docker utilise les Dockerfiles

1. **Lecture du Dockerfile** : Docker lit les instructions ligne par ligne
2. **Construction des couches** : Chaque instruction crée une nouvelle couche (layer)
3. **Mise en cache** : Docker met en cache les couches pour accélérer les builds suivants
4. **Création de l'image** : L'image finale est créée avec toutes les couches empilées
5. **Utilisation** : L'image peut être utilisée pour créer des conteneurs

### Optimisation du cache Docker

Docker utilise un système de cache intelligent :

- Si une instruction n'a pas changé, Docker réutilise la couche en cache
- Si une instruction change, toutes les instructions suivantes sont reconstruites
- **Bonnes pratiques** : Copier d'abord les fichiers qui changent rarement (package.json) avant le code source

---

### 📄 `back/node.dockerfile`

### 📦 Service `db` - PostgreSQL

**Image** : `postgres:17-alpine`

**Rôle** : Base de données principale pour les données de l'application (utilisateurs, commandes, menus, plats, avis).

**Configuration** :

```yaml
ports:
  - "5432:5432" # Port PostgreSQL exposé

environment:
  POSTGRES_USER: postgres (par défaut)
  POSTGRES_PASSWORD: root (par défaut)
  POSTGRES_DB: vite_gourmand (par défaut)

volumes:
  - postgres_data:/var/lib/postgresql/data

healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 5s
  timeout: 5s
  retries: 5
```

**Caractéristiques** :

- Utilise Alpine Linux (image légère)
- Healthcheck pour vérifier que la base est prête
- Volume nommé pour persister les données
- Variables d'environnement configurables via `.env`

**Note** : Le service MySQL est commenté dans le docker-compose mais peut être activé si nécessaire.

---

### 📦 Service `mongodb` - MongoDB

**Image** : `mongo:8.0`

**Rôle** : Base de données NoSQL pour stocker les messages de contact et les horaires d'ouverture.

**Configuration** :

```yaml
ports:
  - "27017:27017" # Port MongoDB exposé

environment:
  MONGO_INITDB_ROOT_USERNAME: root
  MONGO_INITDB_ROOT_PASSWORD: root
  MONGO_INITDB_DATABASE: vite_gourmand

volumes:
  - mongodb_data:/data/db
```

**Caractéristiques** :

- Redémarrage automatique (`restart: always`)
- Authentification activée avec utilisateur root
- Volume nommé pour persister les données

---

### 📦 Service `adminer` - Interface PostgreSQL

**Image** : `adminer`

**Rôle** : Interface web pour gérer la base de données PostgreSQL.

**Configuration** :

```yaml
ports:
  - "8080:8080" # Interface web accessible sur http://localhost:8080

restart: always
```

**Accès** :

- URL : `http://localhost:8080`
- Système : PostgreSQL
- Serveur : `db`
- Utilisateur : `postgres`
- Mot de passe : `root`
- Base de données : `vite_gourmand`

---

### 📦 Service `mongo-express` - Interface MongoDB

**Image** : `mongo-express:latest`

**Rôle** : Interface web pour gérer la base de données MongoDB.

**Configuration** :

```yaml
ports:
  - "8081:8081" # Interface web accessible sur http://localhost:8081

environment:
  ME_CONFIG_MONGODB_ADMINUSERNAME: root
  ME_CONFIG_MONGODB_ADMINPASSWORD: root
  ME_CONFIG_MONGODB_URL: mongodb://root:root@mongodb:27017/
  ME_CONFIG_BASICAUTH_USERNAME: admin
  ME_CONFIG_BASICAUTH_PASSWORD: admin

depends_on:
  - mongodb
```

**Accès** :

- URL : `http://localhost:8081`
- Authentification HTTP Basic :
  - Username : `admin`
  - Password : `admin`

---

### 📦 Service `db-init` - Initialisation de la base

**Image** : `postgres:17-alpine`

**Rôle** : Service d'initialisation qui exécute les scripts SQL au premier démarrage.

**Configuration** :

```yaml
restart: "no" # Ne redémarre pas automatiquement

depends_on:
  db:
    condition: service_healthy # Attend que PostgreSQL soit prêt

volumes:
  - ./back/mysql_data:/scripts # Monte les scripts SQL

command: >
  sh -c "
    # Vérifie si les tables existent
    # Si non, exécute les scripts de migration
  "
```

**Scripts exécutés** (dans l'ordre) :

1. `migration-postgresql-v001.sql` - Structure de base
2. `data-test-menus-postgresql.sql` - Données de test menus
3. `data-test-avis-postgresql.sql` - Données de test avis
4. `migration-add-image-user-postgresql.sql` - Ajout colonne image
5. `migration-add-command-id-postgresql.sql` - Ajout colonne command_id
6. `export-postgresql-data.sql` - Export de données

**Caractéristiques** :

- S'exécute une seule fois (vérifie l'existence des tables)
- Ne redémarre pas automatiquement
- Attend que PostgreSQL soit prêt (healthcheck)

---

### 📦 Service `server` - Backend API

**Image** : `node-server` (build depuis `node.dockerfile`)

**Rôle** : Serveur API Express.js qui gère toute la logique métier.

**Configuration** :

```yaml
build:
  context: ./back
  dockerfile: node.dockerfile

ports:
  - "3000:3000" # API accessible sur http://localhost:3000

volumes:
  - ./back:/app # Montage du code source pour le développement
  - /app/node_modules # Volume anonyme pour node_modules

depends_on:
  - db-init # Attend l'initialisation de la base
  - db
  - mongodb

environment:
  # Base de données
  DATABASE_URL: postgresql://postgres:root@db:5432/vite_gourmand
  DB_TYPE: postgres
  MONGODB_URI: mongodb://root:root@mongodb:27017/vite_gourmand?authSource=admin

  # JWT
  JWT_SECRET: [clé secrète]

  # Email
  SMTP_HOST: smtp.gmail.com
  SMTP_PORT: 587
  SMTP_SECURE: false
  SMTP_USER: [email]
  SMTP_PASSWORD: [mot de passe]
  SMTP_FROM: [email]

  # Frontend
  FRONTEND_URL: http://localhost:5173

  # Supabase
  SUPABASE_URL: ${SUPABASE_URL}
  SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY}

command: sh -c "cd /app && npm run dev"
```

**Caractéristiques** :

- Build depuis `node.dockerfile`
- Hot reload en développement (nodemon)
- Montage du code source pour modifications en temps réel
- Dépend de toutes les bases de données

---

### 📦 Service `frontend` - Application React

**Image** : Build depuis `Dockerfile`

**Rôle** : Application React avec Vite pour l'interface utilisateur.

**Configuration** :

```yaml
build:
  context: ./frontend
  dockerfile: Dockerfile

ports:
  - "5173:5173" # Application accessible sur http://localhost:5173

volumes:
  - ./frontend:/app # Montage du code source pour le développement
  - /app/node_modules # Volume anonyme pour node_modules

environment:
  VITE_API_URL: http://localhost:3000/api

depends_on:
  - server # Attend que le serveur backend soit prêt
```

**Caractéristiques** :

- Build depuis `Dockerfile`
- Hot reload en développement (Vite)
- Montage du code source pour modifications en temps réel
- Dépend du serveur backend

---

**Rôle** : Dockerfile pour construire l'image du serveur backend Node.js/Express.

**Localisation** : `back/node.dockerfile`

**Explication ligne par ligne** :

```dockerfile
# Étape 1 : Image de base
FROM node:22-alpine
```

- **Utilité** : Définit l'image de base à utiliser
- **`node:22-alpine`** :
  - Node.js version 22
  - Alpine Linux : distribution Linux ultra-légère (~5MB)
  - Avantage : Image plus petite et plus rapide à télécharger
  - Alternative : `node:22` (Debian, plus lourd mais plus complet)

```dockerfile
# Étape 2 : Définition du répertoire de travail
WORKDIR /app
```

- **Utilité** : Crée le répertoire `/app` et le définit comme répertoire de travail
- **Avantage** : Toutes les commandes suivantes s'exécutent dans `/app`
- **Équivalent** : `mkdir /app && cd /app`

```dockerfile
# Étape 3 : Configuration du PATH
ENV PATH /node_modules/.bin:$PATH
```

- **Utilité** : Ajoute les binaires npm au PATH
- **Avantage** : Permet d'exécuter les commandes npm (comme `nodemon`) directement
- **Exemple** : `nodemon index.js` au lieu de `./node_modules/.bin/nodemon index.js`

```dockerfile
# Étape 4 : Copie des fichiers de dépendances
COPY ./package.json ./
COPY ./package-lock.json ./
```

- **Utilité** : Copie uniquement les fichiers de dépendances
- **Pourquoi d'abord ?** : Optimisation du cache Docker
  - Si `package.json` n'a pas changé, Docker réutilise le cache de `npm install`
  - Si on copiait tout le code d'abord, `npm install` serait réexécuté à chaque changement de code
- **`./package.json`** : Chemin source (relatif au contexte de build)
- **`./`** : Destination dans le conteneur (`/app/`)

```dockerfile
# Étape 5 : Installation des dépendances
RUN npm install
```

- **Utilité** : Installe toutes les dépendances listées dans `package.json`
- **Exécution** : S'exécute dans le conteneur pendant le build
- **Cache** : Si `package.json` n'a pas changé, cette étape utilise le cache
- **Résultat** : Crée le dossier `node_modules/` avec toutes les dépendances

```dockerfile
# Étape 6 : Exposition du port
EXPOSE 3000
```

- **Utilité** : Documente que le conteneur écoute sur le port 3000
- **Note** : N'ouvre pas réellement le port, c'est juste une documentation
- **Ouverture réelle** : Fait dans `docker-compose.yml` avec `ports: - "3000:3000"`

**Pourquoi pas de CMD ?**

- Le `CMD` est défini dans `docker-compose.yml` : `command: sh -c "cd /app && npm run dev"`
- Permet de changer la commande sans reconstruire l'image

**Processus de build** :

```bash
# Depuis la racine du projet
docker build -f back/node.dockerfile -t node-server ./back

# Étapes exécutées :
# 1. Télécharge node:22-alpine (si pas déjà en cache)
# 2. Crée /app et définit comme répertoire de travail
# 3. Configure le PATH
# 4. Copie package.json et package-lock.json
# 5. Exécute npm install (mise en cache si package.json inchangé)
# 6. Documente le port 3000
# 7. Crée l'image finale "node-server"
```

---

### 📄 `frontend/Dockerfile`

**Rôle** : Dockerfile pour construire l'image de l'application React avec Vite.

**Localisation** : `frontend/Dockerfile`

**Explication ligne par ligne** :

```dockerfile
# Étape 1 : Image de base
FROM node:22-alpine
```

- **Même principe** que le backend : Node.js 22 sur Alpine Linux
- **Léger** : Image optimisée pour les applications Node.js

```dockerfile
# Étape 2 : Définition du répertoire de travail
WORKDIR /app
```

- **Même principe** : Crée et définit `/app` comme répertoire de travail

```dockerfile
# Étape 3 : Copie des fichiers de dépendances
COPY package.json package-lock.json* ./
```

- **Utilité** : Copie les fichiers de dépendances
- **`package-lock.json*`** : Le `*` signifie "optionnel" (ne plante pas si le fichier n'existe pas)
- **Optimisation** : Même stratégie de cache que le backend

```dockerfile
# Étape 4 : Installation des dépendances
RUN npm install
```

- **Utilité** : Installe toutes les dépendances (React, Vite, etc.)
- **Cache** : Réutilisé si `package.json` n'a pas changé

```dockerfile
# Étape 5 : Copie du reste du code source
COPY . .
```

- **Utilité** : Copie tout le code source dans le conteneur
- **Pourquoi après npm install ?** :
  - Si le code change, on ne réinstalle pas les dépendances
  - Optimisation du cache Docker
- **`COPY . .`** : Copie tout depuis le contexte de build vers `/app`

```dockerfile
# Étape 6 : Exposition du port
EXPOSE 5173
```

- **Utilité** : Documente que Vite écoute sur le port 5173 (port par défaut de Vite)
- **Note** : L'ouverture réelle se fait dans `docker-compose.yml`

```dockerfile
# Étape 7 : Commande par défaut
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

- **Utilité** : Définit la commande à exécuter au démarrage du conteneur
- **`npm run dev`** : Démarre le serveur de développement Vite
- **`--host 0.0.0.0`** :
  - Par défaut, Vite écoute seulement sur `localhost` (127.0.0.1)
  - `0.0.0.0` permet l'accès depuis l'extérieur du conteneur
  - **Nécessaire** : Sinon, on ne peut pas accéder à l'app depuis l'hôte (localhost:5173)
- **Format tableau** : `["commande", "arg1", "arg2"]` est la forme recommandée

**Processus de build** :

```bash
# Depuis la racine du projet
docker build -f frontend/Dockerfile -t vite-frontend ./frontend

# Étapes exécutées :
# 1. Télécharge node:22-alpine (si pas déjà en cache)
# 2. Crée /app et définit comme répertoire de travail
# 3. Copie package.json et package-lock.json
# 4. Exécute npm install (mise en cache si package.json inchangé)
# 5. Copie tout le code source
# 6. Documente le port 5173
# 7. Définit la commande par défaut
# 8. Crée l'image finale "vite-frontend"
```

---

### Différences entre les deux Dockerfiles

| Aspect            | Backend (`node.dockerfile`)                | Frontend (`Dockerfile`)          |
| ----------------- | ------------------------------------------ | -------------------------------- |
| **CMD**           | ❌ Pas de CMD (défini dans docker-compose) | ✅ CMD défini dans le Dockerfile |
| **Copie du code** | ❌ Pas de copie (monté en volume)          | ✅ Code copié dans l'image       |
| **Stratégie**     | Image minimale, code monté                 | Image complète avec code         |
| **Utilisation**   | Développement avec hot reload              | Développement avec hot reload    |

**Pourquoi ces différences ?**

**Backend** :

- Le code est monté en volume dans `docker-compose.yml` : `./back:/app`
- Permet les modifications en temps réel sans reconstruire l'image
- Le CMD est dans docker-compose pour plus de flexibilité

**Frontend** :

- Le code est copié dans l'image ET monté en volume
- La copie permet de créer une image autonome
- Le volume permet le hot reload en développement
- Le CMD est dans le Dockerfile car il est stable

---

### Bonnes pratiques Dockerfile

#### 1. Ordre des instructions (optimisation du cache)

**❌ Mauvais ordre** :

```dockerfile
COPY . .              # Copie tout le code
RUN npm install       # npm install sera réexécuté à chaque changement de code
```

**✅ Bon ordre** :

```dockerfile
COPY package.json package-lock.json* ./
RUN npm install       # npm install mis en cache
COPY . .              # Seul le code est recopié si changé
```

#### 2. Utilisation d'images légères

**✅ Alpine Linux** :

```dockerfile
FROM node:22-alpine  # ~40MB
```

**❌ Images complètes** :

```dockerfile
FROM node:22         # ~900MB (trop lourd)
```

#### 3. Réduction du nombre de couches

**❌ Plusieurs RUN** :

```dockerfile
RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y curl
```

**✅ Un seul RUN** :

```dockerfile
RUN apt-get update && \
    apt-get install -y git curl && \
    apt-get clean
```

#### 4. Utilisation de .dockerignore

Créer un fichier `.dockerignore` pour exclure des fichiers :

```
node_modules
.git
.env
*.log
.DS_Store
```

**Avantage** : Réduit la taille du contexte de build et accélère le build

---

### Structure des couches Docker

Chaque instruction dans un Dockerfile crée une nouvelle couche :

```
Image node:22-alpine (couche 1)
  ↓
WORKDIR /app (couche 2)
  ↓
COPY package.json (couche 3)
  ↓
RUN npm install (couche 4) ← Mise en cache si package.json inchangé
  ↓
COPY . . (couche 5)
  ↓
EXPOSE 5173 (couche 6)
  ↓
CMD [...] (couche 7)
```

**Avantages des couches** :

- **Cache** : Les couches inchangées sont réutilisées
- **Partage** : Plusieurs images peuvent partager les mêmes couches
- **Efficacité** : Seules les couches modifiées sont reconstruites

---

### Dépannage des Dockerfiles

#### Problème : Build échoue

```bash
# Voir les logs détaillés
docker-compose build --progress=plain

# Reconstruire sans cache
docker-compose build --no-cache
```

#### Problème : Image trop volumineuse

```bash
# Voir la taille de l'image
docker images

# Analyser les couches
docker history node-server
```

#### Problème : Modifications non prises en compte

```bash
# Vérifier que les volumes sont montés
docker-compose ps
docker inspect <container_id> | grep Mounts

# Reconstruire l'image
docker-compose build --no-cache
docker-compose up
```

---

## Docker Compose : Orchestration

### 📄 `docker-compose.yml`

**Rôle** : Fichier principal d'orchestration Docker Compose qui coordonne tous les services.

**Localisation** : Racine du projet

**Utilité** :

- Définit tous les services de l'application
- Configure les volumes, ports, et variables d'environnement
- Gère les dépendances entre les services
- Orchestre le démarrage dans le bon ordre

**Commandes principales** :

```bash
docker-compose up          # Démarrer tous les services
docker-compose up -d       # Démarrer en arrière-plan
docker-compose down         # Arrêter tous les services
docker-compose logs         # Voir les logs
docker-compose ps           # Voir l'état des services
```

**Comment Docker Compose utilise les Dockerfiles** :

Quand vous exécutez `docker-compose up`, voici ce qui se passe :

1. **Lecture de docker-compose.yml**

   - Docker Compose lit la configuration

2. **Détection des services à builder**

   ```yaml
   server:
     build:
       context: ./back
       dockerfile: node.dockerfile
   ```

   - Détecte que `server` doit être construit depuis `back/node.dockerfile`

3. **Build de l'image backend**

   ```bash
   docker build -f back/node.dockerfile -t node-server ./back
   ```

   - Exécute toutes les instructions du Dockerfile backend
   - Crée l'image `node-server`

4. **Build de l'image frontend**

   ```yaml
   frontend:
     build:
       context: ./frontend
       dockerfile: Dockerfile
   ```

   ```bash
   docker build -f frontend/Dockerfile -t vite_gourmand-frontend ./frontend
   ```

   - Exécute toutes les instructions du Dockerfile frontend
   - Crée l'image frontend

5. **Création des conteneurs**
   - Utilise les images construites
   - Applique les volumes, ports, variables d'environnement
   - Démarre les services dans l'ordre des dépendances

**Commandes de build manuelles** :

```bash
# Reconstruire toutes les images
docker-compose build

# Reconstruire une image spécifique
docker-compose build server
docker-compose build frontend

# Reconstruire sans utiliser le cache
docker-compose build --no-cache

# Reconstruire et démarrer
docker-compose up --build
```

---

## Services Docker Compose

## Volumes et persistance

### Volumes nommés

Les volumes nommés permettent de persister les données entre les redémarrages :

```yaml
volumes:
  mongodb_data: # Données MongoDB
  postgres_data: # Données PostgreSQL
```

**Avantages** :

- Les données persistent même après `docker-compose down`
- Les données sont partagées entre les conteneurs si nécessaire
- Facilite les sauvegardes

**Suppression des volumes** :

```bash
docker-compose down -v  # Supprime les volumes (⚠️ perte de données)
```

### Volumes de montage

Pour le développement, les dossiers sont montés directement :

```yaml
volumes:
  - ./back:/app # Code source backend
  - ./frontend:/app # Code source frontend
  - /app/node_modules # Volume anonyme pour node_modules
```

**Avantages** :

- Modifications en temps réel (hot reload)
- Pas besoin de reconstruire l'image
- Développement plus rapide

**Note** : Les volumes anonymes pour `node_modules` évitent les conflits entre le conteneur et l'hôte.

---

## Réseau et ports

### Réseau Docker

Docker Compose crée automatiquement un réseau pour tous les services. Les services peuvent communiquer entre eux via leur nom de service :

- `db` : Accessible depuis les autres services
- `mongodb` : Accessible depuis les autres services
- `server` : Accessible depuis `frontend`
- `frontend` : Accessible depuis l'extérieur

### Ports exposés

| Service       | Port  | URL                     | Description                |
| ------------- | ----- | ----------------------- | -------------------------- |
| PostgreSQL    | 5432  | `localhost:5432`        | Base de données PostgreSQL |
| MongoDB       | 27017 | `localhost:27017`       | Base de données MongoDB    |
| Adminer       | 8080  | `http://localhost:8080` | Interface PostgreSQL       |
| Mongo Express | 8081  | `http://localhost:8081` | Interface MongoDB          |
| Backend API   | 3000  | `http://localhost:3000` | API REST                   |
| Frontend      | 5173  | `http://localhost:5173` | Application React          |

---

## Variables d'environnement

### Fichier `.env`

Créez un fichier `.env` à la racine du projet pour personnaliser la configuration :

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_DB=vite_gourmand

# Supabase (optionnel)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

### Variables dans docker-compose.yml

Les variables d'environnement peuvent être :

- **Définies directement** dans le fichier
- **Référencées depuis `.env`** avec `${VARIABLE_NAME}`
- **Utilisées avec des valeurs par défaut** : `${VARIABLE:-default}`

---

## Démarrage et utilisation

### Prérequis

1. **Docker** installé (version 20.10+)
2. **Docker Compose** installé (version 2.0+)
3. Fichier `.env` créé (optionnel)

### Commandes de base

#### Démarrer tous les services

```bash
docker-compose up
```

Démarrer en arrière-plan :

```bash
docker-compose up -d
```

#### Arrêter tous les services

```bash
docker-compose down
```

#### Voir les logs

```bash
docker-compose logs          # Tous les services
docker-compose logs server   # Seulement le serveur
docker-compose logs -f       # Suivre les logs en temps réel
```

#### Reconstruire les images

```bash
docker-compose build          # Reconstruire toutes les images
docker-compose build server   # Reconstruire seulement le serveur
docker-compose up --build     # Reconstruire et démarrer
```

#### Voir l'état des services

```bash
docker-compose ps
```

#### Accéder à un conteneur

```bash
docker-compose exec server sh      # Accéder au conteneur serveur
docker-compose exec frontend sh   # Accéder au conteneur frontend
docker-compose exec db psql -U postgres -d vite_gourmand  # Accéder à PostgreSQL
```

### Ordre de démarrage

Docker Compose gère automatiquement les dépendances :

1. **PostgreSQL** et **MongoDB** démarrent en premier
2. **db-init** attend que PostgreSQL soit prêt (healthcheck)
3. **Adminer** et **Mongo Express** démarrent
4. **server** attend que `db-init` soit terminé et que les bases soient prêtes
5. **frontend** attend que le serveur soit prêt

---

## Maintenance et dépannage

### Problèmes courants

#### Les services ne démarrent pas

1. Vérifier que les ports ne sont pas déjà utilisés :

```bash
lsof -i :3000  # Vérifier le port 3000
lsof -i :5173  # Vérifier le port 5173
```

2. Vérifier les logs :

```bash
docker-compose logs
```

3. Vérifier l'état des conteneurs :

```bash
docker-compose ps
```

#### La base de données n'est pas initialisée

1. Supprimer les volumes et redémarrer :

```bash
docker-compose down -v
docker-compose up
```

2. Vérifier les scripts SQL dans `back/mysql_data/`

#### Les modifications ne sont pas prises en compte

1. Vérifier que les volumes sont bien montés
2. Redémarrer le service concerné :

```bash
docker-compose restart server
docker-compose restart frontend
```

#### Erreurs de connexion à la base de données

1. Vérifier que PostgreSQL est prêt :

```bash
docker-compose exec db pg_isready -U postgres
```

2. Vérifier les variables d'environnement dans `docker-compose.yml`

### Commandes utiles

#### Nettoyer Docker

```bash
# Supprimer les conteneurs arrêtés
docker-compose down

# Supprimer les volumes (⚠️ perte de données)
docker-compose down -v

# Supprimer les images non utilisées
docker system prune -a
```

#### Sauvegarder les données

```bash
# Sauvegarder PostgreSQL
docker-compose exec db pg_dump -U postgres vite_gourmand > backup.sql

# Restaurer PostgreSQL
docker-compose exec -T db psql -U postgres vite_gourmand < backup.sql
```

#### Voir l'utilisation des ressources

```bash
docker stats
```

---

## Optimisations et bonnes pratiques

### Pour la production

1. **Utiliser des images spécifiques** (éviter `latest`)
2. **Limiter les ressources** (CPU, mémoire)
3. **Utiliser des secrets** pour les mots de passe
4. **Activer les healthchecks** pour tous les services
5. **Configurer les logs** (rotation, taille max)

### Pour le développement

1. **Utiliser des volumes de montage** pour le hot reload
2. **Garder les services en mode développement**
3. **Utiliser des données de test** en développement
4. **Documenter les variables d'environnement**

---

## Conclusion

Le système de conteneurisation de Vite Gourmand offre un environnement de développement et de production reproductible et facile à gérer. Docker Compose orchestre tous les services nécessaires, de la base de données à l'application frontend, en passant par l'API backend.

Cette architecture facilite :

- Le développement en équipe
- Le déploiement
- La maintenance
- La scalabilité
