# 📘 Guide Complet : Les Props en React

## 📖 Table des matières

1. [Introduction : Qu'est-ce qu'une prop ?](#introduction)
2. [Concept fondamental](#concept-fondamental)
3. [Syntaxe et utilisation](#syntaxe-et-utilisation)
4. [Types de props](#types-de-props)
5. [Exemples concrets](#exemples-concrets)
6. [Props vs State](#props-vs-state)
7. [Bonnes pratiques](#bonnes-pratiques)
8. [Cas d'usage dans votre projet](#cas-dusage-dans-votre-projet)
9. [Schémas visuels](#schémas-visuels)

---

## 🎯 Introduction : Qu'est-ce qu'une prop ?

### Définition simple

**Une prop (abréviation de "property") est une donnée passée d'un composant parent à un composant enfant en React.**

Pensez-y comme à un **cadeau** que le parent donne à l'enfant :

- Le parent **décide** ce qu'il donne
- L'enfant **reçoit** et **utilise** ce qu'il a reçu
- L'enfant ne peut pas modifier directement ce qu'il a reçu (sauf si c'est une fonction)

### Analogie du monde réel

Imaginez une famille :

- **Parent** (CommandPage) : A toutes les informations de la commande
- **Enfant** (Step1Informations) : A besoin de certaines informations pour afficher le formulaire

Le parent **donne** (passe en props) les informations nécessaires à l'enfant.

---

## 🧠 Concept fondamental

### Le flux de données en React

```
┌─────────────────────────────────────┐
│   COMPOSANT PARENT                  │
│   (CommandPage.jsx)                 │
│                                     │
│   État : formData, setFormData      │
│   ┌─────────────────────────────┐  │
│   │ const [formData, setFormData]│  │
│   │   = useState({...})          │  │
│   └─────────────────────────────┘  │
│            │                        │
│            │ Passe en props         │
│            ▼                        │
│   <Step1Informations                │
│     formData={formData}      ◄──────┼─── PROP 1 : Données
│     setFormData={setFormData}◄──────┼─── PROP 2 : Fonction
│     errors={errors}          ◄──────┼─── PROP 3 : Erreurs
│   />                                │
└─────────────────────────────────────┘
            │
            │ Props reçues
            ▼
┌─────────────────────────────────────┐
│   COMPOSANT ENFANT                   │
│   (Step1Informations.jsx)            │
│                                     │
│   function Step1Informations({      │
│     formData,      ◄─── Reçoit les props
│     setFormData,   ◄─── comme paramètres
│     errors         ◄─── de la fonction
│   }) {                              │
│     // Utilise les props ici        │
│   }                                  │
└─────────────────────────────────────┘
```

### Points clés

1. **Unidirectionnel** : Les props vont toujours du parent vers l'enfant (de haut en bas)
2. **Lecture seule** : L'enfant ne peut pas modifier directement une prop (sauf si c'est une fonction)
3. **Communication** : C'est le moyen principal de communication entre composants

---

## 📝 Syntaxe et utilisation

### 1. Passer des props (dans le composant parent)

```jsx
// Dans CommandPage.jsx
function CommandPage() {
  const [formData, setFormData] = useState({ nom: "", prenom: "" });
  const [errors, setErrors] = useState({ step1: null });

  return (
    <div>
      {/* Syntaxe 1 : Props nommées (recommandée) */}
      <Step1Informations
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />

      {/* Syntaxe 2 : Props avec valeurs directes */}
      <Step1Informations
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        user={user}
        isRequired={true}
        maxLength={50}
      />
    </div>
  );
}
```

**Explication** :

- `formData={formData}` : Nom de la prop = `formData`, valeur = variable `formData`
- `isRequired={true}` : Prop booléenne
- `maxLength={50}` : Prop numérique

### 2. Recevoir des props (dans le composant enfant)

#### Méthode 1 : Destructuration (recommandée)

```jsx
// Dans Step1Informations.jsx
function Step1Informations({ formData, setFormData, errors }) {
  // On peut utiliser directement formData, setFormData, errors
  return (
    <div>
      <input value={formData.nom} />
      {errors.step1 && <p>{errors.step1}</p>}
    </div>
  );
}
```

**Avantages** :

- Code plus propre
- On voit directement quelles props sont utilisées
- Pas besoin d'écrire `props.formData`, juste `formData`

#### Méthode 2 : Objet props

```jsx
// Dans Step1Informations.jsx
function Step1Informations(props) {
  // On accède aux props via props.nomDeLaProp
  return (
    <div>
      <input value={props.formData.nom} />
      {props.errors.step1 && <p>{props.errors.step1}</p>}
    </div>
  );
}
```

**Quand utiliser cette méthode ?**

- Quand vous avez beaucoup de props
- Quand vous voulez passer toutes les props à un composant enfant

---

## 🎨 Types de props

### 1. Props primitives (string, number, boolean)

```jsx
// Parent
<Button
  label="Cliquez ici" // string
  count={5} // number
  isActive={true} // boolean
/>;

// Enfant
function Button({ label, count, isActive }) {
  return (
    <button disabled={!isActive}>
      {label} ({count})
    </button>
  );
}
```

### 2. Props objets

```jsx
// Parent
const user = {
  nom: "Dupont",
  prenom: "Jean",
  email: "jean@example.com",
};

<UserCard user={user} />;

// Enfant
function UserCard({ user }) {
  return (
    <div>
      <h3>
        {user.nom} {user.prenom}
      </h3>
      <p>{user.email}</p>
    </div>
  );
}
```

### 3. Props tableaux

```jsx
// Parent
const menus = [
  { id: 1, titre: "Menu 1" },
  { id: 2, titre: "Menu 2" },
];

<MenuList menus={menus} />;

// Enfant
function MenuList({ menus }) {
  return (
    <ul>
      {menus.map((menu) => (
        <li key={menu.id}>{menu.titre}</li>
      ))}
    </ul>
  );
}
```

### 4. Props fonctions (très important !)

```jsx
// Parent
function CommandPage() {
  const [formData, setFormData] = useState({ nom: "" });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // On passe la fonction en prop
  <Step1Informations
    formData={formData}
    onInputChange={handleChange} // ← Fonction passée en prop
  />;
}

// Enfant
function Step1Informations({ formData, onInputChange }) {
  const handleInput = (e) => {
    // On appelle la fonction reçue en prop
    onInputChange(e.target.name, e.target.value);
  };

  return <input value={formData.nom} onChange={handleInput} />;
}
```

**Pourquoi passer des fonctions en props ?**

- Permet à l'enfant de **communiquer avec le parent**
- L'enfant peut déclencher des actions dans le parent
- Permet de mettre à jour l'état du parent depuis l'enfant

### 5. Props avec valeurs par défaut

```jsx
// Enfant avec valeurs par défaut
function Button({
  label = "Cliquez",      // Valeur par défaut
  color = "blue",         // Valeur par défaut
  onClick
}) {
  return (
    <button
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// Parent - peut omettre certaines props
<Button onClick={handleClick} />  // Utilise les valeurs par défaut
<Button label="Valider" onClick={handleClick} />  // Override label
```

---

## 💡 Exemples concrets

### Exemple 1 : Props simples

```jsx
// Parent : App.jsx
function App() {
  return (
    <div>
      <WelcomeMessage name="Jean" age={25} />
      <WelcomeMessage name="Marie" age={30} />
    </div>
  );
}

// Enfant : WelcomeMessage.jsx
function WelcomeMessage({ name, age }) {
  return (
    <h1>
      Bonjour {name}, vous avez {age} ans
    </h1>
  );
}

// Résultat affiché :
// "Bonjour Jean, vous avez 25 ans"
// "Bonjour Marie, vous avez 30 ans"
```

**Explication** :

- Le parent `App` crée deux instances de `WelcomeMessage`
- Chaque instance reçoit des props différentes
- Le composant enfant affiche les données reçues

### Exemple 2 : Props avec état (votre cas d'usage)

```jsx
// Parent : CommandPage.jsx
function CommandPage() {
  // État géré dans le parent
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
  });

  // Fonction pour mettre à jour l'état
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      {/* On passe l'état ET la fonction de mise à jour */}
      <Step1Informations
        formData={formData} // ← Données
        onUpdate={updateField} // ← Fonction pour modifier
      />
    </div>
  );
}

// Enfant : Step1Informations.jsx
function Step1Informations({ formData, onUpdate }) {
  const handleChange = (e) => {
    // On appelle la fonction du parent pour mettre à jour l'état
    onUpdate(e.target.name, e.target.value);
  };

  return (
    <div>
      <input name="nom" value={formData.nom} onChange={handleChange} />
      <input name="prenom" value={formData.prenom} onChange={handleChange} />
    </div>
  );
}
```

**Flux de données** :

1. L'utilisateur tape dans l'input
2. `handleChange` est appelé dans l'enfant
3. `onUpdate` (fonction du parent) est appelée
4. L'état `formData` est mis à jour dans le parent
5. Le parent re-rend et passe le nouveau `formData` en prop
6. L'enfant reçoit les nouvelles données et se re-rend

### Exemple 3 : Props conditionnelles

```jsx
// Parent
function CommandPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({ step1: null });

  return (
    <div>
      {currentStep === 1 && (
        <Step1Informations
          errors={errors}
          showHelp={true} // Prop conditionnelle
          isRequired={true}
        />
      )}
    </div>
  );
}

// Enfant
function Step1Informations({ errors, showHelp, isRequired }) {
  return (
    <div>
      {showHelp && ( // Utilise la prop conditionnelle
        <p className="help-text">Remplissez tous les champs obligatoires</p>
      )}

      <input required={isRequired} />

      {errors.step1 && <p className="error">{errors.step1}</p>}
    </div>
  );
}
```

---

## ⚖️ Props vs State

### Différences principales

| Aspect          | Props                         | State                                   |
| --------------- | ----------------------------- | --------------------------------------- |
| **Définition**  | Données passées du parent     | Données gérées dans le composant        |
| **Modifiable**  | Non (lecture seule)           | Oui (avec setState)                     |
| **Origine**     | Composant parent              | Composant lui-même                      |
| **Utilisation** | Communication parent → enfant | Données internes du composant           |
| **Exemple**     | `formData={formData}`         | `const [count, setCount] = useState(0)` |

### Quand utiliser Props ?

✅ **Utilisez des props quand** :

- Les données viennent du parent
- Vous voulez partager des données entre composants
- Le composant doit être réutilisable avec différentes données
- Exemple : `Step1Informations` reçoit `formData` du parent

### Quand utiliser State ?

✅ **Utilisez state quand** :

- Les données sont spécifiques au composant
- Les données changent au fil du temps dans le composant
- Le composant doit gérer son propre état interne
- Exemple : `isLoading` dans `Step2Menu` (chargement des menus)

### Exemple combiné

```jsx
// Parent : CommandPage.jsx
function CommandPage() {
  const [formData, setFormData] = useState({ nom: "" }); // State du parent

  return (
    <Step1Informations
      formData={formData}        // ← Prop (vient du parent)
      setFormData={setFormData}  // ← Prop (fonction du parent)
    />
  );
}

// Enfant : Step1Informations.jsx
function Step1Informations({ formData, setFormData }) {
  const [isFocused, setIsFocused] = useState(false); // State de l'enfant

  return (
    <div>
      <input
        value={formData.nom}              // ← Utilise la prop
        onChange={(e) => setFormData(...)} // ← Utilise la prop (fonction)
        onFocus={() => setIsFocused(true)}  // ← Utilise le state local
      />
      {isFocused && <p>Champ actif</p>}    // ← Utilise le state local
    </div>
  );
}
```

**Explication** :

- `formData` et `setFormData` sont des **props** (viennent du parent)
- `isFocused` est un **state** (géré localement dans l'enfant)

---

## ✅ Bonnes pratiques

### 1. Nommer les props de manière claire

```jsx
// ❌ Mauvais
<Component data={x} func={y} />

// ✅ Bon
<Step1Informations
  formData={formData}
  onInputChange={handleInputChange}
  validationErrors={errors}
/>
```

### 2. Utiliser la destructuration

```jsx
// ❌ Moins lisible
function Component(props) {
  return (
    <div>
      {props.name} - {props.age}
    </div>
  );
}

// ✅ Plus lisible
function Component({ name, age }) {
  return (
    <div>
      {name} - {age}
    </div>
  );
}
```

### 3. Valider les props (avec PropTypes ou TypeScript)

```jsx
import PropTypes from "prop-types";

function Step1Informations({ formData, setFormData, errors }) {
  // ...
}

// Validation des props
Step1Informations.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.object,
};
```

### 4. Fournir des valeurs par défaut

```jsx
function Button({ label = "Cliquez", onClick, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

### 5. Ne pas modifier les props directement

```jsx
// ❌ Mauvais - Ne modifiez jamais les props directement
function Component({ user }) {
  user.name = "Nouveau nom"; // ❌ ERREUR !
  return <div>{user.name}</div>;
}

// ✅ Bon - Utilisez une fonction pour modifier
function Component({ user, onUpdateUser }) {
  const handleChange = () => {
    onUpdateUser({ ...user, name: "Nouveau nom" });
  };
  return <button onClick={handleChange}>Modifier</button>;
}
```

---

## 🎯 Cas d'usage dans votre projet

### Cas 1 : Step1Informations

```jsx
// CommandPage.jsx (Parent)
function CommandPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    // ...
  });

  return (
    <Step1Informations
      formData={formData} // Prop : données du formulaire
      setFormData={setFormData} // Prop : fonction pour mettre à jour
      errors={errors} // Prop : erreurs de validation
      user={user} // Prop : données utilisateur
    />
  );
}

// Step1Informations.jsx (Enfant)
function Step1Informations({ formData, setFormData, errors, user }) {
  // Utilise les props reçues
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return <input value={formData.nom} onChange={handleChange} />;
}
```

**Pourquoi cette structure ?**

- `CommandPage` gère l'état global de la commande
- `Step1Informations` est un composant "présentationnel" (affiche et collecte les données)
- Les données remontent au parent via `setFormData`

### Cas 2 : Step2Menu avec callback

```jsx
// CommandPage.jsx (Parent)
function CommandPage() {
  const [formData, setFormData] = useState({ menu: null });

  const handleMenuSelect = (menu) => {
    setFormData((prev) => ({
      ...prev,
      menu: menu,
      menu_id: menu.menu_id,
    }));
    setCurrentStep(3); // Passe à l'étape suivante
  };

  return (
    <Step2Menu
      formData={formData}
      setFormData={setFormData}
      onMenuSelect={handleMenuSelect} // ← Callback pour sélection
    />
  );
}

// Step2Menu.jsx (Enfant)
function Step2Menu({ formData, setFormData, onMenuSelect }) {
  return (
    <div>
      {menus.map((menu) => (
        <div
          key={menu.menu_id}
          onClick={() => onMenuSelect(menu)} // ← Appelle la fonction du parent
        >
          {menu.titre}
        </div>
      ))}
    </div>
  );
}
```

**Flux** :

1. L'utilisateur clique sur un menu dans `Step2Menu`
2. `onMenuSelect(menu)` est appelé (fonction du parent)
3. Le parent met à jour `formData` et change d'étape
4. Le parent re-rend et passe les nouvelles données en props

### Cas 3 : Step3Recap avec calcul de prix

```jsx
// CommandPage.jsx (Parent)
function CommandPage() {
  const [formData, setFormData] = useState({
    nombre_personne: null,
    prix_menu: 0,
    prix_livraison: 0,
    prix_total: 0,
  });

  const calculateAllPrices = (nombrePersonnes) => {
    // Calculs...
    setFormData((prev) => ({
      ...prev,
      nombre_personne: nombrePersonnes,
      prix_menu: prixMenu,
      prix_total: prixTotal,
    }));
  };

  return (
    <Step3Recap
      formData={formData}
      setFormData={setFormData}
      onCalculatePrice={calculateAllPrices} // ← Fonction de calcul
    />
  );
}

// Step3Recap.jsx (Enfant)
function Step3Recap({ formData, setFormData, onCalculatePrice }) {
  const handleNombreChange = (e) => {
    const nombre = parseInt(e.target.value);
    setFormData((prev) => ({ ...prev, nombre_personne: nombre }));
    onCalculatePrice(nombre); // ← Appelle la fonction du parent
  };

  return (
    <input
      type="number"
      value={formData.nombre_personne}
      onChange={handleNombreChange}
    />
  );
}
```

---

## 📊 Schémas visuels

### Schéma 1 : Flux de données unidirectionnel

```
┌─────────────────────────────────────────┐
│         COMMAND PAGE (Parent)           │
│                                         │
│  État : formData = {                    │
│    nom: "Jean",                        │
│    prenom: "Dupont"                    │
│  }                                      │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ <Step1Informations               │  │
│  │   formData={formData}            │  │
│  │   setFormData={setFormData}      │  │
│  │ />                               │  │
│  └──────────────────────────────────┘  │
│            │                            │
│            │ Props descendantes         │
│            ▼                            │
└─────────────────────────────────────────┘
            │
            │
┌───────────▼───────────────────────────┐
│    STEP1INFORMATIONS (Enfant)         │
│                                       │
│  Reçoit :                             │
│  - formData = { nom: "Jean", ... }   │
│  - setFormData = fonction             │
│                                       │
│  Utilise :                             │
│  - formData.nom pour afficher         │
│  - setFormData pour mettre à jour     │
└───────────────────────────────────────┘
```

### Schéma 2 : Communication parent ↔ enfant

```
┌──────────────────────────────────────┐
│         PARENT                        │
│                                       │
│  État : count = 5                     │
│  Fonction : incrementCount()          │
│                                       │
│  ┌────────────────────────────────┐  │
│  │ <Child                         │  │
│  │   count={count}                │  │ ← Prop descendante
│  │   onIncrement={incrementCount}  │  │ ← Fonction descendante
│  │ />                             │  │
│  └────────────────────────────────┘  │
│                                       │
│  incrementCount() appelé              │ ← Appel montant
│  count mis à jour : 6                │
└──────────────────────────────────────┘
            │
            │ Props
            ▼
┌──────────────────────────────────────┐
│         ENFANT                        │
│                                       │
│  Reçoit :                             │
│  - count = 5                          │
│  - onIncrement = fonction             │
│                                       │
│  <button                              │
│    onClick={() => onIncrement()}     │ ← Appelle la fonction
│  >                                    │
│    Compteur : {count}                │ ← Affiche la prop
│  </button>                            │
└──────────────────────────────────────┘
```

### Schéma 3 : Hiérarchie de composants

```
                    App
                     │
        ┌────────────┼────────────┐
        │            │            │
    CommandPage   HomePage   LoginPage
        │
    ┌───┴───┬───────────┐
    │       │           │
Step1    Step2      Step3
    │       │           │
    └───┬───┴───────────┘
        │
    formData (props partagées)
```

---

## 🎓 Résumé pour votre rapport

### Points clés à mentionner

1. **Définition** :

   - Les props sont des données passées d'un composant parent à un composant enfant
   - C'est le mécanisme principal de communication entre composants en React

2. **Caractéristiques** :

   - Unidirectionnel : flux parent → enfant
   - Lecture seule : l'enfant ne peut pas modifier directement une prop
   - Permet la réutilisabilité des composants

3. **Dans votre projet** :

   - `CommandPage` (parent) gère l'état global (`formData`)
   - Les composants d'étapes (enfants) reçoivent les données en props
   - Les fonctions de mise à jour sont passées en props pour permettre la communication montante

4. **Avantages** :

   - Séparation des responsabilités
   - Composants réutilisables
   - Code plus maintenable
   - Testabilité facilitée

5. **Exemple concret** :

   ```jsx
   // Parent gère l'état
   const [formData, setFormData] = useState({ nom: "" });

   // Passe en props à l'enfant
   <Step1Informations formData={formData} setFormData={setFormData} />;

   // Enfant utilise les props
   function Step1Informations({ formData, setFormData }) {
     return <input value={formData.nom} />;
   }
   ```

---

## 📚 Ressources supplémentaires

### Concepts liés à approfondir

1. **Lifting State Up** : Remonter l'état au composant parent
2. **Prop Drilling** : Passer des props à travers plusieurs niveaux
3. **Context API** : Alternative aux props pour éviter le prop drilling
4. **Composition vs Props** : Utiliser `children` comme prop spéciale

### Pour aller plus loin

- **PropTypes** : Validation des types de props
- **TypeScript** : Typage statique des props
- **Default Props** : Valeurs par défaut
- **Render Props** : Pattern avancé de partage de code

---

## ✅ Checklist de compréhension

- [ ] Je comprends ce qu'est une prop
- [ ] Je sais comment passer des props du parent à l'enfant
- [ ] Je sais comment recevoir des props dans un composant enfant
- [ ] Je comprends la différence entre props et state
- [ ] Je sais quand utiliser des props vs state
- [ ] Je comprends comment passer des fonctions en props
- [ ] Je connais les bonnes pratiques pour les props

---

**Ce guide vous donne une base solide sur les props en React. N'hésitez pas à revenir vers moi si vous avez des questions spécifiques !** 🚀
