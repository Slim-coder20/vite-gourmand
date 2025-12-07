# 📋 Guide Complet : Implémentation de la Page de Commande

## 📖 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture et Structure](#architecture-et-structure)
3. [Étape 1 : Configuration de base](#étape-1--configuration-de-base)
4. [Étape 2 : Structure de la page de commande](#étape-2--structure-de-la-page-de-commande)
5. [Étape 3 : Étape 1 - Informations de prestation](#étape-3--étape-1---informations-de-prestation)
6. [Étape 4 : Étape 2 - Sélection du menu](#étape-4--étape-2---sélection-du-menu)
7. [Étape 5 : Étape 3 - Nombre de personnes et récapitulatif](#étape-5--étape-3---nombre-de-personnes-et-récapitulatif)
8. [Étape 6 : Calculs des prix](#étape-6--calculs-des-prix)
9. [Étape 7 : Validation et soumission](#étape-7--validation-et-soumission)
10. [Étape 8 : Gestion des erreurs](#étape-8--gestion-des-erreurs)
11. [Étape 9 : Finalisation](#étape-9--finalisation)

---

## 🎯 Vue d'ensemble

### Objectif

Créer une page de commande multi-étapes permettant aux utilisateurs authentifiés de commander un menu avec :

- Pré-remplissage des informations client
- Calcul automatique des prix (menu + livraison)
- Application de réductions selon les conditions
- Validation et confirmation de commande

### Fonctionnalités requises

1. **3 étapes de formulaire** :

   - Étape 1 : Informations de prestation
   - Étape 2 : Sélection du menu
   - Étape 3 : Nombre de personnes et récapitulatif

2. **Calculs automatiques** :

   - Prix du menu selon le nombre de personnes
   - Réduction de 10% si 5 personnes de plus que le minimum
   - Prix de livraison (5€ + 0.59€/km si hors Bordeaux)

3. **Validation** :
   - Vérification du nombre minimum de personnes
   - Validation des champs requis
   - Affichage du récapitulatif avant validation

---

## 🏗️ Architecture et Structure

### Fichiers à créer/modifier

```
frontend/src/
├── pages/
│   └── CommandePage.jsx          (NOUVEAU - Page principale)
├── components/
│   └── commande/
│       ├── Step1Informations.jsx  (NOUVEAU - Étape 1)
│       ├── Step2Menu.jsx          (NOUVEAU - Étape 2)
│       └── Step3Recap.jsx         (NOUVEAU - Étape 3)
├── services/
│   └── commandService.js          (DÉJÀ CRÉÉ - À utiliser)
└── App.jsx                        (MODIFIER - Ajouter la route)
```

### Données nécessaires depuis le backend

Le backend attend ces données dans le POST `/api/commandes` :

```javascript
{
  menu_id: number,
  date_prestation: string,        // Format: "YYYY-MM-DD"
  heure_livraison: string,        // Format: "HH:MM"
  nombre_personne: number,
  adresse_prestation: string,
  pret_materiel: boolean,          // Optionnel, défaut: false
  restitution_materiel: boolean   // Optionnel, défaut: false
}
```

---

## 📝 Étape 1 : Configuration de base

### 1.1 Ajouter la route dans App.jsx

**Fichier** : `frontend/src/App.jsx`

**Action** : Ajouter la route pour la page de commande

**Explication** :

- Le paramètre `:menu_id?` est optionnel (le `?` le rend optionnel)
- Si l'utilisateur vient depuis le bouton "Commander" d'un menu, l'ID sera dans l'URL
- Si l'utilisateur accède directement, il pourra choisir le menu à l'étape 2

**Code à ajouter** :

```jsx
import CommandePage from "./pages/CommandePage";

// Dans le composant App, ajouter dans <Routes> :
<Route path="/commande/:menu_id?" element={<CommandePage />} />;
```

---

## 📝 Étape 2 : Structure de la page de commande

### 2.1 Créer le fichier CommandePage.jsx

**Fichier** : `frontend/src/pages/CommandePage.jsx`

**Structure de base** :

**Explication de la structure** :

- Utiliser `useState` pour gérer l'étape actuelle (1, 2, ou 3)
- Utiliser `useState` pour stocker toutes les données du formulaire
- Utiliser `useParams` pour récupérer le `menu_id` depuis l'URL
- Utiliser `useAuth` pour récupérer les informations utilisateur
- Utiliser `useNavigate` pour la redirection après succès

**États nécessaires** :

```javascript
const [currentStep, setCurrentStep] = useState(1); // Étape actuelle (1, 2, ou 3)
const [formData, setFormData] = useState({
  // Toutes les données du formulaire
  // Étape 1
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  adresse_prestation: "",
  date_prestation: "",
  heure_livraison: "",
  lieu_livraison: "",

  // Étape 2
  menu_id: null,
  menu: null, // Objet menu complet pour affichage

  // Étape 3
  nombre_personne: null,

  // Calculs
  prix_menu: 0,
  prix_livraison: 0,
  prix_total: 0,
  reduction_appliquee: false,
});
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
```

**Hooks nécessaires** :

```javascript
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMenuById } from "../services/menusService";
```

**Structure du composant** :

```jsx
function CommandePage() {
  // Hooks
  const { menu_id: menuIdFromUrl } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // États (comme défini ci-dessus)

  // useEffect pour :
  // 1. Vérifier l'authentification
  // 2. Pré-remplir les données utilisateur
  // 3. Charger le menu si menuIdFromUrl existe

  // Fonctions de navigation entre étapes
  const nextStep = () => {
    /* ... */
  };
  const prevStep = () => {
    /* ... */
  };

  // Fonction de soumission finale
  const handleSubmit = async () => {
    /* ... */
  };

  // Rendu conditionnel selon l'étape
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {/* Indicateur de progression */}
        {/* Affichage de l'étape actuelle */}
        {/* Boutons de navigation */}
      </main>
      <Footer />
    </div>
  );
}
```

---

## 📝 Étape 3 : Étape 1 - Informations de prestation

### 3.1 Pré-remplissage des données utilisateur

**Quand** : Au chargement de la page (dans un `useEffect`)

**Explication** :

- Les données utilisateur sont disponibles dans `user` du contexte `AuthContext`
- Le backend retourne ces données lors du login/register
- Si `user` est `null`, il faut rediriger vers la page de connexion

**Code** :

```javascript
useEffect(() => {
  // Vérifier l'authentification
  if (!isAuthenticated || !user) {
    navigate("/login", {
      state: { from: `/commande${menuIdFromUrl ? `/${menuIdFromUrl}` : ""}` },
    });
    return;
  }

  // Pré-remplir les données utilisateur
  setFormData((prev) => ({
    ...prev,
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
    telephone: user.telephone || "",
    adresse_prestation: user.adresse_postals || "", // Adresse par défaut
  }));
}, [isAuthenticated, user, navigate, menuIdFromUrl]);
```

### 3.2 Créer le composant Step1Informations

**Fichier** : `frontend/src/components/commande/Step1Informations.jsx`

**Champs du formulaire** :

1. **Nom** (auto-rempli, lecture seule ou éditable selon besoin)
2. **Prénom** (auto-rempli, lecture seule ou éditable)
3. **Email** (auto-rempli, lecture seule ou éditable)
4. **GSM/Téléphone** (auto-rempli, lecture seule ou éditable)
5. **Adresse de prestation** (input texte, éditable)
6. **Date de prestation** (input type="date", éditable)
7. **Heure de livraison souhaitée** (input type="time", éditable)
8. **Lieu de livraison** (input texte, optionnel)

**Structure** :

```jsx
function Step1Informations({ formData, setFormData, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="step-container">
      <h2>Étape 1 : Informations de prestation</h2>

      <div className="form-group">
        <label>Nom</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          readOnly // Ou editable selon besoin
        />
      </div>

      {/* Répéter pour tous les champs */}

      {errors.step1 && <div className="error">{errors.step1}</div>}
    </div>
  );
}
```

**Validation de l'étape 1** :

- Vérifier que tous les champs requis sont remplis
- Vérifier que la date de prestation est dans le futur
- Stocker les erreurs dans un état `errors`

---

## 📝 Étape 4 : Étape 2 - Sélection du menu

### 4.1 Charger le menu depuis l'URL

**Quand** : Si `menuIdFromUrl` existe, charger le menu automatiquement

**Explication** :

- Si l'utilisateur vient depuis `MenuDetailPage`, le `menu_id` est dans l'URL
- Utiliser `getMenuById(menuIdFromUrl)` pour récupérer les détails du menu
- Stocker le menu dans `formData.menu` et `formData.menu_id`

**Code** :

```javascript
useEffect(() => {
  const loadMenu = async () => {
    if (menuIdFromUrl) {
      try {
        setIsLoading(true);
        const menu = await getMenuById(menuIdFromUrl);
        setFormData((prev) => ({
          ...prev,
          menu_id: menu.menu_id,
          menu: menu,
        }));
        // Passer automatiquement à l'étape 3 si le menu est pré-sélectionné
        setCurrentStep(3);
      } catch (error) {
        setError("Menu introuvable");
      } finally {
        setIsLoading(false);
      }
    }
  };

  loadMenu();
}, [menuIdFromUrl]);
```

### 4.2 Créer le composant Step2Menu

**Fichier** : `frontend/src/components/commande/Step2Menu.jsx`

**Fonctionnalités** :

- Si menu pré-sélectionné : afficher les détails du menu
- Sinon : afficher une liste de menus disponibles (utiliser `getPublicMenus()`)
- Permettre la sélection d'un menu

**Structure** :

```jsx
function Step2Menu({ formData, setFormData, onMenuSelect }) {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    // Si menu déjà sélectionné, ne rien faire
    if (formData.menu) return;

    // Sinon, charger la liste des menus
    const loadMenus = async () => {
      try {
        const menusList = await getPublicMenus();
        setMenus(menusList);
      } catch (error) {
        console.error("Erreur chargement menus", error);
      }
    };
    loadMenus();
  }, [formData.menu]);

  // Si menu pré-sélectionné, afficher ses détails
  if (formData.menu) {
    return (
      <div className="menu-selected">
        <h3>{formData.menu.titre}</h3>
        <p>{formData.menu.description}</p>
        <p>Prix : {formData.menu.prix_par_personne}€/personne</p>
        <p>Minimum : {formData.menu.nombre_personne_minimum} personne(s)</p>
      </div>
    );
  }

  // Sinon, afficher la liste
  return (
    <div className="menu-list">
      {menus.map((menu) => (
        <div key={menu.menu_id} onClick={() => onMenuSelect(menu)}>
          {/* Afficher les détails du menu */}
        </div>
      ))}
    </div>
  );
}
```

---

## 📝 Étape 5 : Étape 3 - Nombre de personnes et récapitulatif

### 5.1 Créer le composant Step3Recap

**Fichier** : `frontend/src/components/commande/Step3Recap.jsx`

**Fonctionnalités** :

1. **Input pour le nombre de personnes** :

   - Type : `number`
   - Minimum : `formData.menu.nombre_personne_minimum`
   - Valeur par défaut : le minimum
   - Mise à jour en temps réel du prix

2. **Calcul et affichage des prix** :
   - Prix du menu (avec réduction si applicable)
   - Prix de livraison
   - Total

**Structure** :

```jsx
function Step3Recap({ formData, setFormData, onCalculatePrice }) {
  const handleNombreChange = (e) => {
    const nombre = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      nombre_personne: nombre,
    }));
    // Recalculer les prix
    onCalculatePrice(nombre);
  };

  return (
    <div className="step-recap">
      <h2>Étape 3 : Nombre de personnes et récapitulatif</h2>

      <div className="form-group">
        <label>
          Nombre de personnes (minimum : {formData.menu.nombre_personne_minimum}
          )
        </label>
        <input
          type="number"
          min={formData.menu.nombre_personne_minimum}
          value={
            formData.nombre_personne || formData.menu.nombre_personne_minimum
          }
          onChange={handleNombreChange}
        />
      </div>

      {/* Récapitulatif des prix */}
      <div className="recap-prix">
        <div className="prix-ligne">
          <span>Prix du menu ({formData.nombre_personne} personne(s))</span>
          <span>{formData.prix_menu.toFixed(2)}€</span>
        </div>
        {formData.reduction_appliquee && (
          <div className="reduction">Réduction de 10% appliquée</div>
        )}
        <div className="prix-ligne">
          <span>Prix de livraison</span>
          <span>{formData.prix_livraison.toFixed(2)}€</span>
        </div>
        <div className="prix-ligne total">
          <span>Total</span>
          <span>{formData.prix_total.toFixed(2)}€</span>
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 Étape 6 : Calculs des prix

### 6.1 Fonction de calcul du prix du menu

**Explication** :

- Prix de base = `prix_par_personne × nombre_personnes`
- Si `nombre_personnes ≥ nombre_personne_minimum + 5` → appliquer une réduction de 10%
- Stocker le résultat dans `formData.prix_menu`

**Code** :

```javascript
const calculatePrixMenu = (nombrePersonnes, menu) => {
  if (!menu || !nombrePersonnes) return 0;

  let prixMenu = menu.prix_par_personne * nombrePersonnes;
  let reductionAppliquee = false;

  // Vérifier si la réduction de 10% s'applique
  if (nombrePersonnes >= menu.nombre_personne_minimum + 5) {
    prixMenu = prixMenu * 0.9; // Réduction de 10%
    reductionAppliquee = true;
  }

  return { prixMenu, reductionAppliquee };
};
```

### 6.2 Fonction de calcul du prix de livraison

**Explication** :

- Si l'adresse de prestation est différente de l'adresse du compte OU si la ville n'est pas "Bordeaux" → 5€ de base
- (Optionnel : + 0.59€ par kilomètre si vous avez la distance)
- Pour l'instant, on utilise 5€ de base si hors Bordeaux

**Code** :

```javascript
const calculatePrixLivraison = (adressePrestation, user) => {
  if (!adressePrestation || !user) return 0;

  // Vérifier si livraison hors Bordeaux
  const isHorsBordeaux =
    user.ville !== "Bordeaux" || adressePrestation !== user.adresse_postals;

  if (isHorsBordeaux) {
    // Pour l'instant, 5€ de base
    // TODO: Ajouter le calcul de distance si nécessaire
    return 5.0;
  }

  return 0; // Livraison gratuite à Bordeaux
};
```

### 6.3 Fonction globale de calcul

**Code** :

```javascript
const calculateAllPrices = () => {
  const { menu, nombre_personne, adresse_prestation } = formData;

  if (!menu || !nombre_personne) return;

  // Calcul prix menu
  const { prixMenu, reductionAppliquee } = calculatePrixMenu(
    nombre_personne,
    menu
  );

  // Calcul prix livraison
  const prixLivraison = calculatePrixLivraison(adresse_prestation, user);

  // Calcul total
  const prixTotal = prixMenu + prixLivraison;

  // Mettre à jour formData
  setFormData((prev) => ({
    ...prev,
    prix_menu: prixMenu,
    prix_livraison: prixLivraison,
    prix_total: prixTotal,
    reduction_appliquee: reductionAppliquee,
  }));
};
```

**Quand appeler cette fonction** :

- Quand le nombre de personnes change
- Quand l'adresse de prestation change
- Quand le menu change

---

## 📝 Étape 7 : Validation et soumission

### 7.1 Validation avant soumission

**Vérifications nécessaires** :

1. **Étape 1** :

   - Tous les champs requis remplis
   - Date de prestation dans le futur
   - Heure de livraison valide

2. **Étape 2** :

   - Menu sélectionné

3. **Étape 3** :
   - Nombre de personnes ≥ minimum requis

**Code de validation** :

```javascript
const validateForm = () => {
  const errors = {};

  // Validation étape 1
  if (
    !formData.nom ||
    !formData.prenom ||
    !formData.email ||
    !formData.telephone ||
    !formData.adresse_prestation ||
    !formData.date_prestation ||
    !formData.heure_livraison
  ) {
    errors.step1 = "Tous les champs sont requis";
    return { isValid: false, errors };
  }

  // Vérifier que la date est dans le futur
  const datePrestation = new Date(formData.date_prestation);
  const aujourdhui = new Date();
  if (datePrestation <= aujourdhui) {
    errors.step1 = "La date de prestation doit être dans le futur";
    return { isValid: false, errors };
  }

  // Validation étape 2
  if (!formData.menu_id || !formData.menu) {
    errors.step2 = "Veuillez sélectionner un menu";
    return { isValid: false, errors };
  }

  // Validation étape 3
  if (
    !formData.nombre_personne ||
    formData.nombre_personne < formData.menu.nombre_personne_minimum
  ) {
    errors.step3 = `Le nombre minimum de personnes est ${formData.menu.nombre_personne_minimum}`;
    return { isValid: false, errors };
  }

  return { isValid: true, errors: {} };
};
```

### 7.2 Fonction de soumission

**Explication** :

- Préparer les données selon le format attendu par le backend
- Appeler `createCommand()` depuis `commandService`
- Gérer le succès (redirection + message)
- Gérer les erreurs (affichage)

**Code** :

```javascript
const handleSubmit = async () => {
  // Valider le formulaire
  const { isValid, errors } = validateForm();
  if (!isValid) {
    setError(errors);
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    // Préparer les données pour le backend
    const commandData = {
      menu_id: formData.menu_id,
      date_prestation: formData.date_prestation, // Format: "YYYY-MM-DD"
      heure_livraison: formData.heure_livraison, // Format: "HH:MM"
      nombre_personne: formData.nombre_personne,
      adresse_prestation: formData.adresse_prestation,
      pret_materiel: false, // À ajouter si nécessaire
      restitution_materiel: false, // À ajouter si nécessaire
    };

    // Appeler le service
    const response = await createCommand(commandData);

    // Succès : rediriger vers une page de confirmation
    navigate("/commande-confirmation", {
      state: { commande: response.commande },
    });
  } catch (error) {
    setError(error.message || "Erreur lors de la création de la commande");
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📝 Étape 8 : Gestion des erreurs

### 8.1 États d'erreur

**Créer un état pour les erreurs** :

```javascript
const [errors, setErrors] = useState({
  step1: null,
  step2: null,
  step3: null,
  submit: null,
});
```

### 8.2 Affichage des erreurs

**Dans chaque étape** :

```jsx
{
  errors.step1 && <div className="error-message">{errors.step1}</div>;
}
```

### 8.3 Gestion des erreurs réseau

**Dans la fonction de soumission** :

```javascript
catch (error) {
  // Erreur réseau
  if (error.message.includes("fetch")) {
    setError("Erreur de connexion. Vérifiez votre connexion internet.");
  }
  // Erreur de validation backend
  else if (error.message.includes("minimum")) {
    setError(error.message);
  }
  // Autre erreur
  else {
    setError(error.message || "Une erreur est survenue");
  }
}
```

---

## 📝 Étape 9 : Finalisation

### 9.1 Navigation entre les étapes

#### 🎯 **À quoi servent ces fonctions ?**

Les fonctions `nextStep()` et `prevStep()` permettent de **naviguer entre les 3 étapes** du formulaire de commande. Elles sont essentielles pour :

1. **Contrôler la progression** : L'utilisateur ne peut pas passer à l'étape suivante si les données de l'étape actuelle ne sont pas valides
2. **Valider les données** : Chaque étape est vérifiée avant de permettre le passage à la suivante
3. **Gérer les erreurs** : Si une validation échoue, un message d'erreur est affiché et l'utilisateur reste sur l'étape actuelle
4. **Permettre le retour en arrière** : L'utilisateur peut revenir à l'étape précédente pour modifier ses informations

#### 📋 **Fonction `nextStep()` - Passer à l'étape suivante**

**Rôle** : Valide l'étape actuelle et passe à l'étape suivante si tout est correct.

**Fonctionnement détaillé** :

1. **Vérifie l'étape actuelle** : Selon l'étape (1, 2, ou 3), elle effectue des validations spécifiques
2. **Valide les données** : Vérifie que tous les champs requis sont remplis et corrects
3. **Affiche les erreurs** : Si une validation échoue, affiche un message d'erreur et bloque la navigation
4. **Passe à l'étape suivante** : Si tout est valide, incrémente `currentStep` de 1

**Code complet avec explications** :

```javascript
const nextStep = () => {
  // Réinitialiser les erreurs de l'étape précédente
  setErrors({
    step1: null,
    step2: null,
    step3: null,
  });

  // ============================================
  // VALIDATION DE L'ÉTAPE 1 : Informations de prestation
  // ============================================
  if (currentStep === 1) {
    // Vérifier que tous les champs requis de l'étape 1 sont remplis
    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.email ||
      !formData.telephone ||
      !formData.adresse_prestation ||
      !formData.date_prestation ||
      !formData.heure_livraison
    ) {
      // Si un champ est manquant, afficher une erreur et NE PAS passer à l'étape suivante
      setErrors((prev) => ({
        ...prev,
        step1: "Veuillez remplir tous les champs obligatoires",
      }));
      return; // ⚠️ IMPORTANT : Le "return" arrête la fonction ici, on ne passe pas à l'étape suivante
    }

    // Vérifier que la date de prestation est dans le futur
    const datePrestation = new Date(formData.date_prestation);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0); // Remettre l'heure à 00:00:00 pour comparer seulement les dates

    if (datePrestation <= aujourdhui) {
      setErrors((prev) => ({
        ...prev,
        step1: "La date de prestation doit être dans le futur",
      }));
      return; // Bloquer la navigation si la date est invalide
    }
  }

  // ============================================
  // VALIDATION DE L'ÉTAPE 2 : Sélection du menu
  // ============================================
  if (currentStep === 2) {
    // Vérifier qu'un menu a été sélectionné
    if (!formData.menu_id || !formData.menu) {
      setErrors((prev) => ({
        ...prev,
        step2: "Veuillez sélectionner un menu",
      }));
      return; // Bloquer la navigation si aucun menu n'est sélectionné
    }
  }

  // ============================================
  // VALIDATION DE L'ÉTAPE 3 : Nombre de personnes
  // ============================================
  if (currentStep === 3) {
    // Vérifier que le nombre de personnes est renseigné
    if (!formData.nombre_personne) {
      setErrors((prev) => ({
        ...prev,
        step3: "Veuillez indiquer le nombre de personnes",
      }));
      return;
    }

    // Vérifier que le nombre de personnes respecte le minimum du menu
    if (formData.nombre_personne < formData.menu.nombre_personne_minimum) {
      setErrors((prev) => ({
        ...prev,
        step3: `Le nombre minimum de personnes est ${formData.menu.nombre_personne_minimum}`,
      }));
      return; // Bloquer si le minimum n'est pas respecté
    }
  }

  // ============================================
  // SI TOUTES LES VALIDATIONS SONT PASSÉES
  // ============================================
  // On peut maintenant passer à l'étape suivante
  // Mais seulement si on n'est pas déjà à la dernière étape (étape 3)
  if (currentStep < 3) {
    setCurrentStep(currentStep + 1);

    // Optionnel : Recalculer les prix si on passe à l'étape 3
    if (currentStep === 2 && formData.menu && formData.nombre_personne) {
      calculateAllPrices();
    }
  }
};
```

#### 🔙 **Fonction `prevStep()` - Revenir à l'étape précédente**

**Rôle** : Permet à l'utilisateur de revenir en arrière pour modifier ses informations.

**Fonctionnement** :

- Plus simple que `nextStep()` car **pas besoin de validation** pour revenir en arrière
- Vérifie simplement qu'on n'est pas déjà à l'étape 1
- Décrémente `currentStep` de 1

**Code complet** :

```javascript
const prevStep = () => {
  // Réinitialiser les erreurs quand on revient en arrière
  setErrors({
    step1: null,
    step2: null,
    step3: null,
  });

  // Vérifier qu'on n'est pas déjà à la première étape
  if (currentStep > 1) {
    // Revenir à l'étape précédente
    setCurrentStep(currentStep - 1);
  }
  // Si on est déjà à l'étape 1, ne rien faire (on ne peut pas aller en arrière)
};
```

#### 🔗 **Utilisation dans le JSX - Code complet avec explications**

Voici comment utiliser les fonctions `nextStep()`, `prevStep()` et `handleSubmit()` dans votre composant JSX :

**Explication** : Les boutons de navigation doivent être placés après le contenu de chaque étape. Ils permettent à l'utilisateur de naviguer entre les étapes et de soumettre la commande.

**Code complet à intégrer dans votre `return`** :

```jsx
return (
  <div className="app-container">
    <Header />
    <main className="main-content">
      <div className="commande-container">
        {/* 
          ============================================
          SECTION 1 : Indicateur de progression
          ============================================
          Affiche visuellement à quelle étape on se trouve (1/3, 2/3, 3/3)
        */}
        <div className="progress-indicator">
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <span>1</span>
            <label>Informations</label>
          </div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <span>2</span>
            <label>Menu</label>
          </div>
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
            <span>3</span>
            <label>Récapitulatif</label>
          </div>
        </div>

        {/* 
          ============================================
          SECTION 2 : Affichage conditionnel des étapes
          ============================================
          Affiche le contenu de l'étape actuelle
        */}
        {currentStep === 1 && (
          <div>
            {/* Contenu de l'étape 1 : Informations de prestation */}
            <h2>Étape 1 : Informations de prestation</h2>
            {/* Ici vous mettrez votre formulaire Step1Informations */}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            {/* Contenu de l'étape 2 : Sélection du menu */}
            <h2>Étape 2 : Sélection du menu</h2>
            {/* Ici vous mettrez votre composant Step2Menu */}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            {/* Contenu de l'étape 3 : Nombre de personnes et récapitulatif */}
            <h2>Étape 3 : Récapitulatif</h2>
            {/* Ici vous mettrez votre composant Step3Recap */}
          </div>
        )}

        {/* 
          ============================================
          SECTION 3 : Boutons de navigation
          ============================================
          Ces boutons utilisent les fonctions nextStep, prevStep et handleSubmit
        */}
        <div className="navigation-buttons">
          {/* 
            BOUTON "PRÉCÉDENT"
            - Visible uniquement si on n'est pas à l'étape 1 (currentStep > 1)
            - Appelle la fonction prevStep() au clic
            - Permet de revenir en arrière pour modifier les informations
          */}
          {currentStep > 1 && (
            <button type="button" onClick={prevStep}>
              ← Précédent
            </button>
          )}

          {/* 
            BOUTON "SUIVANT" OU "VALIDER"
            - Si on est aux étapes 1 ou 2 (currentStep < 3) : affiche "Suivant"
            - Si on est à l'étape 3 (currentStep === 3) : affiche "Valider la commande"
          */}
          {currentStep < 3 ? (
            /* 
              BOUTON "SUIVANT" (étapes 1 et 2)
              - Appelle la fonction nextStep() au clic
              - Valide l'étape actuelle avant de passer à la suivante
            */
            <button type="button" onClick={nextStep}>
              Suivant →
            </button>
          ) : (
            /* 
              BOUTON "VALIDER LA COMMANDE" (étape 3)
              - Appelle la fonction handleSubmit() au clic
              - Désactivé pendant le chargement (disabled={isLoading})
              - Affiche "Traitement..." pendant la soumission
            */
            <button type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Traitement..." : "Valider la commande"}
            </button>
          )}
        </div>

        {/* 
          ============================================
          SECTION 4 : Affichage des erreurs
          ============================================
          Affiche les messages d'erreur pour chaque étape
        */}

        {/* Erreur globale (pour les erreurs de soumission) */}
        {error && (
          <div className="error-message error-global">
            <strong>Erreur :</strong> {error}
          </div>
        )}

        {/* Erreurs spécifiques à chaque étape */}
        {errors.step1 && (
          <div className="error-message error-step1">
            <strong>Étape 1 :</strong> {errors.step1}
          </div>
        )}

        {errors.step2 && (
          <div className="error-message error-step2">
            <strong>Étape 2 :</strong> {errors.step2}
          </div>
        )}

        {errors.step3 && (
          <div className="error-message error-step3">
            <strong>Étape 3 :</strong> {errors.step3}
          </div>
        )}
      </div>
    </main>
    <Footer />
  </div>
);
```

#### 📝 **Explication détaillée de chaque partie**

**1. Indicateur de progression** :

- Affiche visuellement les 3 étapes (1, 2, 3)
- La classe `active` est ajoutée aux étapes déjà complétées ou en cours
- Aide l'utilisateur à savoir où il en est dans le processus

**2. Affichage conditionnel des étapes** :

- Utilise `currentStep` pour déterminer quelle étape afficher
- Chaque étape a son propre contenu (formulaire, sélection, récapitulatif)
- Seule l'étape actuelle est rendue dans le DOM

**3. Boutons de navigation** :

- **Bouton "Précédent"** :

  - Visible uniquement si `currentStep > 1` (pas à l'étape 1)
  - Appelle `prevStep()` pour revenir en arrière
  - Pas de validation nécessaire pour revenir en arrière

- **Bouton "Suivant"** :

  - Visible aux étapes 1 et 2 (`currentStep < 3`)
  - Appelle `nextStep()` qui valide l'étape avant de passer à la suivante
  - Si la validation échoue, l'utilisateur reste sur l'étape actuelle

- **Bouton "Valider la commande"** :
  - Visible uniquement à l'étape 3 (`currentStep === 3`)
  - Appelle `handleSubmit()` qui valide tout et envoie la commande
  - Désactivé pendant le chargement (`disabled={isLoading}`)
  - Affiche "Traitement..." pendant la soumission

**4. Affichage des erreurs** :

- **Erreur globale** (`error`) : Pour les erreurs de soumission (réseau, backend, etc.)
- **Erreurs par étape** (`errors.step1`, `errors.step2`, `errors.step3`) : Pour les erreurs de validation de chaque étape
- Chaque erreur est affichée dans un div avec une classe CSS pour le style

#### 🎨 **Exemple de styles CSS (optionnel)**

Vous pouvez ajouter ces styles dans votre fichier CSS :

```css
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
}

.navigation-buttons button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.navigation-buttons button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
}
```

#### ⚠️ **Points importants à retenir**

1. **Le `return` est crucial** : Dans `nextStep()`, si une validation échoue, le `return` empêche l'exécution du reste de la fonction, donc on ne passe pas à l'étape suivante

2. **Validation progressive** : Chaque étape est validée indépendamment. On ne peut pas sauter d'étape

3. **Gestion des erreurs** : Les erreurs sont stockées dans un état séparé (`errors`) pour être affichées dans chaque composant d'étape

4. **Pas de validation pour `prevStep()`** : On peut toujours revenir en arrière, même si les données ne sont pas complètes

5. **Calcul automatique** : Quand on passe de l'étape 2 à l'étape 3, on peut recalculer automatiquement les prix si le menu et le nombre de personnes sont déjà définis

### 9.2 Indicateur de progression

**Code** :

```jsx
<div className="progress-indicator">
  <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
    <span>1</span>
    <label>Informations</label>
  </div>
  <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
    <span>2</span>
    <label>Menu</label>
  </div>
  <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
    <span>3</span>
    <label>Récapitulatif</label>
  </div>
</div>
```

### 9.3 Structure finale de CommandePage.jsx

**Rendu conditionnel** :

```jsx
return (
  <div className="app-container">
    <Header />
    <main className="main-content">
      <div className="commande-container">
        {/* Indicateur de progression */}
        <ProgressIndicator currentStep={currentStep} />

        {/* Affichage conditionnel selon l'étape */}
        {currentStep === 1 && (
          <Step1Informations
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <Step2Menu
            formData={formData}
            setFormData={setFormData}
            onMenuSelect={(menu) => {
              setFormData((prev) => ({
                ...prev,
                menu_id: menu.menu_id,
                menu: menu,
              }));
              setCurrentStep(3);
            }}
          />
        )}

        {currentStep === 3 && (
          <Step3Recap
            formData={formData}
            setFormData={setFormData}
            onCalculatePrice={calculateAllPrices}
          />
        )}

        {/* Boutons de navigation */}
        <div className="navigation-buttons">
          {currentStep > 1 && <button onClick={prevStep}>Précédent</button>}
          {currentStep < 3 ? (
            <button onClick={nextStep}>Suivant</button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Traitement..." : "Valider la commande"}
            </button>
          )}
        </div>

        {/* Affichage des erreurs globales */}
        {error && <div className="error-global">{error}</div>}
      </div>
    </main>
    <Footer />
  </div>
);
```

---

## ✅ Checklist de vérification

### Fonctionnalités

- [ ] Route `/commande/:menu_id?` ajoutée dans App.jsx
- [ ] Vérification de l'authentification au chargement
- [ ] Pré-remplissage des données utilisateur
- [ ] Chargement automatique du menu si ID dans l'URL
- [ ] Navigation entre les 3 étapes
- [ ] Validation de chaque étape
- [ ] Calcul du prix du menu avec réduction si applicable
- [ ] Calcul du prix de livraison
- [ ] Affichage du récapitulatif
- [ ] Soumission de la commande
- [ ] Gestion des erreurs
- [ ] Redirection après succès

### Données

- [ ] Tous les champs requis sont collectés
- [ ] Format des dates/heures correct (YYYY-MM-DD, HH:MM)
- [ ] Validation du nombre minimum de personnes
- [ ] Calculs de prix corrects

### UX/UI

- [ ] Indicateur de progression visible
- [ ] Messages d'erreur clairs
- [ ] États de chargement affichés
- [ ] Design cohérent avec le reste de l'application
- [ ] Responsive

---

## 🔍 Points d'attention

### 1. Format des dates

Le backend attend `date_prestation` au format `"YYYY-MM-DD"` et `heure_livraison` au format `"HH:MM"`. Assurez-vous que les inputs HTML utilisent ces formats.

### 2. Calcul de la livraison

Pour l'instant, le calcul est simplifié (5€ si hors Bordeaux). Si vous voulez ajouter le calcul de distance :

- Utiliser une API de géolocalisation (Google Maps, OpenRouteService, etc.)
- Calculer la distance entre l'adresse du compte et l'adresse de prestation
- Ajouter 0.59€ par kilomètre

### 3. Email de confirmation

Le backend doit gérer l'envoi d'email après la création de la commande. Vérifiez que cette fonctionnalité est implémentée côté backend.

### 4. Gestion du token

Assurez-vous que le token est toujours présent dans les headers lors des appels API. Si le token expire, rediriger vers la page de connexion.

---

## 📚 Ressources utiles

- **React Router** : Documentation pour `useParams`, `useNavigate`
- **React Hooks** : `useState`, `useEffect`
- **Context API** : `useAuth` pour récupérer les données utilisateur
- **Services** : `commandService.js` pour les appels API

---

## 🎉 Conclusion

Ce guide vous donne toutes les étapes nécessaires pour implémenter la page de commande. Suivez les étapes dans l'ordre, testez chaque fonctionnalité au fur et à mesure, et n'hésitez pas à adapter le code selon vos besoins spécifiques.

**Bonne implémentation ! 🚀**
