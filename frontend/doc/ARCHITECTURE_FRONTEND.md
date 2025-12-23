# Documentation de l'Architecture du Frontend - Vite Gourmand

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure des dossiers](#structure-des-dossiers)
3. [Technologies utilisées](#technologies-utilisées)
4. [Architecture de l'application](#architecture-de-lapplication)
5. [Détails par dossier](#détails-par-dossier)
6. [Système de routage](#système-de-routage)
7. [Gestion de l'authentification](#gestion-de-lauthentification)
8. [Services API](#services-api)
9. [Configuration](#configuration)

---

## Vue d'ensemble

Le frontend de **Vite Gourmand** est une application **React** construite avec **Vite** qui offre :

- Une interface utilisateur moderne et responsive
- Un système d'authentification complet avec gestion des rôles
- Des espaces dédiés pour les clients, employés et administrateurs
- Une gestion complète des commandes, menus, plats et avis
- Des graphiques et statistiques pour les administrateurs

---

## Structure des dossiers

```
frontend/
├── doc/                    # Documentation
│   └── CHARTE_GRAPHIQUE.md
├── public/                 # Fichiers statiques
│   └── images/            # Images de l'application
│       ├── avis/          # Photos des avis clients
│       ├── menus/         # Images des menus
│       └── team/          # Photos de l'équipe
├── src/                    # Code source de l'application
│   ├── components/         # Composants réutilisables
│   │   ├── avis/          # Composants liés aux avis
│   │   ├── cardMenu/      # Carte de menu
│   │   ├── commande/      # Étapes de commande
│   │   ├── dashboard/     # Composants dashboard
│   │   ├── footer/        # Pied de page
│   │   ├── header/        # En-têtes (client, employé, admin)
│   │   ├── hero/          # Section hero
│   │   ├── howItWorks/    # Section "Comment ça marche"
│   │   ├── menuList/      # Liste des menus
│   │   ├── promoBanner/   # Bannière promotionnelle
│   │   └── ProtectedRoute.jsx
│   ├── context/           # Contextes React
│   │   └── AuthContext.jsx
│   ├── pages/            # Pages de l'application
│   │   ├── admin/        # Pages administrateur
│   │   ├── employer/     # Pages employé
│   │   └── [autres pages]
│   ├── services/         # Services API
│   ├── styles/           # Styles CSS Modules
│   │   ├── admin/        # Styles admin
│   │   ├── auth/         # Styles authentification
│   │   ├── command/      # Styles commande
│   │   ├── contact/      # Styles contact
│   │   ├── dashboard/    # Styles dashboard
│   │   ├── employe/      # Styles employé
│   │   ├── menuDetail/   # Styles détail menu
│   │   └── team/         # Styles équipe
│   ├── App.jsx           # Composant racine et routage
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── Dockerfile            # Configuration Docker
├── eslint.config.js      # Configuration ESLint
├── index.html            # Template HTML
├── jsconfig.json         # Configuration JavaScript
├── package.json          # Dépendances
├── vite.config.js        # Configuration Vite
└── package-lock.json     # Verrouillage des versions
```

---

## Technologies utilisées

### Frameworks et bibliothèques principales

- **React** (^19.2.0) - Bibliothèque UI
- **React DOM** (^19.2.0) - Rendu React
- **React Router DOM** (^7.10.0) - Routage côté client
- **Vite** (^7.2.4) - Build tool et serveur de développement
- **Recharts** (^3.5.1) - Bibliothèque de graphiques

### Outils de développement

- **ESLint** (^9.39.1) - Linter JavaScript
- **@vitejs/plugin-react-swc** (^4.2.2) - Plugin React avec SWC (compilateur rapide)
- **TypeScript types** - Types pour React (devDependencies)

### Patterns utilisés

- **Context API** - Gestion de l'état global (authentification)
- **CSS Modules** - Styles scoped par composant
- **Service Layer** - Séparation de la logique API
- **Protected Routes** - Routes protégées par authentification et rôles
- **Component Composition** - Composants réutilisables

---

## Architecture de l'application

### Point d'entrée : `main.jsx`

Le fichier `main.jsx` est le **point d'entrée** de l'application React. C'est le premier fichier JavaScript exécuté lorsque l'application se charge dans le navigateur.

#### Rôle et utilité

**1. Initialisation de React avec `createRoot`**

```javascript
createRoot(document.getElementById("root"));
```

- **Utilité** : Crée la racine React qui va gérer le rendu de l'application dans le DOM
- **Avantage** : Utilise la nouvelle API React 18+ qui permet le rendu concurrent et les améliorations de performance
- **Cible** : L'élément HTML avec l'id `"root"` défini dans `index.html`

**2. Configuration du `BrowserRouter`**

```javascript
<BrowserRouter>
  <App />
</BrowserRouter>
```

- **Utilité** : `BrowserRouter` est un composant de React Router qui permet le **routage côté client** (Single Page Application - SPA)
- **Fonctionnement** :
  - Intercepte les changements d'URL dans le navigateur
  - Permet de naviguer entre les pages sans recharger complètement la page
  - Utilise l'API History du navigateur pour gérer les URLs
  - Exemple : Quand l'utilisateur clique sur un lien vers `/dashboard`, React Router change l'URL et affiche le composant correspondant **sans recharger la page**
- **Avantages** :
  - Navigation fluide et rapide
  - Meilleure expérience utilisateur
  - Conservation de l'état de l'application entre les navigations
  - Support du bouton "Précédent/Suivant" du navigateur

**3. Mode strict (`StrictMode`)**

```javascript
<StrictMode>...</StrictMode>
```

- **Utilité** : Mode de développement qui détecte les problèmes potentiels
- **Fonctionnalités** :
  - Identifie les composants avec des effets de bord dangereux
  - Avertit sur l'utilisation de APIs dépréciées
  - Détecte les problèmes de rendu
- **Note** : N'affecte que le mode développement, pas la production

**4. Import des styles globaux**

```javascript
import "./index.css";
```

- **Utilité** : Charge les styles CSS globaux appliqués à toute l'application
- **Contenu typique** : Reset CSS, variables CSS, styles de base (polices, couleurs, etc.)

#### Flux d'exécution

```
1. Le navigateur charge index.html
2. index.html charge main.jsx (via Vite)
3. main.jsx s'exécute :
   - Crée la racine React
   - Enveloppe App dans BrowserRouter
   - Enveloppe dans StrictMode
   - Rend l'application dans le DOM
4. App.jsx prend le relais et gère le routage
```

### Composant racine : `App.jsx`

Le composant `App.jsx` est le **composant racine** de l'application. Il orchestre toute la logique de routage et de protection des routes.

#### Structure hiérarchique

```
App.jsx
  └── AuthProvider (contexte d'authentification)
      └── Routes (définition des routes)
          ├── Route publique (/)
          ├── Route publique (/login)
          ├── Route protégée (/dashboard)
          │   └── ProtectedRoute
          │       └── DashboardPage
          └── Route protégée admin (/admin/dashboard)
              └── ProtectedRoute (requiredRoleId={2})
                  └── AdminHomePage
```

**1. AuthProvider**

- **Utilité** : Fournit le contexte d'authentification à **tous** les composants enfants
- **Portée** : Toute l'application peut accéder à `useAuth()` pour connaître l'état de connexion
- **Avantage** : Évite de passer les props d'authentification à chaque composant (prop drilling)

**2. Routes**

- **Utilité** : Définit toutes les routes de l'application et les composants à afficher
- **Fonctionnement** : React Router compare l'URL actuelle avec les routes définies et affiche le composant correspondant

**3. ProtectedRoute**

- **Utilité** : Composant wrapper qui protège les routes nécessitant une authentification
- **Fonctionnement** : Vérifie l'authentification avant d'afficher le contenu

---

## Détails par dossier

### 📁 `src/components/`

**Composants réutilisables organisés par fonctionnalité**

#### `avis/`

- **Avis.jsx** : Affichage des avis clients
- **Avis.module.css** : Styles du composant avis

#### `cardMenu/`

- **cardMenu.jsx** : Carte affichant un menu avec image, titre, description
- **cardMenu.module.css** : Styles de la carte menu

#### `commande/`

Composants pour le processus de commande en plusieurs étapes :

- **step1/Step1Informations.jsx** : Saisie des informations de commande
- **step2/Step2Menu.jsx** : Sélection du menu et nombre de personnes
- **step3/Step3Recap.jsx** : Récapitulatif et validation de la commande

#### `dashboard/`

- **CreateAvisForm.jsx** : Formulaire de création d'avis
- **EditCommandForm.jsx** : Formulaire d'édition de commande

#### `footer/`

- **Footer.jsx** : Pied de page avec liens et informations
- **Footer.module.css** : Styles du footer

#### `header/`

En-têtes différents selon le rôle de l'utilisateur :

- **Header.jsx** : En-tête pour les clients
- **EmployeeHeader.jsx** : En-tête pour les employés
- **AdminHeader.jsx** : En-tête pour les administrateurs

#### `hero/`

- **Hero.jsx** : Section hero de la page d'accueil
- **Hero.module.css** : Styles de la section hero

#### `howItWorks/`

- **HowItWorks.jsx** : Section expliquant le fonctionnement
- **StepIllustrations.jsx** : Illustrations des étapes

#### `menuList/`

- **menuList.jsx** : Liste des menus disponibles
- **menuList.module.css** : Styles de la liste

#### `promoBanner/`

- **PromoBanner.jsx** : Bannière promotionnelle
- **PromoBanner.module.css** : Styles de la bannière

#### `ProtectedRoute.jsx`

**Composant de protection des routes**

- Vérifie l'authentification de l'utilisateur
- Vérifie les rôles requis (`requiredRoleId`)
- Redirige vers `/login` si non authentifié
- Redirige vers `/` si le rôle n'est pas autorisé
- Affiche un message de chargement pendant la vérification

---

### 📁 `src/context/`

**Contextes React pour la gestion d'état global**

#### `AuthContext.jsx`

**Contexte d'authentification**

**États gérés :**

- `user` : Informations de l'utilisateur connecté
- `isAuthenticated` : Statut d'authentification
- `isLoading` : État de chargement
- `error` : Erreurs éventuelles

**Fonctions exposées :**

- `register(userData)` : Inscription d'un nouvel utilisateur
- `login(email, password)` : Connexion
- `logout()` : Déconnexion
- `checkAuth()` : Vérification de l'authentification au chargement

**Hook personnalisé :**

- `useAuth()` : Hook pour accéder au contexte d'authentification

---

### 📁 `src/pages/`

**Pages de l'application organisées par rôle**

#### Pages publiques

- **HomePage.jsx** : Page d'accueil
- **LoginPage.jsx** : Page de connexion
- **RegisterPage.jsx** : Page d'inscription
- **ForgetPassword.jsx** : Page de demande de réinitialisation
- **ResetPassword.jsx** : Page de réinitialisation du mot de passe
- **Contact.jsx** : Page de contact
- **Team.jsx** : Page de présentation de l'équipe
- **MenuDetailPage.jsx** : Détails d'un menu
- **CommandPage.jsx** : Page de commande (processus en étapes)

#### Pages client (protégées)

- **DashboardPage.jsx** : Tableau de bord client
  - Historique des commandes
  - Création d'avis
  - Gestion du profil

#### Pages employé (protégées - role_id 2 ou 3)

- **EmployeeHomePage.jsx** : Accueil employé
- **EmployeCommandesPage.jsx** : Gestion des commandes
- **EmployeAvisPage.jsx** : Gestion des avis
- **EmployeMenusPage.jsx** : Gestion des menus
- **EmployePlatsPage.jsx** : Gestion des plats
- **EmployeHorairesPage.jsx** : Gestion des horaires

#### Pages administrateur (protégées - role_id 2)

- **AdminHomePage.jsx** : Accueil administrateur
- **AdminStatistiquesPage.jsx** : Statistiques avec graphiques (Recharts)
- **AdminEmployesPage.jsx** : Gestion des employés

---

### 📁 `src/services/`

**Services pour communiquer avec l'API backend**

#### `authService.js`

**Service d'authentification**

**Fonctions utilitaires :**

- `getToken()` : Récupère le token depuis localStorage
- `setToken(token)` : Stocke le token dans localStorage
- `removeToken()` : Supprime le token
- `authenticatedFetch(url, options)` : Fonction utilitaire pour requêtes authentifiées

**Fonctions API :**

- `register(userData)` : Inscription
- `login(userData)` : Connexion
- `logout()` : Déconnexion
- `forgotPassword(email)` : Demande de réinitialisation
- `resetPassword(token, newPassword)` : Réinitialisation du mot de passe

#### `menusService.js`

**Service pour les menus**

- Récupération de la liste des menus
- Détails d'un menu
- Création, modification, suppression (admin)

#### `commandService.js`

**Service pour les commandes**

- Création d'une commande
- Récupération des commandes de l'utilisateur
- Mise à jour du statut (employé/admin)

#### `avisService.js`

**Service pour les avis**

- Création d'un avis
- Récupération des avis
- Modification, suppression (admin)

#### `adminService.js`

**Service pour l'administration**

- Statistiques globales
- Gestion des utilisateurs
- Gestion des employés

#### `employeService.js`

**Service pour les employés**

- Gestion des commandes assignées
- Mise à jour des statuts

#### `dashboardUserService.js`

**Service pour le dashboard utilisateur**

- Statistiques personnelles
- Historique des commandes

#### `contactService.js`

**Service pour le contact**

- Envoi de messages de contact

#### `horairesService.js`

**Service pour les horaires**

- Récupération des horaires
- Mise à jour des horaires (employé/admin)

#### `uploadUserAvatar.js`

**Service pour l'upload d'avatar**

- Upload d'image de profil utilisateur vers Supabase Storage

---

### 📁 `src/styles/`

**Styles CSS Modules organisés par page/composant**

Chaque page/composant a son fichier CSS Module correspondant :

- Styles scoped pour éviter les conflits
- Organisation par domaine fonctionnel
- Réutilisabilité des styles communs

---

### 📁 `public/`

**Fichiers statiques**

- **images/** : Images de l'application
  - `avis/` : Photos des clients pour les avis
  - `menus/` : Images des menus
  - `team/` : Photos de l'équipe
  - `hero*.jpg` : Images de la section hero

---

## Système de routage

### Routes publiques

```javascript
/                    → HomePage
/login               → LoginPage
/register            → RegisterPage
/forgot-password     → ForgetPassword
/reset-password/:token → ResetPassword
/contact             → Contact
/team                → Team
/menu/:id            → MenuDetailPage
/commande/:menu_id?  → CommandPage
```

### Routes protégées (authentification requise)

```javascript
/dashboard           → DashboardPage (tous les utilisateurs authentifiés)
```

### Routes protégées (employé ou admin - role_id 2 ou 3)

```javascript
/employee/dashboard  → EmployeeHomePage
/employee/commandes  → EmployeCommandesPage
/employee/avis       → EmployeAvisPage
/employee/menus      → EmployeMenusPage
/employee/plats      → EmployePlatsPage
/employee/horaires   → EmployeHorairesPage
```

### Routes protégées (admin uniquement - role_id 2)

```javascript
/admin/dashboard     → AdminHomePage
/admin/statistiques  → AdminStatistiquesPage
/admin/employes      → AdminEmployesPage
```

### Protection des routes

Le composant `ProtectedRoute` :

1. Vérifie si l'utilisateur est authentifié
2. Vérifie si le rôle requis correspond au rôle de l'utilisateur
3. Redirige automatiquement si les conditions ne sont pas remplies
4. Affiche un message de chargement pendant la vérification

---

## Gestion de l'authentification

### Flux d'authentification

1. **Inscription/Connexion**

   - L'utilisateur saisit ses identifiants
   - Le service API envoie la requête au backend
   - Le backend retourne un token JWT
   - Le token est stocké dans `localStorage`
   - Le contexte `AuthContext` met à jour l'état

2. **Vérification au chargement**

   - Au chargement de l'application, `checkAuth()` est appelé
   - Vérifie la présence d'un token dans `localStorage`
   - Met à jour l'état d'authentification

3. **Requêtes authentifiées**

   - Les services utilisent `authenticatedFetch()`
   - Le token est automatiquement ajouté dans le header `Authorization`
   - Format : `Bearer <token>`

4. **Déconnexion**
   - Suppression du token du `localStorage`
   - Réinitialisation de l'état utilisateur
   - Redirection vers la page de connexion

### Gestion des rôles

Les rôles sont gérés via `role_id` :

- **role_id 1** : Client
- **role_id 2** : Administrateur
- **role_id 3** : Employé

Le composant `ProtectedRoute` accepte :

- `requiredRoleId={null}` : Authentification seule requise
- `requiredRoleId={2}` : Admin uniquement
- `requiredRoleId={[2, 3]}` : Admin ou Employé

---

## Communication Frontend ↔ Backend : Détails techniques

### Configuration de l'URL de l'API

Tous les services utilisent la variable d'environnement `VITE_API_URL` :

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
```

**Pourquoi cette configuration ?**

- **Développement** : `http://localhost:3000/api` (par défaut)
- **Production** : Variable d'environnement définie lors du build
- **Flexibilité** : Permet de changer l'URL sans modifier le code

### Format des requêtes HTTP

#### Requête GET (lecture de données)

```javascript
// Frontend (menusService.js)
const response = await fetch(`${API_URL}/menus`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

// Backend (routes/api/menus.js)
router.get("/", async (req, res) => {
  const [menus] = await pool.query("SELECT * FROM menu");
  res.json(menus);
});
```

#### Requête POST avec authentification (création)

```javascript
// Frontend (commandService.js)
const token = getToken(); // Récupère depuis localStorage
const response = await fetch(`${API_URL}/commandes`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // Token JWT
  },
  body: JSON.stringify({
    menu_id: 1,
    nombre_personne: 4,
    date_prestation: "2024-12-25",
  }),
});

// Backend (routes/api/commandes.js)
router.post("/", authenticateToken, async (req, res) => {
  // req.user est défini par le middleware authenticateToken
  const userId = req.user.userId; // Extrait du token JWT

  const [result] = await pool.query(
    "INSERT INTO commande (user_id, menu_id, ...) VALUES (?, ?, ...)",
    [userId, req.body.menu_id, ...]
  );

  res.status(201).json({ commande_id: result.insertId, ... });
});
```

### Gestion des erreurs

#### Côté Frontend

```javascript
try {
  const data = await commandService.createCommand(formData);
  // Succès : afficher confirmation
} catch (error) {
  // Erreur : afficher message à l'utilisateur
  if (error.message.includes("401") || error.message.includes("Token")) {
    // Token expiré → rediriger vers login
    navigate("/login");
  } else {
    // Autre erreur → afficher message
    setError(error.message);
  }
}
```

#### Côté Backend

```javascript
// Middleware d'authentification
if (!token) {
  return res.status(401).json({ message: "Token manquant" });
}

// Vérification du token
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = { userId: decoded.userId, roleId: decoded.roleId };
} catch (error) {
  return res.status(401).json({ message: "Token invalide ou expiré" });
}
```

### Exemple complet : Création d'une commande

**1. Frontend - Composant CommandPage.jsx**

```javascript
import { createCommand } from "../services/commandService";

const handleSubmit = async (formData) => {
  try {
    // Le service gère toute la communication
    const commande = await createCommand({
      menu_id: formData.menuId,
      nombre_personne: formData.nombrePersonne,
      date_prestation: formData.date,
      adresse_prestation: formData.adresse,
    });

    // Succès : afficher la confirmation
    setSuccessMessage(`Commande ${commande.numero_commande} créée !`);
  } catch (error) {
    // Erreur : afficher le message
    setErrorMessage(error.message);
  }
};
```

**2. Frontend - Service commandService.js**

```javascript
export const createCommand = async (commandData) => {
  const token = getToken(); // 1. Récupère le token

  const response = await fetch(`${API_URL}/commandes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 2. Ajoute le token
    },
    body: JSON.stringify(commandData), // 3. Envoie les données
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message); // 4. Gère les erreurs
  }

  return await response.json(); // 5. Retourne les données
};
```

**3. Backend - Route /api/commandes**

```javascript
// routes/api/commandes.js
router.post("/", authenticateToken, async (req, res) => {
  try {
    // req.user est défini par authenticateToken
    const userId = req.user.userId;

    // Validation des données
    if (!req.body.menu_id || !req.body.nombre_personne) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    // Insertion en base de données
    const [result] = await pool.query(
      "INSERT INTO commande (user_id, menu_id, nombre_personne, ...) VALUES (?, ?, ?, ...)",
      [userId, req.body.menu_id, req.body.nombre_personne, ...]
    );

    // Envoi d'email de confirmation (via email.js)
    await sendOrderConfirmationEmail(user, commande);

    // Réponse JSON
    res.status(201).json({
      commande_id: result.insertId,
      numero_commande: `CMD-2024-${result.insertId}`,
      ...commande
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

**4. Backend - Middleware authenticateToken**

```javascript
// middleware/auth.js
const authenticateToken = async (req, res, next) => {
  // 1. Récupère le token depuis le header
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  // 2. Vérifie le token
  const decoded = jwt.verify(token, JWT_SECRET);

  // 3. Vérifie que l'utilisateur existe
  const [user] = await pool.query("SELECT * FROM user WHERE user_id = ?", [
    decoded.userId,
  ]);

  // 4. Ajoute les infos utilisateur à req
  req.user = {
    userId: user[0].user_id,
    roleId: user[0].role_id,
    email: user[0].email,
  };

  // 5. Passe au handler suivant
  next();
};
```

### Résumé du flux de communication

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUX COMPLET                             │
└─────────────────────────────────────────────────────────────┘

1. UTILISATEUR
   └─> Clique sur "Commander"
       │
2. COMPOSANT REACT (CommandPage.jsx)
   └─> Appelle handleSubmit()
       │
3. SERVICE (commandService.js)
   └─> createCommand(data)
       ├─> Récupère token (localStorage)
       ├─> Construit requête HTTP
       │   ├─> URL: http://localhost:3000/api/commandes
       │   ├─> Method: POST
       │   ├─> Headers: Authorization: Bearer <token>
       │   └─> Body: JSON.stringify(data)
       └─> Envoie via fetch()
           │
4. BACKEND - MIDDLEWARE (auth.js)
   └─> authenticateToken
       ├─> Extrait token du header
       ├─> Vérifie avec JWT
       ├─> Vérifie utilisateur en BDD
       └─> Ajoute req.user
           │
5. BACKEND - ROUTE (commandes.js)
   └─> POST /api/commandes
       ├─> Validation des données
       ├─> Insertion en BDD (avec userId du token)
       ├─> Envoi email confirmation
       └─> Réponse JSON
           │
6. SERVICE (commandService.js)
   └─> Reçoit réponse
       ├─> Parse JSON
       └─> Retourne données
           │
7. COMPOSANT REACT (CommandPage.jsx)
   └─> Reçoit données
       ├─> Met à jour l'état
       └─> Affiche confirmation
           │
8. UTILISATEUR
   └─> Voit "Commande créée avec succès !"
```

---

## Configuration

### `vite.config.js`

```javascript
- Plugin React avec SWC (compilation rapide)
- Configuration du build avec chunkSizeWarningLimit
- Désactivation du code splitting manuel
```

### `jsconfig.json`

Configuration JavaScript pour :

- Résolution des chemins
- Support des alias
- Configuration de l'IDE

### `eslint.config.js`

Configuration ESLint pour :

- Détection des erreurs
- Respect des bonnes pratiques React
- Règles de hooks React

### Variables d'environnement

Le frontend utilise les variables d'environnement Vite (préfixe `VITE_`) :

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Scripts disponibles

```bash
npm run dev      # Démarrage du serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build de production
npm run lint     # Vérification ESLint
```

---

## Architecture des données

### Communication avec le backend

```
Frontend (React)
    ↓
Services (authService, menusService, etc.)
    ↓
API Backend (Express)
    ↓
Base de données (MySQL/PostgreSQL + MongoDB)
```

### Stockage local

- **localStorage** : Stockage du token JWT
- **Context API** : État de l'utilisateur connecté

---

## Bonnes pratiques

### Séparation des responsabilités

- **Pages** : Structure et routage
- **Composants** : Logique d'affichage réutilisable
- **Services** : Communication avec l'API
- **Context** : État global
- **Styles** : CSS Modules pour le scoping

### Gestion des erreurs

- Tous les services gèrent les erreurs de manière cohérente
- Affichage des messages d'erreur à l'utilisateur
- Gestion des erreurs réseau

### Performance

- Utilisation de Vite pour un build rapide
- Code splitting automatique
- Lazy loading possible pour les routes

---

## Conclusion

Le frontend de Vite Gourmand est une application React moderne, bien structurée et maintenable. L'architecture permet une séparation claire des responsabilités, une gestion efficace de l'authentification et des rôles, et une communication fluide avec le backend via des services dédiés.
