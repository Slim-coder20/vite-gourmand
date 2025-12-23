# Documentation de l'Architecture du Backend - Vite Gourmand

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure des dossiers](#structure-des-dossiers)
3. [Fichiers principaux](#fichiers-principaux)
4. [Détails par dossier](#détails-par-dossier)
5. [Flux de données](#flux-de-données)
6. [Technologies utilisées](#technologies-utilisées)

---

## Vue d'ensemble

Le backend de **Vite Gourmand** est une API REST construite avec **Express.js** qui gère :
- L'authentification et l'autorisation des utilisateurs
- La gestion des commandes, menus, plats et avis
- La communication avec plusieurs bases de données (MySQL/PostgreSQL, MongoDB)
- L'envoi d'emails transactionnels
- Le stockage d'images via Supabase Storage

---

## Structure des dossiers

```
back/
├── config/              # Configuration et connexions
├── doc/                 # Documentation technique
├── middleware/          # Middlewares Express
├── models/              # Modèles Mongoose (MongoDB)
├── mysql_data/          # Scripts SQL et migrations
├── routes/              # Routes API organisées par domaine
│   └── api/            # Endpoints API REST
├── index.js            # Point d'entrée de l'application
├── create-admin-hash.js # Script utilitaire
├── node.dockerfile      # Configuration Docker
├── package.json         # Dépendances du projet
└── package-lock.json    # Verrouillage des versions
```

---

## Fichiers principaux

### `index.js`
**Point d'entrée de l'application**

Ce fichier initialise :
- Le serveur Express
- Les connexions aux bases de données (MySQL/PostgreSQL et MongoDB)
- Les middlewares globaux (CORS, JSON parser, UTF-8)
- Le montage de toutes les routes API
- Le démarrage du serveur sur le port 3000

**Routes principales montées :**
- `/api/horaires` - Gestion des horaires
- `/api/contact` - Formulaire de contact
- `/api/roles` - Gestion des rôles
- `/api/auth` - Authentification
- `/api/commandes` - Gestion des commandes
- `/api/menus` - Gestion des menus
- `/api/avis` - Gestion des avis clients
- `/api/dashboard/user` - Dashboard utilisateur
- `/api/employe` - Gestion des employés
- `/api/plats` - Gestion des plats
- `/api/admin` - Administration
- `/api/user` - Gestion des utilisateurs

---

## Détails par dossier

### 📁 `config/`
**Configuration centralisée de l'application**

#### `database.js`
- **Rôle** : Configuration du pool de connexions à la base de données
- **Fonctionnalités** :
  - Détection automatique du type de base (MySQL ou PostgreSQL) via `DB_TYPE`
  - Configuration du pool MySQL avec support SSL pour les services cloud
  - Import conditionnel de `database-postgres.js` pour PostgreSQL
  - Gestion des erreurs de connexion
  - Configuration UTF-8 pour toutes les connexions

#### `database-postgres.js`
- **Rôle** : Configuration spécifique pour PostgreSQL (Supabase)
- **Fonctionnalités** :
  - Pool de connexions PostgreSQL
  - Utilisation de `DATABASE_URL` pour la connexion
  - Gestion des requêtes avec support des transactions

#### `email.js`
- **Rôle** : Configuration et fonctions d'envoi d'emails
- **Fonctionnalités** :
  - Configuration du transporteur Nodemailer (SMTP)
  - Templates HTML pour différents types d'emails :
    - `sendPasswordResetEmail` : Réinitialisation de mot de passe
    - `sendOrderConfirmationEmail` : Confirmation de commande
    - `sendAvisConfirmationEmail` : Invitation à donner un avis
    - `sendMaterialReturnEmail` : Notification de retour de matériel
    - `sendEmployeeAccountCreatedEmail` : Création de compte employé

#### `supabase-storage.js`
- **Rôle** : Gestion du stockage d'images via Supabase Storage
- **Fonctionnalités** :
  - Upload d'avatars utilisateurs dans le bucket `user-avatars`
  - Suppression automatique des anciennes images lors d'un nouvel upload
  - Génération d'URLs publiques pour les images
  - Gestion des erreurs si Supabase n'est pas configuré

---

### 📁 `middleware/`
**Middlewares Express pour la sécurité et l'autorisation**

#### `auth.js`
- **Rôle** : Authentification JWT
- **Fonctionnalités** :
  - Vérification du token JWT dans le header `Authorization`
  - Validation du token avec `JWT_SECRET`
  - Vérification de l'existence de l'utilisateur en base
  - Ajout des informations utilisateur à `req.user` (userId, roleId, email)
  - Retourne 401 si le token est invalide ou expiré

#### `checkRole.js`
- **Rôle** : Vérification du rôle employé
- **Fonctionnalités** :
  - Vérifie que l'utilisateur est authentifié
  - Récupère le rôle depuis la base de données
  - Autorise uniquement les rôles "employe" et "admin"
  - Retourne 403 si l'accès est refusé
  - Ajoute le rôle à `req.user.role`

#### `checkAdminRole.js`
- **Rôle** : Vérification du rôle administrateur
- **Fonctionnalités** :
  - Vérifie que l'utilisateur est authentifié
  - Autorise uniquement le rôle "admin"
  - Retourne 403 si l'utilisateur n'est pas administrateur

---

### 📁 `models/`
**Modèles Mongoose pour MongoDB**

#### `Contact.js`
- **Rôle** : Modèle pour les messages de contact
- **Utilisation** : Stockage des messages envoyés via le formulaire de contact

#### `Horaire.js`
- **Rôle** : Modèle pour les horaires d'ouverture
- **Utilisation** : Gestion des horaires de l'établissement

#### `StatistiqueCommande.js`
- **Rôle** : Modèle pour les statistiques de commandes
- **Utilisation** : Stockage des statistiques et métriques de commandes

---

### 📁 `routes/api/`
**Routes API organisées par domaine fonctionnel**

#### `auth.js`
- **Rôle** : Authentification et gestion des sessions
- **Endpoints typiques** :
  - `POST /api/auth/login` - Connexion
  - `POST /api/auth/register` - Inscription
  - `POST /api/auth/forgot-password` - Demande de réinitialisation
  - `POST /api/auth/reset-password` - Réinitialisation du mot de passe

#### `admin.js`
- **Rôle** : Administration de l'application
- **Protection** : Middleware `checkAdminRole`
- **Endpoints typiques** :
  - Gestion des utilisateurs
  - Gestion des commandes
  - Statistiques globales
  - Configuration de l'application

#### `commandes.js`
- **Rôle** : Gestion des commandes
- **Protection** : Middleware `authenticateToken` et `checkRole` selon les endpoints
- **Endpoints typiques** :
  - `GET /api/commandes` - Liste des commandes
  - `POST /api/commandes` - Création d'une commande
  - `PUT /api/commandes/:id` - Mise à jour d'une commande
  - `GET /api/commandes/:id` - Détails d'une commande

#### `menus.js`
- **Rôle** : Gestion des menus
- **Endpoints typiques** :
  - `GET /api/menus` - Liste des menus
  - `POST /api/menus` - Création d'un menu (admin)
  - `PUT /api/menus/:id` - Mise à jour d'un menu (admin)
  - `DELETE /api/menus/:id` - Suppression d'un menu (admin)

#### `plats.js`
- **Rôle** : Gestion des plats
- **Endpoints typiques** :
  - `GET /api/plats` - Liste des plats
  - `GET /api/plats/:id` - Détails d'un plat
  - `POST /api/plats` - Création d'un plat (admin)
  - `PUT /api/plats/:id` - Mise à jour d'un plat (admin)

#### `avis.js`
- **Rôle** : Gestion des avis clients
- **Endpoints typiques** :
  - `GET /api/avis` - Liste des avis
  - `POST /api/avis` - Création d'un avis (utilisateur authentifié)
  - `PUT /api/avis/:id` - Mise à jour d'un avis
  - `DELETE /api/avis/:id` - Suppression d'un avis (admin)

#### `user.js`
- **Rôle** : Gestion des utilisateurs
- **Protection** : Middleware `authenticateToken`
- **Endpoints typiques** :
  - `GET /api/user/profile` - Profil de l'utilisateur connecté
  - `PUT /api/user/profile` - Mise à jour du profil
  - `PUT /api/user/password` - Changement de mot de passe
  - `POST /api/user/avatar` - Upload d'avatar

#### `employe.js`
- **Rôle** : Gestion des employés
- **Protection** : Middleware `checkRole` (employé ou admin)
- **Endpoints typiques** :
  - Gestion des commandes assignées
  - Mise à jour du statut des commandes
  - Consultation des horaires

#### `dashboardUser.js`
- **Rôle** : Dashboard utilisateur
- **Protection** : Middleware `authenticateToken`
- **Endpoints typiques** :
  - `GET /api/dashboard/user` - Statistiques utilisateur
  - Historique des commandes
  - Avis laissés

#### `horaires.js`
- **Rôle** : Gestion des horaires d'ouverture
- **Base de données** : MongoDB (via Mongoose)
- **Endpoints typiques** :
  - `GET /api/horaires` - Récupération des horaires
  - `PUT /api/horaires` - Mise à jour des horaires (admin)

#### `contact.js`
- **Rôle** : Gestion du formulaire de contact
- **Base de données** : MongoDB (via Mongoose)
- **Endpoints typiques** :
  - `POST /api/contact` - Envoi d'un message de contact

#### `roles.js`
- **Rôle** : Gestion des rôles
- **Endpoints typiques** :
  - `GET /api/roles` - Liste des rôles
  - `POST /api/roles` - Création d'un rôle (admin)

---

### 📁 `mysql_data/`
**Scripts SQL et migrations**

Ce dossier contient :
- **Scripts de migration** : Fichiers SQL pour migrer la structure de la base de données
  - `migration-v001.sql` - Migration MySQL initiale
  - `migration-postgresql-v001.sql` - Migration PostgreSQL
  - `migration-add-*.sql` - Ajouts de colonnes/tables
- **Scripts de données de test** :
  - `data-test-menus.sql` - Données de test pour les menus (MySQL)
  - `data-test-menus-postgresql.sql` - Données de test pour les menus (PostgreSQL)
  - `data-test-avis.sql` - Données de test pour les avis
- **Scripts de correction** :
  - `fix-commande-sequence.sql` - Correction des séquences PostgreSQL
  - `fix-postgresql-sequences.sql` - Correction des séquences
- **Scripts d'export** :
  - `export-postgresql-data.sql` - Export de données PostgreSQL

---

### 📁 `doc/`
**Documentation technique**

Ce dossier contient la documentation technique du backend :
- `auth.md` - Documentation sur l'authentification
- `jointures-sql.md` - Documentation sur les jointures SQL
- `pool-sql.md` - Documentation sur le pool de connexions SQL
- `test-postman-commandes.md` - Documentation pour tester les commandes avec Postman

---

### 📄 Fichiers à la racine

#### `create-admin-hash.js`
- **Rôle** : Script utilitaire pour créer un hash de mot de passe administrateur
- **Utilisation** : Permet de générer un hash bcrypt pour un mot de passe admin

#### `node.dockerfile`
- **Rôle** : Configuration Docker pour containeriser l'application
- **Utilisation** : Définit l'environnement d'exécution Node.js pour le déploiement

#### `package.json`
- **Rôle** : Définition des dépendances et scripts du projet
- **Scripts disponibles** :
  - `npm run dev` - Démarrage en mode développement avec nodemon
  - `npm test` - Tests (non implémenté actuellement)

---

## Flux de données

### Architecture des bases de données

Le backend utilise **plusieurs bases de données** :

1. **MySQL/PostgreSQL** (via `mysql2` ou `pg`)
   - Utilisateurs et authentification
   - Commandes
   - Menus et plats
   - Avis
   - Rôles
   - Statistiques principales

2. **MongoDB** (via `mongoose`)
   - Messages de contact
   - Horaires d'ouverture
   - Statistiques de commandes (documents)

3. **Supabase Storage**
   - Images de profil utilisateurs
   - Photos de plats (potentiellement)

### Flux d'authentification

```
1. Client → POST /api/auth/login
2. Backend vérifie les identifiants
3. Backend génère un JWT
4. Client stocke le token
5. Client envoie le token dans Authorization header
6. Middleware auth.js vérifie le token
7. Middleware checkRole.js vérifie les permissions
8. Route handler exécute la logique métier
```

### Flux de création de commande

```
1. Client authentifié → POST /api/commandes
2. Middleware auth.js vérifie l'authentification
3. Route handler crée la commande en base
4. Email de confirmation envoyé via email.js
5. Réponse JSON avec les détails de la commande
```

---

## Technologies utilisées

### Frameworks et bibliothèques principales

- **Express.js** (^5.1.0) - Framework web
- **jsonwebtoken** (^9.0.2) - Authentification JWT
- **bcrypt** (^6.0.0) - Hachage des mots de passe
- **mysql2** (^3.15.3) - Client MySQL
- **pg** (^8.11.3) - Client PostgreSQL
- **mongoose** (^8.19.4) - ODM MongoDB
- **@supabase/supabase-js** (^2.87.1) - Client Supabase
- **nodemailer** (^6.9.15) - Envoi d'emails
- **multer** (^2.0.2) - Gestion des uploads de fichiers
- **cors** (^2.8.5) - Gestion CORS
- **dotenv** (^17.2.3) - Variables d'environnement
- **nodemon** (^3.1.11) - Redémarrage automatique en développement

### Patterns utilisés

- **MVC (Model-View-Controller)** : Séparation des routes, modèles et logique métier
- **Middleware Pattern** : Authentification et autorisation via middlewares
- **Pool Pattern** : Réutilisation des connexions base de données
- **Repository Pattern** : Accès aux données centralisé via les routes

---

## Notes importantes

### Variables d'environnement requises

Le backend nécessite les variables suivantes dans un fichier `.env` :

```env
# Base de données
DB_TYPE=mysql|postgres|postgresql
DB_HOST=localhost
DB_NAME=vite_gourmand
DB_USER=root
DB_PASSWORD=root
DB_PORT=3306
DATABASE_URL=postgresql://... (pour PostgreSQL)

# MongoDB
MONGODB_URI=mongodb://root:root@localhost:27017/vite_gourmand?authSource=admin

# JWT
JWT_SECRET=votre_secret_jwt

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre_email@gmail.com
SMTP_PASSWORD=votre_mot_de_passe
SMTP_FROM=noreply@vitegourmand.com

# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Sécurité

- Les mots de passe sont hashés avec bcrypt
- Les tokens JWT sont utilisés pour l'authentification
- Les middlewares vérifient les rôles avant d'autoriser l'accès
- Les requêtes SQL utilisent des requêtes préparées (protection contre les injections SQL)
- CORS est configuré pour limiter les origines autorisées

### Performance

- Pool de connexions pour MySQL/PostgreSQL
- Connexions MongoDB réutilisées
- Upload d'images optimisé avec suppression des anciennes images

---

## Conclusion

Cette architecture permet une séparation claire des responsabilités, une maintenabilité accrue et une scalabilité pour l'application Vite Gourmand. Chaque dossier a un rôle précis et les dépendances sont bien organisées.

