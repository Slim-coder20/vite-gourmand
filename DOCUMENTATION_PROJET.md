# Documentation Complète du Projet Vite Gourmand

## Table des matières

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture générale](#architecture-générale)
3. [Backend (API REST)](#backend-api-rest)
4. [Frontend (React)](#frontend-react)
5. [Communication Frontend-Backend](#communication-frontend-backend)
6. [Système de routage (React Router)](#système-de-routage-react-router)
7. [Gestion de l'authentification](#gestion-de-lauthentification)
8. [Base de données](#base-de-données)
9. [Fonctionnalités principales](#fonctionnalités-principales)

---

## Vue d'ensemble du projet

**Vite Gourmand** est une application web full-stack permettant aux utilisateurs de commander des menus gastronomiques en ligne. Le projet est développé avec une architecture séparée entre le frontend (React) et le backend (Node.js/Express).

### Technologies utilisées

**Backend :**

- Node.js avec Express.js
- MySQL (base de données relationnelle)
- MongoDB (pour les données de contact et horaires)
- JWT (JSON Web Tokens) pour l'authentification
- Nodemailer pour l'envoi d'emails
- Bcrypt pour le hachage des mots de passe

**Frontend :**

- React 19.2.0
- React Router DOM 7.10.0 (routage)
- Vite (build tool)
- CSS Modules (styling modulaire)

**Infrastructure :**

- Docker & Docker Compose (containerisation)
- Git (gestion de version)

---

## Les requêtes Cross-Origin (CORS)

### Qu'est-ce qu'une requête Cross-Origin ?

Une **requête cross-origin** (ou CORS - Cross-Origin Resource Sharing) est une requête HTTP effectuée depuis un **domaine différent** de celui du serveur.

**Exemple dans votre projet :**

- **Frontend** : `http://localhost:5173` (Vite dev server)
- **Backend** : `http://localhost:3000` (Express server)

Ce sont **deux origines différentes** (ports différents = origines différentes), donc toutes les requêtes du frontend vers le backend sont des requêtes cross-origin.

### Pourquoi CORS est nécessaire ?

Par défaut, les navigateurs appliquent la **Same-Origin Policy** (politique de même origine) qui **bloque** les requêtes cross-origin pour des raisons de sécurité.

**Sans CORS :**

```
Frontend (localhost:5173) → Backend (localhost:3000)
❌ Erreur : "Access to fetch at 'http://localhost:3000/api/menus'
   from origin 'http://localhost:5173' has been blocked by CORS policy"
```

**Avec CORS configuré :**

```
Frontend (localhost:5173) → Backend (localhost:3000)
✅ Requête autorisée et réussie
```

### Configuration CORS dans votre projet

**Fichier : `back/index.js`**

```javascript
const cors = require("cors");

// Middleware CORS pour autoriser les requêtes cross-origin
app.use(cors());
```

Cette configuration simple autorise **toutes les origines** à faire des requêtes vers votre API.

### Comment fonctionne CORS ?

#### 1. **Requête simple (Simple Request)**

Pour les requêtes GET/POST simples, le navigateur envoie directement la requête :

```
Frontend → Backend
GET /api/menus
Headers: {
  Origin: http://localhost:5173
}
```

Le serveur répond avec des headers CORS :

```
Backend → Frontend
Status: 200 OK
Headers: {
  Access-Control-Allow-Origin: http://localhost:5173
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Content-Type, Authorization
}
```

#### 2. **Requête préliminaire (Preflight Request)**

Pour les requêtes complexes (PUT, DELETE, avec headers personnalisés), le navigateur envoie d'abord une requête **OPTIONS** :

```
Frontend → Backend
OPTIONS /api/commandes
Headers: {
  Origin: http://localhost:5173
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: Authorization, Content-Type
}
```

Le serveur répond avec les permissions :

```
Backend → Frontend
Status: 200 OK
Headers: {
  Access-Control-Allow-Origin: http://localhost:5173
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Authorization, Content-Type
}
```

Ensuite, le navigateur envoie la vraie requête :

```
Frontend → Backend
POST /api/commandes
Headers: {
  Origin: http://localhost:5173
  Authorization: Bearer <token>
  Content-Type: application/json
}
```

### Configuration CORS avancée (optionnelle)

Pour plus de sécurité en production, vous pouvez configurer CORS de manière plus restrictive :

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // Autoriser uniquement le frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // Headers autorisés
    credentials: true, // Autoriser les cookies/credentials
  })
);
```

### Exemple concret dans votre projet

**Requête authentifiée avec CORS :**

```javascript
// Frontend : commandService.js
const token = getToken();

fetch("http://localhost:3000/api/commandes", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`, // Header personnalisé
  },
});
```

**Ce qui se passe :**

1. **Preflight (OPTIONS)** :

   ```
   OPTIONS http://localhost:3000/api/commandes
   Origin: http://localhost:5173
   Access-Control-Request-Method: GET
   Access-Control-Request-Headers: Authorization
   ```

2. **Réponse du serveur** :

   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: Authorization, Content-Type
   ```

3. **Vraie requête (GET)** :

   ```
   GET http://localhost:3000/api/commandes
   Origin: http://localhost:5173
   Authorization: Bearer <token>
   ```

4. **Réponse avec données** :
   ```
   Status: 200 OK
   Access-Control-Allow-Origin: *
   Body: { commandes: [...] }
   ```

### En résumé

- **CORS** permet aux navigateurs d'autoriser les requêtes entre différentes origines
- Dans votre projet, le frontend (port 5173) et le backend (port 3000) sont des origines différentes
- Le middleware `cors()` dans Express autorise ces requêtes
- C'est essentiel pour que votre application React puisse communiquer avec votre API Express

---

## Architecture générale

### Structure du projet

```
vite_gourmand/
├── back/                    # Backend (API REST)
│   ├── config/              # Configuration
│   │   ├── database.js      # Configuration MySQL
│   │   └── email.js         # Configuration email (Nodemailer)
│   ├── middleware/          # Middlewares Express
│   │   └── auth.js          # Middleware d'authentification JWT
│   ├── models/              # Modèles Mongoose (MongoDB)
│   │   ├── Contact.js
│   │   └── Horaire.js
│   ├── routes/              # Routes API
│   │   └── api/
│   │       ├── auth.js      # Authentification
│   │       ├── menus.js     # Menus
│   │       ├── commandes.js # Commandes
│   │       ├── avis.js      # Avis clients
│   │       ├── contact.js   # Formulaire de contact
│   │       ├── horaires.js  # Horaires d'ouverture
│   │       └── roles.js     # Gestion des rôles
│   ├── mysql_data/          # Migrations SQL
│   └── index.js             # Point d'entrée du serveur
│
└── frontend/                # Frontend (React)
    ├── src/
    │   ├── components/      # Composants réutilisables
    │   │   ├── header/
    │   │   ├── footer/
    │   │   ├── hero/
    │   │   ├── menuList/
    │   │   ├── cardMenu/
    │   │   ├── avis/
    │   │   ├── commande/    # Composants de commande
    │   │   │   ├── step1/
    │   │   │   ├── step2/
    │   │   │   └── step3/
    │   │   └── ...
    │   ├── pages/           # Pages de l'application
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── MenuDetailPage.jsx
    │   │   ├── CommandPage.jsx
    │   │   └── ...
    │   ├── services/        # Services API
    │   │   ├── authService.js
    │   │   ├── menusService.js
    │   │   ├── commandService.js
    │   │   └── ...
    │   ├── context/         # Contextes React
    │   │   └── AuthContext.jsx
    │   ├── styles/          # Styles CSS Modules
    │   ├── App.jsx          # Composant racine + routage
    │   └── main.jsx         # Point d'entrée React
    └── public/              # Assets statiques
```

### Flux de communication

```
┌─────────────┐                    ┌─────────────┐
│   Client    │                    │   Backend   │
│  (Browser)  │                    │  (Express)  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │  1. Requête HTTP (GET/POST)      │
       │─────────────────────────────────>│
       │                                  │
       │                                  │  2. Requête SQL
       │                                  │─────────────────┐
       │                                  │                 │
       │                                  │  3. Réponse     │
       │                                  │<────────────────┘
       │                                  │
       │  4. Réponse JSON                │
       │<─────────────────────────────────│
       │                                  │
```

---

## Backend (API REST)

### Point d'entrée : `back/index.js`

Le serveur Express est configuré dans `back/index.js` :

```javascript
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Middlewares
app.use(express.json()); // Parse JSON
app.use(cors()); // Autorise les requêtes cross-origin

// Connexions aux bases de données
// - MySQL (via pool de connexions)
// - MongoDB (via Mongoose)

// Routes API
app.use("/api/auth", authRouter);
app.use("/api/menus", menusRouter);
app.use("/api/commandes", commandesRouter);
app.use("/api/avis", avisRouter);
app.use("/api/contact", contactRouter);
app.use("/api/horaires", horairesRouter);
app.use("/api/roles", rolesRouter);
```

### Routes API disponibles

#### 1. **Authentification** (`/api/auth`)

| Méthode | Route              | Description                         | Authentification |
| ------- | ------------------ | ----------------------------------- | ---------------- |
| POST    | `/register`        | Inscription d'un nouvel utilisateur | ❌ Non           |
| POST    | `/login`           | Connexion (retourne un JWT)         | ❌ Non           |
| POST    | `/logout`          | Déconnexion                         | ✅ Oui           |
| POST    | `/forgot-password` | Demande de réinitialisation         | ❌ Non           |
| POST    | `/reset-password`  | Réinitialisation du mot de passe    | ❌ Non           |

**Exemple de réponse `/login` :**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean@example.com",
    "role_id": 2
  }
}
```

#### 2. **Menus** (`/api/menus`)

| Méthode | Route  | Description                         | Authentification |
| ------- | ------ | ----------------------------------- | ---------------- |
| GET     | `/`    | Liste tous les menus (avec filtres) | ❌ Non           |
| GET     | `/:id` | Détails d'un menu spécifique        | ❌ Non           |

**Filtres disponibles pour GET `/` :**

- `prix_max` : Prix maximum
- `prix_min` : Prix minimum
- `theme_id` : ID du thème
- `regime_id` : ID du régime alimentaire
- `min_personnes` : Nombre minimum de personnes

#### 3. **Commandes** (`/api/commandes`)

| Méthode | Route  | Description                          | Authentification |
| ------- | ------ | ------------------------------------ | ---------------- |
| GET     | `/`    | Liste les commandes de l'utilisateur | ✅ Oui           |
| GET     | `/:id` | Détails d'une commande               | ✅ Oui           |
| POST    | `/`    | Créer une nouvelle commande          | ✅ Oui           |
| PUT     | `/:id` | Modifier une commande                | ✅ Oui           |
| DELETE  | `/:id` | Supprimer une commande               | ✅ Oui           |

**Exemple de body pour POST `/` :**

```json
{
  "date_prestation": "2026-01-15",
  "heure_livraison": "14:30",
  "adresse_prestation": "123 Rue Example, Bordeaux",
  "menu_id": 1,
  "nombre_personne": 5,
  "pret_materiel": true,
  "restitution_materiel": false
}
```

#### 4. **Avis** (`/api/avis`)

| Méthode | Route     | Description                 | Authentification |
| ------- | --------- | --------------------------- | ---------------- |
| GET     | `/public` | Liste des avis publics      | ❌ Non           |
| GET     | `/`       | Liste tous les avis (admin) | ✅ Oui           |
| GET     | `/:id`    | Détails d'un avis           | ✅ Oui           |
| POST    | `/`       | Créer un avis               | ✅ Oui           |
| DELETE  | `/:id`    | Supprimer un avis           | ✅ Oui           |

#### 5. **Contact** (`/api/contact`)

| Méthode | Route | Description                   | Authentification |
| ------- | ----- | ----------------------------- | ---------------- |
| GET     | `/`   | Liste les messages de contact | ❌ Non           |
| POST    | `/`   | Envoyer un message de contact | ❌ Non           |

#### 6. **Horaires** (`/api/horaires`)

| Méthode | Route  | Description             | Authentification |
| ------- | ------ | ----------------------- | ---------------- |
| GET     | `/`    | Liste tous les horaires | ❌ Non           |
| GET     | `/:id` | Détails d'un horaire    | ❌ Non           |
| POST    | `/`    | Créer un horaire        | ❌ Non           |
| PUT     | `/:id` | Modifier un horaire     | ❌ Non           |

#### 7. **Rôles** (`/api/roles`)

| Méthode | Route  | Description          | Authentification |
| ------- | ------ | -------------------- | ---------------- |
| GET     | `/`    | Liste tous les rôles | ✅ Oui           |
| GET     | `/:id` | Détails d'un rôle    | ✅ Oui           |
| POST    | `/`    | Créer un rôle        | ✅ Oui           |
| PUT     | `/:id` | Modifier un rôle     | ✅ Oui           |
| DELETE  | `/:id` | Supprimer un rôle    | ✅ Oui           |

### Middleware d'authentification

**Fichier : `back/middleware/auth.js`**

Le middleware `authenticateToken` vérifie la validité du token JWT :

```javascript
const authenticateToken = async (req, res, next) => {
  // 1. Récupérer le header Authorization
  const authHeader = req.headers["authorization"];

  // 2. Extraire le token (format: "Bearer <token>")
  const token = authHeader.split(" ")[1];

  // 3. Vérifier le token avec JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4. Vérifier que l'utilisateur existe en base
  const [userRows] = await pool.query("SELECT * FROM user WHERE user_id = ?", [
    decoded.userId,
  ]);

  // 5. Ajouter les infos utilisateur à req.user
  req.user = {
    userId: userRows[0].user_id,
    roleId: userRows[0].role_id,
    email: userRows[0].email,
  };

  next(); // Passer au handler suivant
};
```

**Utilisation dans les routes :**

```javascript
const authenticateToken = require("../../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  // req.user est maintenant disponible
  const userId = req.user.userId;
  // ...
});
```

### Configuration de la base de données

**Fichier : `back/config/database.js`**

Pool de connexions MySQL avec réutilisation des connexions :

```javascript
const pool = mysql2
  .createPool({
    host: process.env.DB_HOST || "localhost",
    database: "vite_gourmand",
    user: "root",
    password: "root",
    charset: "utf8mb4",
  })
  .promise(); // Conversion en promesses pour async/await
```

### Service d'email

**Fichier : `back/config/email.js`**

Configuration centralisée de Nodemailer avec deux fonctions principales :

1. **`sendPasswordResetEmail`** : Envoie un email de réinitialisation de mot de passe
2. **`sendOrderConfirmationEmail`** : Envoie un email de confirmation de commande

---

## Frontend (React)

### Point d'entrée : `frontend/src/main.jsx`

```javascript
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

Le `BrowserRouter` permet d'utiliser React Router dans toute l'application.

### Structure des composants

#### Composants de layout (présents sur toutes les pages)

1. **Header** (`components/header/Header.jsx`)

   - Navigation principale
   - Liens vers les pages
   - Affichage du statut de connexion
   - Bouton de déconnexion

2. **Footer** (`components/footer/Footer.jsx`)
   - Informations de contact
   - Liens utiles
   - Horaires d'ouverture

#### Composants de la page d'accueil

1. **PromoBanner** (`components/promoBanner/PromoBanner.jsx`)

   - Bannière promotionnelle

2. **Hero** (`components/hero/Hero.jsx`)

   - Section hero avec image et texte d'accroche

3. **HowItWorks** (`components/howItWorks/HowItWorks.jsx`)

   - Explication du fonctionnement en 3 étapes
   - Utilise `StepIllustrations.jsx` pour les illustrations

4. **MenuList** (`components/menuList/menuList.jsx`)

   - Liste de tous les menus disponibles
   - Utilise `CardMenu` pour chaque menu
   - Filtres de recherche (prix, thème, régime)

5. **CardMenu** (`components/cardMenu/cardMenu.jsx`)

   - Carte affichant un menu
   - Image, titre, description, prix
   - Bouton "Voir le menu" → redirige vers `/menu/:id`

6. **Avis** (`components/avis/Avis.jsx`)
   - Affichage des avis clients
   - Récupère les avis via `avisService.js`

#### Composants de commande (multi-étapes)

1. **Step1Informations** (`components/commande/step1/Step1Informations.jsx`)

   - Collecte des informations client (auto-remplies depuis le compte)
   - Adresse de prestation
   - Date et heure de livraison
   - Validation des champs requis

2. **Step2Menu** (`components/commande/step2/Step2Menu.jsx`)

   - Sélection du menu
   - Si l'utilisateur vient depuis `/menu/:id`, le menu est pré-sélectionné
   - Affichage de la liste des menus disponibles
   - Possibilité de changer de menu

3. **Step3Recap** (`components/commande/step3/Step3Recap.jsx`)
   - Saisie du nombre de personnes (minimum requis par le menu)
   - Calcul automatique des prix :
     - Prix du menu (avec réduction de 10% si ≥ 5 personnes de plus que le minimum)
     - Prix de livraison (5€ + 0.59€/km si hors Bordeaux)
   - Récapitulatif complet avant validation

### Pages de l'application

#### 1. **HomePage** (`pages/HomePage.jsx`)

Page d'accueil composée de :

- Header
- PromoBanner
- Hero
- HowItWorks
- MenuList
- Avis
- Footer

#### 2. **LoginPage** (`pages/LoginPage.jsx`)

- Formulaire de connexion
- Utilise `authService.login()`
- Redirection après connexion réussie
- Lien vers "Mot de passe oublié"

#### 3. **RegisterPage** (`pages/RegisterPage.jsx`)

- Formulaire d'inscription
- Validation des champs
- Utilise `authService.register()`
- Redirection vers login après inscription

#### 4. **ForgetPassword** (`pages/ForgetPassord.jsx`)

- Formulaire pour demander une réinitialisation
- Envoie un email avec un lien de réinitialisation
- Utilise `authService.forgotPassword()`

#### 5. **ResetPassword** (`pages/ResetPassword.jsx`)

- Page accessible via un lien dans l'email
- Route : `/reset-password/:token`
- Formulaire pour définir un nouveau mot de passe
- Utilise `authService.resetPassword()`

#### 6. **MenuDetailPage** (`pages/MenuDetailPage.jsx`)

- Affiche les détails d'un menu spécifique
- Route : `/menu/:id`
- Récupère les données via `menusService.getMenuById()`
- Bouton "Commander" → redirige vers `/commande/:menu_id`

#### 7. **CommandPage** (`pages/CommandPage.jsx`)

**Page principale de commande (multi-étapes)**

**Fonctionnalités :**

- Gestion de 3 étapes (Step1, Step2, Step3)
- Navigation entre les étapes (`nextStep`, `prevStep`)
- Validation à chaque étape
- Calcul automatique des prix
- Soumission finale via `commandService.createCommand()`

**États gérés :**

```javascript
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  adresse_prestation: "",
  date_prestation: "",
  heure_livraison: "",
  menu_id: null,
  menu: null,
  nombre_personne: null,
  prix_menu: 0,
  prix_livraison: 0,
  prix_total: 0,
  reduction_appliquee: false,
});
```

**Logique de calcul des prix :**

- Prix menu = `prix_par_personne × nombre_personne`
- Réduction de 10% si `nombre_personne ≥ nombre_personne_minimum + 5`
- Prix livraison = 5€ + (0.59€ × distance en km) si hors Bordeaux

#### 8. **Contact** (`pages/Contact.jsx`)

- Formulaire de contact
- Envoie un message via `contactService.sendMessage()`

#### 9. **Team** (`pages/Team.jsx`)

- Page présentant l'équipe
- Affichage des membres de l'équipe

### Services API (couche de communication)

Les services sont des fonctions qui encapsulent les appels API vers le backend.

#### 1. **authService.js**

Fonctions :

- `register(userData)` : Inscription
- `login(userData)` : Connexion
- `logout()` : Déconnexion
- `forgotPassword(email)` : Demande de réinitialisation
- `resetPassword(token, newPassword)` : Réinitialisation
- `getToken()` : Récupère le token du localStorage
- `setToken(token)` : Stocke le token
- `removeToken()` : Supprime le token

**Exemple d'utilisation :**

```javascript
import * as authService from "../services/authService.js";

const handleLogin = async (email, password) => {
  try {
    const response = await authService.login({ email, password });
    // response contient { token, user }
    authService.setToken(response.token);
  } catch (error) {
    console.error(error.message);
  }
};
```

#### 2. **menusService.js**

Fonctions :

- `getPublicMenus()` : Liste tous les menus (GET `/api/menus`)
- `getMenuById(id)` : Détails d'un menu (GET `/api/menus/:id`)

#### 3. **commandService.js**

Fonctions :

- `getUserCommands()` : Liste les commandes de l'utilisateur (GET `/api/commandes`) - **Authentifié**
- `getCommandById(id)` : Détails d'une commande (GET `/api/commandes/:id`) - **Authentifié**
- `createCommand(commandData)` : Créer une commande (POST `/api/commandes`) - **Authentifié**

**Exemple d'utilisation :**

```javascript
import { createCommand } from "../services/commandService.js";

const handleSubmit = async () => {
  const commandData = {
    date_prestation: formData.date_prestation,
    heure_livraison: formData.heure_livraison,
    adresse_prestation: formData.adresse_prestation,
    menu_id: formData.menu_id,
    nombre_personne: formData.nombre_personne,
    // ...
  };

  try {
    const result = await createCommand(commandData);
    // Redirection vers une page de confirmation
  } catch (error) {
    console.error(error.message);
  }
};
```

#### 4. **avisService.js**

Fonctions pour gérer les avis clients.

#### 5. **contactService.js**

Fonctions pour envoyer des messages de contact.

### Contexte d'authentification

**Fichier : `context/AuthContext.jsx`**

Le `AuthContext` centralise la gestion de l'état d'authentification dans toute l'application.

**Provider : `AuthProvider`**

Enveloppe l'application dans `App.jsx` :

```javascript
<AuthProvider>
  <Routes>{/* Routes */}</Routes>
</AuthProvider>
```

**États exposés :**

- `user` : Objet utilisateur (null si non connecté)
- `isAuthenticated` : Boolean
- `isLoading` : Boolean (pendant les requêtes)
- `error` : Message d'erreur

**Fonctions exposées :**

- `register(userData)` : Inscription
- `login(email, password)` : Connexion
- `logout()` : Déconnexion
- `checkAuth()` : Vérifie le token au chargement

**Hook personnalisé : `useAuth()`**

Permet d'accéder au contexte depuis n'importe quel composant :

```javascript
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated) {
    return <div>Bonjour {user.prenom} !</div>;
  }

  return <button onClick={() => login(email, password)}>Se connecter</button>;
}
```

---

## Communication Frontend-Backend

### Flux de données typique

#### Exemple : Connexion d'un utilisateur

```
1. Utilisateur remplit le formulaire de login
   ↓
2. Frontend : LoginPage.jsx appelle authService.login()
   ↓
3. authService.js fait un fetch() vers POST /api/auth/login
   ↓
4. Backend : Route /api/auth/login (auth.js)
   - Vérifie les credentials en base MySQL
   - Génère un JWT avec jwt.sign()
   - Retourne { token, user }
   ↓
5. Frontend reçoit la réponse
   - Stocke le token dans localStorage (authService.setToken())
   - Met à jour AuthContext (setUser(), setIsAuthenticated(true))
   ↓
6. L'utilisateur est maintenant authentifié
```

#### Exemple : Création d'une commande

```
1. Utilisateur complète le formulaire de commande (3 étapes)
   ↓
2. Frontend : CommandPage.jsx appelle commandService.createCommand()
   ↓
3. commandService.js :
   - Récupère le token depuis localStorage (getToken())
   - Fait un fetch() vers POST /api/commandes
   - Headers : { Authorization: "Bearer <token>" }
   - Body : JSON.stringify(commandData)
   ↓
4. Backend : Route POST /api/commandes (commandes.js)
   - Middleware authenticateToken vérifie le JWT
   - Extrait req.user.userId
   - Calcule les prix (menu, livraison, réduction)
   - Insère la commande en base MySQL
   - Envoie un email de confirmation (sendOrderConfirmationEmail)
   - Retourne { message, commande }
   ↓
5. Frontend reçoit la réponse
   - Affiche un message de succès
   - Redirige vers une page de confirmation
```

### Format des requêtes

#### Requête GET (sans authentification)

```javascript
fetch("http://localhost:3000/api/menus", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});
```

#### Requête POST (sans authentification)

```javascript
fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});
```

#### Requête GET (avec authentification)

```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:3000/api/commandes", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

#### Requête POST (avec authentification)

```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:3000/api/commandes", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    date_prestation: "2026-01-15",
    menu_id: 1,
    nombre_personne: 5,
    // ...
  }),
});
```

### Gestion des erreurs

**Backend :**

```javascript
try {
  // Logique métier
  res.status(200).json({ data });
} catch (error) {
  res.status(500).json({
    message: "Erreur lors de l'opération",
    error: error.message,
  });
}
```

**Frontend :**

```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la requête");
  }

  return data;
} catch (error) {
  throw new Error(error.message || "Erreur réseau");
}
```

---

## Système de routage (React Router)

### Configuration dans `App.jsx`

```javascript
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
        <Route path="/menu/:id" element={<MenuDetailPage />} />
        <Route path="/commande/:menu_id?" element={<CommandPage />} />
      </Routes>
    </AuthProvider>
  );
}
```

### Routes disponibles

| Route                    | Composant        | Description                          |
| ------------------------ | ---------------- | ------------------------------------ |
| `/`                      | `HomePage`       | Page d'accueil                       |
| `/login`                 | `LoginPage`      | Connexion                            |
| `/register`              | `RegisterPage`   | Inscription                          |
| `/forgot-password`       | `ForgetPassword` | Mot de passe oublié                  |
| `/reset-password/:token` | `ResetPassword`  | Réinitialisation (avec token)        |
| `/contact`               | `Contact`        | Formulaire de contact                |
| `/team`                  | `Team`           | Page équipe                          |
| `/menu/:id`              | `MenuDetailPage` | Détails d'un menu                    |
| `/commande/:menu_id?`    | `CommandPage`    | Page de commande (menu_id optionnel) |

### Paramètres de route

#### Route avec paramètre obligatoire : `/menu/:id`

```javascript
// Dans MenuDetailPage.jsx
import { useParams } from "react-router-dom";

function MenuDetailPage() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  // Exemple : /menu/5 → id = "5"

  useEffect(() => {
    getMenuById(id).then(setMenu);
  }, [id]);
}
```

#### Route avec paramètre optionnel : `/commande/:menu_id?`

Le `?` rend le paramètre optionnel.

```javascript
// Dans CommandPage.jsx
import { useParams } from "react-router-dom";

function CommandPage() {
  const { menu_id: menuIdFromUrl } = useParams();
  // Si URL = /commande → menuIdFromUrl = undefined
  // Si URL = /commande/5 → menuIdFromUrl = "5"

  useEffect(() => {
    if (menuIdFromUrl) {
      // Charger le menu pré-sélectionné
      getMenuById(menuIdFromUrl).then(setMenu);
    }
  }, [menuIdFromUrl]);
}
```

### Navigation programmatique

Utilisation du hook `useNavigate` :

```javascript
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      navigate("/"); // Redirection vers la page d'accueil
    } catch (error) {
      console.error(error);
    }
  };
}
```

**Exemples de navigation :**

```javascript
navigate("/"); // Page d'accueil
navigate("/menu/5"); // Détails du menu 5
navigate("/commande/5"); // Commande avec menu 5 pré-sélectionné
navigate(-1); // Retour en arrière
navigate("/login", { replace: true }); // Remplace l'historique
```

### Navigation avec liens

Utilisation du composant `Link` :

```javascript
import { Link } from "react-router-dom";

function CardMenu({ menu }) {
  return (
    <div>
      <h3>{menu.titre}</h3>
      <Link to={`/menu/${menu.menu_id}`}>Voir le menu</Link>
    </div>
  );
}
```

### Protection de routes

Actuellement, la protection se fait au niveau des composants :

```javascript
function CommandPage() {
  const { isAuthenticated, navigate } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  // ...
}
```

---

## Gestion de l'authentification

### Flux complet d'authentification

#### 1. Inscription

```
1. Utilisateur remplit RegisterPage
   ↓
2. Appel authService.register(userData)
   ↓
3. POST /api/auth/register
   - Vérifie que l'email n'existe pas
   - Hash le mot de passe avec bcrypt
   - Insère l'utilisateur en base
   - Génère un JWT
   ↓
4. Frontend reçoit { token, user }
   - Stocke le token (localStorage)
   - Met à jour AuthContext
   ↓
5. Utilisateur connecté automatiquement
```

#### 2. Connexion

```
1. Utilisateur remplit LoginPage
   ↓
2. Appel authService.login({ email, password })
   ↓
3. POST /api/auth/login
   - Vérifie l'email en base
   - Compare le mot de passe avec bcrypt.compare()
   - Génère un JWT
   ↓
4. Frontend reçoit { token, user }
   - Stocke le token (localStorage)
   - Met à jour AuthContext
   ↓
5. Redirection vers la page d'accueil
```

#### 3. Vérification au chargement

```javascript
// Dans AuthContext.jsx
useEffect(() => {
  const token = authService.getToken();
  if (token) {
    setIsAuthenticated(true);
    // Optionnel : vérifier la validité du token avec une requête API
  }
}, []);
```

#### 4. Déconnexion

```javascript
// Dans AuthContext.jsx
const logout = async () => {
  await authService.logout(); // POST /api/auth/logout
  authService.removeToken(); // Supprime le token du localStorage
  setUser(null);
  setIsAuthenticated(false);
};
```

### Stockage du token

Le token JWT est stocké dans le `localStorage` du navigateur :

```javascript
// authService.js
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};
```

### Utilisation du token dans les requêtes

Toutes les requêtes authentifiées incluent le header `Authorization` :

```javascript
const token = getToken();

fetch(`${API_URL}/commandes`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## Base de données

### MySQL (données principales)

**Tables principales :**

1. **`user`** : Utilisateurs

   - `user_id`, `nom`, `prenom`, `email`, `password` (hashé), `telephone`, `adresse_postals`, `ville`, `pays`, `role_id`

2. **`menu`** : Menus disponibles

   - `menu_id`, `titre`, `description`, `prix_par_personne`, `nombre_personne_minimum`, `theme_id`, `regime_id`, `image_url`

3. **`commande`** : Commandes

   - `commande_id`, `numero_commande`, `date_commande`, `date_prestation`, `heure_livraison`, `prix_menu`, `prix_livraison`, `adresse_prestation`, `nombre_personne`, `statut`, `user_id`

4. **`commande_menu`** : Relation commande-menu (many-to-many)

   - `commande_id`, `menu_id`

5. **`avis`** : Avis clients

   - `avis_id`, `nom`, `prenom`, `note`, `commentaire`, `image_url`, `user_id`

6. **`role`** : Rôles utilisateurs
   - `role_id`, `nom_role`

### MongoDB (données complémentaires)

**Collections :**

1. **`contacts`** : Messages de contact
2. **`horaires`** : Horaires d'ouverture

### Migrations SQL

Les migrations sont dans `back/mysql_data/` :

- `migration-v001.sql` : Schéma initial
- `migration-add-adresse-prestation.sql` : Ajout de la colonne `adresse_prestation`
- `migration-password-reset.sql` : Ajout de la table de réinitialisation
- `migration-avis-*.sql` : Modifications de la table avis

---

## Fonctionnalités principales

### 1. Gestion des utilisateurs

- ✅ Inscription avec validation
- ✅ Connexion avec JWT
- ✅ Déconnexion
- ✅ Réinitialisation de mot de passe par email
- ✅ Gestion des rôles (client, admin)

### 2. Catalogue de menus

- ✅ Affichage de tous les menus
- ✅ Filtres (prix, thème, régime, nombre de personnes)
- ✅ Page de détail pour chaque menu
- ✅ Images des menus

### 3. Système de commande

- ✅ Formulaire multi-étapes (3 étapes)
- ✅ Pré-remplissage des informations client
- ✅ Sélection de menu (pré-sélection si venant de `/menu/:id`)
- ✅ Calcul automatique des prix :
  - Prix du menu (avec réduction de 10% si ≥ 5 personnes de plus que le minimum)
  - Prix de livraison (5€ + 0.59€/km si hors Bordeaux)
- ✅ Validation du nombre minimum de personnes
- ✅ Récapitulatif avant validation
- ✅ Email de confirmation automatique

### 4. Avis clients

- ✅ Affichage des avis publics
- ✅ Création d'avis (authentifié)
- ✅ Gestion des avis (admin)

### 5. Contact

- ✅ Formulaire de contact
- ✅ Stockage en MongoDB

### 6. Horaires

- ✅ Affichage des horaires d'ouverture
- ✅ Stockage en MongoDB

---

## Conclusion

Cette documentation présente l'architecture complète du projet **Vite Gourmand**, une application full-stack permettant la commande de menus gastronomiques en ligne.

**Points clés :**

- Architecture séparée frontend/backend
- API REST avec Express.js
- Authentification JWT
- Routage avec React Router DOM
- Gestion d'état avec Context API
- Communication via services API
- Base de données hybride (MySQL + MongoDB)

Le projet suit les bonnes pratiques de développement web moderne avec une séparation claire des responsabilités et une architecture scalable.
