# 🔄 Guide : Réutilisabilité du Pattern de Commande Multi-Étapes

## 📋 Table des matières

1. [Introduction : Pourquoi ce pattern est réutilisable](#introduction)
2. [Architecture générique du pattern](#architecture-generique)
3. [Composants réutilisables](#composants-reutilisables)
4. [Adaptations selon le projet](#adaptations-selon-le-projet)
5. [Exemples d'applications](#exemples-dapplications)
6. [Avantages de cette approche](#avantages)
7. [Comment généraliser le code](#comment-generaliser)

---

## 🎯 Introduction : Pourquoi ce pattern est réutilisable

### Concept fondamental

Le pattern que nous avons développé est un **formulaire multi-étapes (wizard)** avec :

- **Gestion d'état centralisée** dans un composant parent
- **Composants d'étapes modulaires** qui reçoivent des props
- **Validation progressive** à chaque étape
- **Navigation entre les étapes** avec contrôles

**C'est un pattern générique** qui peut être adapté à de nombreux cas d'usage !

### Pourquoi c'est réutilisable ?

1. **Séparation des responsabilités** : Chaque composant a un rôle clair
2. **Découplage** : Les composants d'étapes sont indépendants
3. **Flexibilité** : Facile d'ajouter/supprimer des étapes
4. **Maintenabilité** : Code organisé et modulaire

---

## 🏗️ Architecture générique du pattern

### Structure de base (toujours la même)

```
┌─────────────────────────────────────┐
│   COMPOSANT PARENT                  │
│   (WizardPage.jsx)                  │
│                                     │
│   - État global (formData)          │
│   - Gestion des étapes (currentStep)│
│   - Validation                      │
│   - Navigation (nextStep, prevStep) │
│   - Soumission finale               │
└─────────────────────────────────────┘
            │
            │ Props
            ▼
┌─────────────────────────────────────┐
│   COMPOSANTS D'ÉTAPES               │
│   (Step1, Step2, Step3...)          │
│                                     │
│   - Reçoivent formData en props     │
│   - Affichent le formulaire         │
│   - Appellent setFormData           │
│   - Indépendants les uns des autres │
└─────────────────────────────────────┘
```

### Code générique du parent

```jsx
// WizardPage.jsx - Pattern générique
function WizardPage() {
  // 1. État global (identique dans tous les projets)
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Structure adaptée selon le projet
  });
  const [errors, setErrors] = useState({});

  // 2. Navigation (identique dans tous les projets)
  const nextStep = () => {
    // Validation de l'étape actuelle
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 3. Validation (adaptée selon le projet)
  const validateStep = (step) => {
    // Logique de validation spécifique
  };

  // 4. Soumission (adaptée selon le projet)
  const handleSubmit = async () => {
    // Envoi des données
  };

  // 5. Rendu conditionnel (identique)
  return (
    <div>
      {currentStep === 1 && (
        <Step1 formData={formData} setFormData={setFormData} />
      )}
      {currentStep === 2 && (
        <Step2 formData={formData} setFormData={setFormData} />
      )}
      {currentStep === 3 && (
        <Step3 formData={formData} setFormData={setFormData} />
      )}

      <NavigationButtons
        currentStep={currentStep}
        onNext={nextStep}
        onPrev={prevStep}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

---

## 🧩 Composants réutilisables

### 1. Composant de navigation (100% réutilisable)

```jsx
// NavigationButtons.jsx - RÉUTILISABLE TEL QUEL
function NavigationButtons({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSubmit,
  isLoading,
}) {
  return (
    <div className="navigation-buttons">
      {currentStep > 1 && <button onClick={onPrev}>Précédent</button>}
      {currentStep < totalSteps ? (
        <button onClick={onNext}>Suivant</button>
      ) : (
        <button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Traitement..." : "Valider"}
        </button>
      )}
    </div>
  );
}
```

**Utilisable dans** : Tous les projets avec formulaire multi-étapes

### 2. Indicateur de progression (100% réutilisable)

```jsx
// ProgressIndicator.jsx - RÉUTILISABLE TEL QUEL
function ProgressIndicator({ currentStep, totalSteps, stepLabels }) {
  return (
    <div className="progress-indicator">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`step ${currentStep >= step ? "active" : ""}`}
        >
          <span>{step}</span>
          <label>{stepLabels[step - 1]}</label>
        </div>
      ))}
    </div>
  );
}
```

**Utilisable dans** : Tous les projets avec étapes

### 3. Fonctions de validation (partiellement réutilisable)

```jsx
// validationUtils.js - RÉUTILISABLE (à adapter)
export const validateRequired = (value) => {
  return value && value.trim() !== "";
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateDate = (date, minDate = null) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;
  if (minDate && dateObj <= new Date(minDate)) return false;
  return true;
};
```

**Utilisable dans** : Tous les projets (fonctions génériques)

---

## 🔄 Adaptations selon le projet

### Exemple 1 : Commande de restaurant (votre projet actuel)

```jsx
// CommandPage.jsx
const [formData, setFormData] = useState({
  // Étape 1 : Informations client
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  adresse_prestation: "",
  date_prestation: "",
  heure_livraison: "",

  // Étape 2 : Menu
  menu_id: null,
  menu: null,

  // Étape 3 : Nombre de personnes
  nombre_personne: null,
  prix_menu: 0,
  prix_livraison: 0,
  prix_total: 0,
});
```

### Exemple 2 : Inscription utilisateur

```jsx
// RegisterPage.jsx - MÊME PATTERN, DONNÉES DIFFÉRENTES
const [formData, setFormData] = useState({
  // Étape 1 : Informations personnelles
  nom: "",
  prenom: "",
  email: "",
  telephone: "",

  // Étape 2 : Mot de passe
  password: "",
  confirmPassword: "",

  // Étape 3 : Préférences
  newsletter: false,
  conditions: false,
});
```

### Exemple 3 : Réservation d'hôtel

```jsx
// BookingPage.jsx - MÊME PATTERN, DONNÉES DIFFÉRENTES
const [formData, setFormData] = useState({
  // Étape 1 : Dates et nombre de personnes
  date_arrivee: "",
  date_depart: "",
  nombre_adultes: 1,
  nombre_enfants: 0,

  // Étape 2 : Type de chambre
  type_chambre: null,
  options: [],

  // Étape 3 : Informations client
  nom: "",
  email: "",
  telephone: "",
  prix_total: 0,
});
```

### Exemple 4 : Configuration de produit

```jsx
// ProductConfigPage.jsx - MÊME PATTERN, DONNÉES DIFFÉRENTES
const [formData, setFormData] = useState({
  // Étape 1 : Modèle de base
  modele: null,
  couleur: "",

  // Étape 2 : Options
  options: [],
  accessoires: [],

  // Étape 3 : Personnalisation
  gravure: "",
  prix_total: 0,
});
```

**Conclusion** : Le pattern reste identique, seules les données changent !

---

## 💼 Exemples d'applications

### 1. E-commerce

**Cas d'usage** : Processus de commande

- Étape 1 : Panier et récapitulatif
- Étape 2 : Informations de livraison
- Étape 3 : Informations de paiement
- Étape 4 : Confirmation

**Adaptation** : Même structure, étapes différentes

### 2. Inscription / Onboarding

**Cas d'usage** : Inscription utilisateur

- Étape 1 : Informations personnelles
- Étape 2 : Création du compte
- Étape 3 : Préférences
- Étape 4 : Vérification email

**Adaptation** : Même structure, validation différente

### 3. Réservation de services

**Cas d'usage** : Réservation (restaurant, hôtel, spa)

- Étape 1 : Date et heure
- Étape 2 : Service choisi
- Étape 3 : Informations client
- Étape 4 : Confirmation

**Adaptation** : Même structure, calculs différents

### 4. Configuration de produits

**Cas d'usage** : Personnalisation de produit

- Étape 1 : Modèle de base
- Étape 2 : Options et accessoires
- Étape 3 : Personnalisation
- Étape 4 : Récapitulatif et commande

**Adaptation** : Même structure, logique métier différente

### 5. Formulaire de contact avancé

**Cas d'usage** : Formulaire de demande de devis

- Étape 1 : Type de projet
- Étape 2 : Détails du projet
- Étape 3 : Informations de contact
- Étape 4 : Budget et délais

**Adaptation** : Même structure, champs différents

---

## ✅ Avantages de cette approche

### 1. Réutilisabilité

✅ **Code réutilisable** :

- Structure du parent (WizardPage) : 80% réutilisable
- Composants de navigation : 100% réutilisable
- Fonctions de validation : 70% réutilisable
- Composants d'étapes : Adaptables selon le projet

### 2. Maintenabilité

✅ **Facile à maintenir** :

- Code organisé et modulaire
- Chaque composant a une responsabilité claire
- Facile de trouver et corriger les bugs
- Facile d'ajouter/supprimer des étapes

### 3. Testabilité

✅ **Facile à tester** :

- Chaque composant peut être testé indépendamment
- Les props facilitent les tests unitaires
- La logique métier est séparée de la présentation

### 4. Scalabilité

✅ **Facile d'étendre** :

- Ajouter une étape = créer un nouveau composant
- Modifier une étape = modifier un seul composant
- Pas d'impact sur les autres étapes

### 5. Expérience utilisateur

✅ **Meilleure UX** :

- Processus guidé étape par étape
- Validation progressive
- Possibilité de revenir en arrière
- Feedback visuel clair

---

## 🔧 Comment généraliser le code

### Étape 1 : Créer un composant générique Wizard

```jsx
// components/Wizard/Wizard.jsx - COMPOSANT GÉNÉRIQUE
function Wizard({
  steps, // Tableau des composants d'étapes
  initialData, // Données initiales
  onSubmit, // Fonction de soumission
  validationRules, // Règles de validation
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const nextStep = () => {
    if (validateStep(currentStep, validationRules)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step, rules) => {
    // Validation générique selon les règles
    const stepRules = rules[step - 1];
    // ... logique de validation
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="wizard">
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={steps.length}
        stepLabels={steps.map((s) => s.label)}
      />

      <CurrentStepComponent
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={nextStep}
        onPrev={prevStep}
        onSubmit={onSubmit}
      />
    </div>
  );
}
```

### Étape 2 : Utiliser le Wizard dans votre projet

```jsx
// pages/CommandPage.jsx - UTILISATION DU WIZARD GÉNÉRIQUE
import Wizard from "../components/Wizard/Wizard";
import Step1Informations from "../components/commande/Step1Informations";
import Step2Menu from "../components/commande/Step2Menu";
import Step3Recap from "../components/commande/Step3Recap";

function CommandPage() {
  const steps = [
    {
      label: "Informations",
      component: Step1Informations,
    },
    {
      label: "Menu",
      component: Step2Menu,
    },
    {
      label: "Récapitulatif",
      component: Step3Recap,
    },
  ];

  const initialData = {
    nom: "",
    prenom: "",
    // ... autres champs
  };

  const validationRules = [
    // Règles pour l'étape 1
    { nom: "required", prenom: "required", email: "required|email" },
    // Règles pour l'étape 2
    { menu_id: "required" },
    // Règles pour l'étape 3
    { nombre_personne: "required|min:2" },
  ];

  const handleSubmit = async (formData) => {
    // Logique de soumission
    await createCommand(formData);
  };

  return (
    <Wizard
      steps={steps}
      initialData={initialData}
      validationRules={validationRules}
      onSubmit={handleSubmit}
    />
  );
}
```

### Étape 3 : Réutiliser dans un autre projet

```jsx
// pages/RegisterPage.jsx - MÊME WIZARD, AUTRE PROJET
import Wizard from "../components/Wizard/Wizard";
import Step1PersonalInfo from "../components/register/Step1PersonalInfo";
import Step2Password from "../components/register/Step2Password";
import Step3Preferences from "../components/register/Step3Preferences";

function RegisterPage() {
  const steps = [
    { label: "Informations", component: Step1PersonalInfo },
    { label: "Mot de passe", component: Step2Password },
    { label: "Préférences", component: Step3Preferences },
  ];

  const initialData = {
    nom: "",
    prenom: "",
    email: "",
    password: "",
  };

  // ... même structure, données différentes
}
```

---

## 📊 Comparaison : Code spécifique vs Générique

### Approche spécifique (votre projet actuel)

```jsx
// CommandPage.jsx - Spécifique à la commande
function CommandPage() {
  // Code spécifique à la commande
  const [formData, setFormData] = useState({
    nom: "",
    menu_id: null,
    // ...
  });

  // Validation spécifique
  const validateStep = (step) => {
    if (step === 1) {
      // Validation spécifique étape 1
    }
    // ...
  };
}
```

**Avantages** :

- ✅ Code simple et direct
- ✅ Facile à comprendre pour ce projet
- ✅ Pas de sur-ingénierie

**Inconvénients** :

- ❌ Difficile à réutiliser tel quel
- ❌ Duplication de code si plusieurs wizards

### Approche générique (pour réutilisation)

```jsx
// Wizard.jsx - Générique et réutilisable
function Wizard({ steps, initialData, validationRules, onSubmit }) {
  // Code générique qui fonctionne pour tous les projets
}
```

**Avantages** :

- ✅ Réutilisable dans plusieurs projets
- ✅ Moins de duplication
- ✅ Maintenance centralisée

**Inconvénients** :

- ❌ Plus complexe au début
- ❌ Peut être de la sur-ingénierie pour un seul projet

**Recommandation** : Commencez par l'approche spécifique, puis généralisez si vous avez plusieurs cas d'usage similaires.

---

## 🎯 Checklist de réutilisabilité

Pour déterminer si votre code est réutilisable, vérifiez :

### ✅ Code réutilisable si :

- [ ] La structure est indépendante des données spécifiques
- [ ] Les composants reçoivent des props génériques
- [ ] La logique métier est séparée de la présentation
- [ ] Les fonctions utilitaires sont indépendantes
- [ ] Les styles sont modulaires

### ❌ Code non réutilisable si :

- [ ] Les noms de variables sont spécifiques au projet (ex: `menu_id` partout)
- [ ] La logique métier est mélangée avec la présentation
- [ ] Les composants dépendent de données hardcodées
- [ ] Pas de séparation des responsabilités

---

## 📝 Résumé pour votre rapport

### Points à mentionner

1. **Pattern réutilisable** :

   - Architecture modulaire avec composants indépendants
   - Gestion d'état centralisée dans le parent
   - Communication via props (unidirectionnelle)

2. **Avantages** :

   - Code maintenable et testable
   - Facile d'ajouter/modifier des étapes
   - Réutilisable dans d'autres projets similaires

3. **Adaptabilité** :

   - Même structure pour différents cas d'usage
   - Seules les données et la logique métier changent
   - Composants de navigation 100% réutilisables

4. **Exemples d'applications** :

   - E-commerce (processus de commande)
   - Inscription/Onboarding
   - Réservation de services
   - Configuration de produits

5. **Évolutivité** :
   - Possibilité de créer un composant Wizard générique
   - Réutilisation dans plusieurs projets
   - Maintenance centralisée

---

## 🚀 Conclusion

**Oui, ce pattern est hautement réutilisable !**

Vous pouvez l'utiliser pour :

- ✅ Tous les formulaires multi-étapes
- ✅ Processus de commande/achat
- ✅ Inscription/Onboarding
- ✅ Réservation de services
- ✅ Configuration de produits
- ✅ Tout processus guidé étape par étape

**La clé** : Garder la structure générique et adapter uniquement :

- Les données (`formData`)
- La validation
- La logique métier spécifique
- Les composants d'étapes

Le reste (navigation, gestion d'état, structure) reste identique ! 🎯
