# 🧩 Guide : Développement des Composants de Commande

## 📋 Ordre de développement recommandé

1. **Step1Informations.jsx** - Formulaire des informations de prestation
2. **Step2Menu.jsx** - Sélection du menu
3. **Step3Recap.jsx** - Nombre de personnes et récapitulatif
4. **Fonctions utilitaires** - Calculs de prix
5. **CommandPage.jsx** - Page principale qui assemble tout

---

## 📝 ÉTAPE 1 : Composant Step1Informations

### 📁 Fichier à créer

`frontend/src/components/commande/Step1Informations.jsx`

### 🎯 **Utilité de ce composant**

Ce composant affiche le formulaire de l'étape 1 où l'utilisateur saisit :

- Ses informations personnelles (nom, prénom, email, téléphone)
- Les détails de la prestation (adresse, date, heure, lieu)

### 💻 **CODE COMPLET DU COMPOSANT**

```jsx
import styles from "../../styles/command/step1Informations.module.css";

/**
 * Composant pour l'étape 1 : Informations de prestation
 *
 * @param {Object} formData - Toutes les données du formulaire
 * @param {Function} setFormData - Fonction pour mettre à jour formData
 * @param {Object} errors - Objet contenant les erreurs de validation
 * @param {Object} user - Informations de l'utilisateur connecté (pour pré-remplissage)
 */
function Step1Informations({ formData, setFormData, errors, user }) {
  /**
   * Fonction appelée quand l'utilisateur modifie un champ
   * Met à jour formData avec la nouvelle valeur
   */
  const handleChange = (e) => {
    const { name, value } = e.target; // Récupère le nom et la valeur du champ modifié

    // Met à jour formData en gardant les autres valeurs intactes
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Met à jour uniquement le champ modifié
    }));
  };

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Étape 1 : Informations de prestation</h2>

      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Vos informations</h3>

        {/* Champ Nom */}
        <div className={styles.formGroup}>
          <label htmlFor="nom" className={styles.label}>
            Nom <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className={styles.input}
            placeholder="Votre nom"
            required
          />
        </div>

        {/* Champ Prénom */}
        <div className={styles.formGroup}>
          <label htmlFor="prenom" className={styles.label}>
            Prénom <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            className={styles.input}
            placeholder="Votre prénom"
            required
          />
        </div>

        {/* Champ Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="votre.email@exemple.com"
            required
          />
        </div>

        {/* Champ Téléphone */}
        <div className={styles.formGroup}>
          <label htmlFor="telephone" className={styles.label}>
            Téléphone <span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className={styles.input}
            placeholder="06 12 34 56 78"
            required
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Détails de la prestation</h3>

        {/* Champ Adresse de prestation */}
        <div className={styles.formGroup}>
          <label htmlFor="adresse_prestation" className={styles.label}>
            Adresse de prestation <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="adresse_prestation"
            name="adresse_prestation"
            value={formData.adresse_prestation}
            onChange={handleChange}
            className={styles.input}
            placeholder="123 Rue de la Paix, 33000 Bordeaux"
            required
          />
          <p className={styles.helpText}>
            Adresse où la livraison doit être effectuée
          </p>
        </div>

        {/* Champ Date de prestation */}
        <div className={styles.formGroup}>
          <label htmlFor="date_prestation" className={styles.label}>
            Date de prestation <span className={styles.required}>*</span>
          </label>
          <input
            type="date"
            id="date_prestation"
            name="date_prestation"
            value={formData.date_prestation}
            onChange={handleChange}
            className={styles.input}
            min={new Date().toISOString().split("T")[0]} // Date minimum = aujourd'hui
            required
          />
          <p className={styles.helpText}>La date doit être dans le futur</p>
        </div>

        {/* Champ Heure de livraison */}
        <div className={styles.formGroup}>
          <label htmlFor="heure_livraison" className={styles.label}>
            Heure de livraison souhaitée{" "}
            <span className={styles.required}>*</span>
          </label>
          <input
            type="time"
            id="heure_livraison"
            name="heure_livraison"
            value={formData.heure_livraison}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <p className={styles.helpText}>
            Heure à laquelle vous souhaitez recevoir la commande
          </p>
        </div>

        {/* Champ Lieu de livraison (optionnel) */}
        <div className={styles.formGroup}>
          <label htmlFor="lieu_livraison" className={styles.label}>
            Lieu de livraison
          </label>
          <input
            type="text"
            id="lieu_livraison"
            name="lieu_livraison"
            value={formData.lieu_livraison}
            onChange={handleChange}
            className={styles.input}
            placeholder="Domicile, Bureau, Événement..."
          />
          <p className={styles.helpText}>Précision sur le lieu (optionnel)</p>
        </div>
      </div>

      {/* Affichage des erreurs de validation */}
      {errors.step1 && (
        <div className={styles.errorMessage}>
          <strong>⚠️ Erreur :</strong> {errors.step1}
        </div>
      )}
    </div>
  );
}

export default Step1Informations;
```

---

### 📚 **EXPLICATIONS DÉTAILLÉES DE LA LOGIQUE**

#### **1. Structure du composant**

**Props reçues** :

- `formData` : Objet contenant toutes les données du formulaire (nom, prénom, email, etc.). Ces données sont gérées par le composant parent `CommandPage.jsx`
- `setFormData` : Fonction pour mettre à jour `formData`. Cette fonction vient du parent et permet de modifier l'état partagé
- `errors` : Objet contenant les messages d'erreur de validation (ex: `{ step1: "Champs requis manquants" }`)
- `user` : Objet utilisateur connecté (peut être utilisé pour pré-remplir les champs, mais ce sera fait dans `CommandPage.jsx`)

**Pourquoi cette structure ?**

- Le composant est "contrôlé" : il ne gère pas son propre état, il reçoit les données et les fonctions de mise à jour du parent
- Cela permet à `CommandPage.jsx` d'avoir une vue complète de toutes les données du formulaire
- Les erreurs sont gérées au niveau parent pour une validation centralisée

---

#### **2. Fonction `handleChange`**

```jsx
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
```

**Comment ça fonctionne ?**

1. **`e.target`** : L'élément HTML qui a déclenché l'événement (l'input sur lequel l'utilisateur tape)
2. **`const { name, value } = e.target`** : Déstructuration pour récupérer :
   - `name` : L'attribut `name` de l'input (ex: "nom", "prenom", "email")
   - `value` : La nouvelle valeur saisie par l'utilisateur
3. **`setFormData((prev) => ...)`** : Utilise la fonction de mise à jour avec une fonction callback
   - `prev` : L'état actuel de `formData`
   - `{ ...prev, [name]: value }` : Crée un nouvel objet en :
     - Copiant toutes les propriétés existantes (`...prev`)
     - Mettant à jour uniquement la propriété correspondant au `name` avec la nouvelle `value`

**Exemple concret** :

- Si l'utilisateur tape "Dupont" dans le champ `name="nom"`
- `name = "nom"` et `value = "Dupont"`
- Le nouvel état sera : `{ ...formData, nom: "Dupont" }`
- Toutes les autres propriétés (prenom, email, etc.) restent inchangées

**Pourquoi cette approche ?**

- React nécessite de créer un nouvel objet pour détecter les changements (immutabilité)
- On ne modifie jamais directement `formData`, on crée toujours une nouvelle version
- Cela permet à React de savoir qu'il doit re-rendre le composant

---

#### **3. Structure JSX - Champs du formulaire**

**Section "Vos informations"** :

Chaque champ suit le même pattern :

```jsx
<div className={styles.formGroup}>
  <label htmlFor="nom" className={styles.label}>
    Nom <span className={styles.required}>*</span>
  </label>
  <input
    type="text"
    id="nom"
    name="nom"
    value={formData.nom}
    onChange={handleChange}
    className={styles.input}
    placeholder="Votre nom"
    required
  />
</div>
```

**Explication de chaque attribut** :

- **`htmlFor="nom"`** : Lie le label à l'input (accessibilité). Quand on clique sur le label, l'input reçoit le focus
- **`<span className={styles.required}>*</span>`** : Astérisque visuel pour indiquer les champs obligatoires
- **`type="text"`** : Type d'input (texte, email, tel, date, time selon le champ)
- **`id="nom"`** : Identifiant unique (doit correspondre au `htmlFor` du label)
- **`name="nom"`** : ⚠️ **CRUCIAL** : Doit correspondre exactement à une clé de `formData` (nom, prenom, email, etc.)
- **`value={formData.nom}`** : Valeur actuelle du champ (contrôlée par React). Le champ affiche toujours la valeur de `formData.nom`
- **`onChange={handleChange}`** : Fonction appelée à chaque modification. Met à jour `formData` automatiquement
- **`required`** : Attribut HTML pour la validation native du navigateur

**Types d'inputs utilisés** :

- `type="text"` : Pour nom, prénom, adresse, lieu
- `type="email"` : Pour email (validation native du format email)
- `type="tel"` : Pour téléphone (sur mobile, affiche le clavier numérique)
- `type="date"` : Pour date (affiche un sélecteur de date natif)
- `type="time"` : Pour heure (affiche un sélecteur d'heure natif)

**Champ date - Particularité importante** :

```jsx
min={new Date().toISOString().split("T")[0]}
```

- `new Date()` : Date actuelle
- `.toISOString()` : Convertit en format ISO (ex: "2025-12-07T14:30:00.000Z")
- `.split("T")[0]` : Prend seulement la partie date (ex: "2025-12-07")
- `min={...}` : Empêche de sélectionner une date passée dans le sélecteur natif

---

#### **4. Affichage des erreurs**

```jsx
{
  errors.step1 && (
    <div className={styles.errorMessage}>
      <strong>⚠️ Erreur :</strong> {errors.step1}
    </div>
  );
}
```

**Comment ça fonctionne ?**

- **`{errors.step1 && ...}`** : Affichage conditionnel
  - Si `errors.step1` existe et n'est pas `null`, affiche le message
  - Si `errors.step1` est `null` ou `undefined`, n'affiche rien
- **`errors.step1`** : Message d'erreur défini dans `CommandPage.jsx` lors de la validation
- Le message est affiché en bas du formulaire pour être visible

**Quand les erreurs sont définies ?**

- Dans la fonction `nextStep()` de `CommandPage.jsx`
- Si la validation échoue (champs manquants, date invalide, etc.)
- `setErrors({ step1: "Message d'erreur" })` est appelé

---

#### **5. Organisation du code**

**Pourquoi deux sections (`formSection`) ?**

- **Section 1** : Informations personnelles (nom, prénom, email, téléphone)
- **Section 2** : Détails de la prestation (adresse, date, heure, lieu)

Cela améliore l'UX en groupant les champs logiquement.

**Textes d'aide (`helpText`)** :

- Fournissent des indications à l'utilisateur
- Expliquent ce qui est attendu dans chaque champ
- Améliorent l'accessibilité et l'expérience utilisateur

---

## 📝 ÉTAPE 2 : Composant Step2Menu

### 📁 Fichier à créer

`frontend/src/components/commande/Step2Menu.jsx`

### 🎯 **Utilité de ce composant**

Ce composant permet de :

- Afficher le menu pré-sélectionné (si l'utilisateur vient depuis MenuDetailPage)
- Ou afficher une liste de menus disponibles pour sélection

### 💻 **CODE COMPLET DU COMPOSANT**

```jsx
import { useState, useEffect } from "react";
import { getPublicMenus } from "../../services/menusService";
import styles from "../../styles/command/step2Menu.module.css";

/**
 * Composant pour l'étape 2 : Sélection du menu
 *
 * @param {Object} formData - Contient menu_id et menu
 * @param {Function} setFormData - Pour mettre à jour le menu sélectionné
 * @param {Function} onMenuSelect - Callback appelé quand un menu est sélectionné
 */
function Step2Menu({ formData, setFormData, onMenuSelect }) {
  const [menus, setMenus] = useState([]); // Liste de tous les menus disponibles
  const [isLoading, setIsLoading] = useState(false); // État de chargement

  /**
   * useEffect : Charger la liste des menus si aucun menu n'est pré-sélectionné
   * S'exécute au montage du composant et si formData.menu change
   */
  useEffect(() => {
    // Si un menu est déjà sélectionné, ne rien faire
    if (formData.menu) {
      return;
    }

    // Sinon, charger la liste des menus disponibles
    const loadMenus = async () => {
      try {
        setIsLoading(true);
        const menusList = await getPublicMenus();
        setMenus(menusList);
      } catch (error) {
        console.error("Erreur lors du chargement des menus :", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenus();
  }, [formData.menu]); // Dépendance : si formData.menu change, re-exécuter

  // Si un menu est déjà sélectionné, afficher ses détails
  if (formData.menu) {
    return (
      <div className={styles.menuSelected}>
        <h2 className={styles.stepTitle}>Étape 2 : Menu sélectionné</h2>

        <div className={styles.menuCard}>
          <h3 className={styles.menuTitle}>{formData.menu.titre}</h3>

          {formData.menu.galerie_images &&
            formData.menu.galerie_images.length > 0 && (
              <img
                src={formData.menu.galerie_images[0]}
                alt={formData.menu.titre}
                className={styles.menuImage}
              />
            )}

          <p className={styles.menuDescription}>{formData.menu.description}</p>

          <div className={styles.menuInfo}>
            <p className={styles.menuPrice}>
              <strong>Prix :</strong> {formData.menu.prix_par_personne}
              €/personne
            </p>
            <p className={styles.menuMin}>
              <strong>Minimum :</strong> {formData.menu.nombre_personne_minimum}{" "}
              personne(s)
            </p>
            <p className={styles.menuTotal}>
              <strong>Prix minimum :</strong> {formData.menu.prix_total_minimum}€
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              // Permettre de changer de menu
              setFormData((prev) => ({
                ...prev,
                menu: null,
                menu_id: null,
              }));
            }}
            className={styles.changeButton}
          >
            Changer de menu
          </button>
        </div>
      </div>
    );
  }

  // Si aucun menu n'est sélectionné, afficher la liste
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Chargement des menus...</p>
      </div>
    );
  }

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Étape 2 : Sélectionnez un menu</h2>

      <div className={styles.menusList}>
        {menus.length === 0 ? (
          <p className={styles.noMenus}>Aucun menu disponible</p>
        ) : (
          menus.map((menu) => (
            <div
              key={menu.menu_id}
              className={styles.menuCard}
              onClick={() => onMenuSelect(menu)} // Appelle la fonction callback
            >
              {menu.galerie_images && menu.galerie_images.length > 0 && (
                <img
                  src={menu.galerie_images[0]}
                  alt={menu.titre}
                  className={styles.menuImage}
                />
              )}

              <div className={styles.menuContent}>
                <h3 className={styles.menuTitle}>{menu.titre}</h3>
                <p className={styles.menuDescription}>{menu.description}</p>

                <div className={styles.menuInfo}>
                  <span className={styles.menuPrice}>
                    {menu.prix_par_personne}€/personne
                  </span>
                  <span className={styles.menuMin}>
                    Min. {menu.nombre_personne_minimum} pers.
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Step2Menu;
```

---

### 📚 **EXPLICATIONS DÉTAILLÉES DE LA LOGIQUE**

#### **1. États du composant**

```jsx
const [menus, setMenus] = useState([]);
const [isLoading, setIsLoading] = useState(false);
```

**`menus`** :

- Tableau vide initialement `[]`
- Contiendra la liste de tous les menus disponibles
- Rempli par l'appel API `getPublicMenus()`

**`isLoading`** :

- Booléen pour gérer l'état de chargement
- `true` pendant le chargement des menus
- `false` une fois le chargement terminé (succès ou erreur)
- Permet d'afficher un message "Chargement..." à l'utilisateur

---

#### **2. useEffect - Chargement des menus**

```jsx
useEffect(() => {
  if (formData.menu) {
    return; // Si menu déjà sélectionné, ne rien faire
  }

  const loadMenus = async () => {
    try {
      setIsLoading(true);
      const menusList = await getPublicMenus();
      setMenus(menusList);
    } catch (error) {
      console.error("Erreur lors du chargement des menus :", error);
    } finally {
      setIsLoading(false);
    }
  };

  loadMenus();
}, [formData.menu]);
```

**Comment ça fonctionne ?**

1. **Condition de sortie** : Si `formData.menu` existe déjà (menu pré-sélectionné), on ne charge pas la liste
2. **Fonction asynchrone** : `loadMenus` est `async` car `getPublicMenus()` retourne une Promise
3. **Gestion du chargement** :
   - `setIsLoading(true)` : Démarre le chargement
   - `setIsLoading(false)` : Dans le `finally`, s'exécute toujours (succès ou erreur)
4. **Gestion des erreurs** : `try/catch` pour capturer les erreurs réseau ou API
5. **Dépendance `[formData.menu]`** : Le `useEffect` se ré-exécute si `formData.menu` change

**Pourquoi cette logique ?**

- Si l'utilisateur vient depuis `MenuDetailPage`, le menu est déjà dans `formData.menu`
- Pas besoin de charger tous les menus dans ce cas
- Si l'utilisateur accède directement à la page de commande, on charge la liste

---

#### **3. Affichage conditionnel - Menu pré-sélectionné**

```jsx
if (formData.menu) {
  return (
    // Affiche les détails du menu
  );
}
```

**Logique** :

- Si `formData.menu` existe, on affiche directement ses détails
- Pas besoin de sélection, le menu est déjà choisi
- Bouton "Changer de menu" pour permettre de revenir à la liste

**Bouton "Changer de menu"** :

```jsx
onClick={() => {
  setFormData((prev) => ({
    ...prev,
    menu: null,
    menu_id: null,
  }));
}}
```

- Réinitialise `menu` et `menu_id` à `null`
- Le composant détecte le changement et affiche la liste des menus
- L'utilisateur peut alors choisir un autre menu

---

#### **4. Affichage conditionnel - Liste des menus**

**État de chargement** :

```jsx
if (isLoading) {
  return <div className={styles.loading}>Chargement des menus...</div>;
}
```

- Affiche un message pendant le chargement
- Améliore l'UX en donnant un feedback visuel

**Liste des menus** :

```jsx
{
  menus.length === 0 ? (
    <p className={styles.noMenus}>Aucun menu disponible</p>
  ) : (
    menus.map((menu) => (
      <div key={menu.menu_id} onClick={() => onMenuSelect(menu)}>
        {/* Contenu de la carte menu */}
      </div>
    ))
  );
}
```

**Logique** :

- Si `menus.length === 0` : Aucun menu disponible (cas rare)
- Sinon : Parcourt la liste avec `.map()` et crée une carte pour chaque menu

**`.map()` - Rendu de liste** :

```jsx
menus.map((menu) => (
  <div key={menu.menu_id} ...>
```

- `menus.map()` : Parcourt chaque élément du tableau
- `(menu) => ...` : Pour chaque menu, crée un élément JSX
- `key={menu.menu_id}` : ⚠️ **OBLIGATOIRE** en React pour les listes
  - Aide React à identifier chaque élément
  - Améliore les performances lors des mises à jour

**Clic sur un menu** :

```jsx
onClick={() => onMenuSelect(menu)}
```

- Quand l'utilisateur clique sur une carte menu
- Appelle la fonction `onMenuSelect` passée en prop
- Passe l'objet `menu` complet en paramètre
- Cette fonction est définie dans `CommandPage.jsx` et met à jour `formData`

---

#### **5. Structure des données du menu**

Le composant attend un objet `menu` avec ces propriétés :

- `menu_id` : Identifiant unique
- `titre` : Titre du menu
- `description` : Description du menu
- `prix_par_personne` : Prix par personne
- `nombre_personne_minimum` : Nombre minimum de personnes
- `prix_total_minimum` : Prix minimum total
- `galerie_images` : Tableau d'images (utilise la première)

---

## 📝 ÉTAPE 3 : Composant Step3Recap

### 📁 Fichier à créer

`frontend/src/components/commande/Step3Recap.jsx`

### 🎯 **Utilité de ce composant**

Ce composant permet de :

- Saisir le nombre de personnes
- Afficher le récapitulatif des prix (menu + livraison + total)
- Afficher la réduction si applicable

### 💻 **CODE COMPLET DU COMPOSANT**

```jsx
import styles from "../../styles/command/step3Recap.module.css";

/**
 * Composant pour l'étape 3 : Nombre de personnes et récapitulatif
 *
 * @param {Object} formData - Contient menu, nombre_personne, et tous les prix
 * @param {Function} setFormData - Pour mettre à jour le nombre de personnes
 * @param {Function} onCalculatePrice - Fonction pour recalculer les prix
 * @param {Object} errors - Objet contenant les erreurs de validation
 */
function Step3Recap({ formData, setFormData, onCalculatePrice, errors }) {
  /**
   * Fonction appelée quand l'utilisateur change le nombre de personnes
   */
  const handleNombreChange = (e) => {
    const nombre =
      parseInt(e.target.value) || formData.menu?.nombre_personne_minimum || 1;

    // Mettre à jour le nombre de personnes
    setFormData((prev) => ({
      ...prev,
      nombre_personne: nombre,
    }));

    // Recalculer les prix automatiquement
    if (onCalculatePrice) {
      onCalculatePrice(nombre);
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>
        Étape 3 : Nombre de personnes et récapitulatif
      </h2>

      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label htmlFor="nombre_personne" className={styles.label}>
            Nombre de personnes <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="nombre_personne"
            name="nombre_personne"
            min={formData.menu?.nombre_personne_minimum || 1}
            value={
              formData.nombre_personne ||
              formData.menu?.nombre_personne_minimum ||
              1
            }
            onChange={handleNombreChange}
            className={styles.input}
            required
          />
          <p className={styles.helpText}>
            Minimum : {formData.menu?.nombre_personne_minimum || 1} personne(s)
          </p>
        </div>
      </div>

      <div className={styles.recapSection}>
        <h3 className={styles.recapTitle}>Récapitulatif de votre commande</h3>

        {/* Détails du menu */}
        <div className={styles.menuDetails}>
          <h4>{formData.menu?.titre}</h4>
          <p>{formData.menu?.description}</p>
        </div>

        {/* Récapitulatif des prix */}
        <div className={styles.pricesList}>
          {/* Prix du menu */}
          <div className={styles.priceLine}>
            <span className={styles.priceLabel}>
              Prix du menu (
              {formData.nombre_personne ||
                formData.menu?.nombre_personne_minimum ||
                1}{" "}
              personne(s))
            </span>
            <span className={styles.priceValue}>
              {formData.prix_menu.toFixed(2)}€
            </span>
          </div>

          {/* Réduction si applicable */}
          {formData.reduction_appliquee && (
            <div className={styles.reduction}>
              <span className={styles.reductionLabel}>
                Réduction de 10% appliquée
              </span>
              <span className={styles.reductionValue}>
                -{(formData.prix_menu / 0.9 - formData.prix_menu).toFixed(2)}€
              </span>
            </div>
          )}

          {/* Prix de livraison */}
          <div className={styles.priceLine}>
            <span className={styles.priceLabel}>Prix de livraison</span>
            <span className={styles.priceValue}>
              {formData.prix_livraison.toFixed(2)}€
            </span>
          </div>

          {/* Séparateur */}
          <div className={styles.separator}></div>

          {/* Total */}
          <div className={`${styles.priceLine} ${styles.total}`}>
            <span className={styles.priceLabel}>Total</span>
            <span className={styles.priceValue}>
              {formData.prix_total.toFixed(2)}€
            </span>
          </div>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {errors.step3 && (
        <div className={styles.errorMessage}>
          <strong>⚠️ Erreur :</strong> {errors.step3}
        </div>
      )}
    </div>
  );
}

export default Step3Recap;
```

---

### 📚 **EXPLICATIONS DÉTAILLÉES DE LA LOGIQUE**

#### **1. Fonction `handleNombreChange`**

```jsx
const handleNombreChange = (e) => {
  const nombre =
    parseInt(e.target.value) || formData.menu?.nombre_personne_minimum || 1;

  setFormData((prev) => ({
    ...prev,
    nombre_personne: nombre,
  }));

  if (onCalculatePrice) {
    onCalculatePrice(nombre);
  }
};
```

**Logique détaillée** :

1. **Récupération de la valeur** :

   - `e.target.value` : Valeur saisie (string)
   - `parseInt(...)` : Convertit en nombre
   - `|| formData.menu?.nombre_personne_minimum || 1` : Valeur par défaut si vide ou invalide
     - Si `parseInt` retourne `NaN` ou `0`, utilise le minimum du menu
     - Si le menu n'existe pas, utilise `1`

2. **Mise à jour de `formData`** :

   - Met à jour `nombre_personne` avec la nouvelle valeur
   - Les autres propriétés restent inchangées

3. **Recalcul automatique des prix** :
   - Appelle `onCalculatePrice(nombre)` si la fonction existe
   - Cette fonction est définie dans `CommandPage.jsx`
   - Recalcule tous les prix (menu, livraison, total) en temps réel

**Pourquoi recalculer automatiquement ?**

- L'utilisateur voit immédiatement l'impact du changement de nombre de personnes
- Meilleure UX : pas besoin de cliquer sur un bouton "Calculer"

---

#### **2. Input nombre de personnes**

```jsx
<input
  type="number"
  min={formData.menu?.nombre_personne_minimum || 1}
  value={
    formData.nombre_personne || formData.menu?.nombre_personne_minimum || 1
  }
  onChange={handleNombreChange}
/>
```

**Attributs importants** :

- **`type="number"`** : Input numérique (sur mobile, affiche le clavier numérique)
- **`min={...}`** : Valeur minimum selon le menu
  - Empêche de saisir un nombre inférieur au minimum
  - Validation HTML native
- **`value={...}`** : Valeur actuelle avec fallback
  - Si `nombre_personne` existe, l'utilise
  - Sinon, utilise le minimum du menu
  - Sinon, utilise `1`
- **Opérateur `?.` (optional chaining)** :
  - `formData.menu?.nombre_personne_minimum`
  - Si `menu` est `null` ou `undefined`, retourne `undefined` au lieu de générer une erreur
  - Évite les erreurs si le menu n'est pas encore chargé

---

#### **3. Récapitulatif des prix**

**Structure** :

```jsx
<div className={styles.pricesList}>
  {/* Prix du menu */}
  <div className={styles.priceLine}>...</div>

  {/* Réduction si applicable */}
  {formData.reduction_appliquee && <div>...</div>}

  {/* Prix de livraison */}
  <div className={styles.priceLine}>...</div>

  {/* Total */}
  <div className={`${styles.priceLine} ${styles.total}`}>...</div>
</div>
```

**Affichage des prix** :

```jsx
{formData.prix_menu.toFixed(2)}€
```

- **`.toFixed(2)`** : Formate le nombre avec 2 décimales
  - Exemple : `25.5` devient `"25.50"`
  - Exemple : `100` devient `"100.00"`
- Toujours afficher les prix avec 2 décimales pour la cohérence

**Affichage conditionnel de la réduction** :

```jsx
{
  formData.reduction_appliquee && (
    <div className={styles.reduction}>
      Réduction de 10% appliquée -
      {(formData.prix_menu / 0.9 - formData.prix_menu).toFixed(2)}€
    </div>
  );
}
```

**Calcul de la réduction affichée** :

- `formData.prix_menu` : Prix après réduction (ex: 90€)
- `formData.prix_menu / 0.9` : Prix avant réduction (ex: 100€)
- `(prix_avant - prix_apres)` : Montant de la réduction (ex: 10€)

**Pourquoi cette formule ?**

- Si on a appliqué une réduction de 10%, le prix actuel = prix_initial × 0.9
- Pour retrouver le prix initial : prix_actuel / 0.9
- La réduction = prix_initial - prix_actuel

**Séparateur visuel** :

```jsx
<div className={styles.separator}></div>
```

- Ligne visuelle pour séparer les détails du total
- Améliore la lisibilité

**Total mis en évidence** :

```jsx
<div className={`${styles.priceLine} ${styles.total}`}>
```

- Deux classes CSS : `priceLine` (style de base) + `total` (style spécial)
- Permet de mettre en évidence le total (gras, plus grand, couleur différente)

---

#### **4. Gestion des valeurs par défaut**

**Pattern utilisé partout** :

```jsx
formData.nombre_personne || formData.menu?.nombre_personne_minimum || 1;
```

**Logique** :

1. Essaie d'utiliser `nombre_personne` si défini
2. Sinon, utilise le minimum du menu
3. Sinon, utilise `1` comme dernière option

**Pourquoi cette approche ?**

- Évite les erreurs si les données ne sont pas encore chargées
- Assure qu'il y a toujours une valeur valide à afficher
- Meilleure résilience du code

---

## 📝 ÉTAPE 4 : Fonctions utilitaires de calcul

### 📁 Fichier à créer (optionnel)

Ces fonctions peuvent être dans `CommandPage.jsx` ou dans un fichier séparé `frontend/src/utils/priceCalculations.js`

### 🎯 **Utilité de ces fonctions**

Calculer automatiquement :

- Le prix du menu selon le nombre de personnes
- La réduction de 10% si applicable
- Le prix de livraison selon l'adresse
- Le total

### 💻 **CODE COMPLET DES FONCTIONS**

```javascript
/**
 * Calcule le prix du menu avec application de la réduction si applicable
 *
 * @param {number} nombrePersonnes - Nombre de personnes
 * @param {Object} menu - Objet menu avec prix_par_personne et nombre_personne_minimum
 * @returns {Object} { prixMenu, reductionAppliquee }
 */
const calculatePrixMenu = (nombrePersonnes, menu) => {
  // Vérifier que les paramètres sont valides
  if (!menu || !nombrePersonnes || !menu.prix_par_personne) {
    return { prixMenu: 0, reductionAppliquee: false };
  }

  // Calcul du prix de base
  let prixMenu = menu.prix_par_personne * nombrePersonnes;
  let reductionAppliquee = false;

  // Vérifier si la réduction de 10% s'applique
  // Condition : nombre_personnes >= nombre_personne_minimum + 5
  if (nombrePersonnes >= menu.nombre_personne_minimum + 5) {
    prixMenu = prixMenu * 0.9; // Réduction de 10%
    reductionAppliquee = true;
  }

  return { prixMenu, reductionAppliquee };
};

/**
 * Calcule le prix de livraison selon l'adresse
 *
 * @param {string} adressePrestation - Adresse de la prestation
 * @param {Object} user - Objet utilisateur avec ville et adresse_postals
 * @returns {number} Prix de livraison en euros
 */
const calculatePrixLivraison = (adressePrestation, user) => {
  // Vérifier que les paramètres sont valides
  if (!adressePrestation || !user) {
    return 0;
  }

  // Vérifier si livraison hors Bordeaux
  // Condition : ville !== "Bordeaux" OU adresse différente de l'adresse du compte
  const isHorsBordeaux =
    user.ville !== "Bordeaux" || adressePrestation !== user.adresse_postals;

  if (isHorsBordeaux) {
    // Pour l'instant, 5€ de base
    // TODO: Ajouter le calcul de distance si nécessaire
    // prixLivraison = 5.00 + (0.59 * distance_km)
    return 5.0;
  }

  // Livraison gratuite à Bordeaux
  return 0;
};

/**
 * Calcule tous les prix et met à jour formData
 *
 * @param {Object} formData - Données du formulaire
 * @param {Object} user - Utilisateur connecté
 * @param {Function} setFormData - Fonction pour mettre à jour formData
 */
const calculateAllPrices = (formData, user, setFormData) => {
  const { menu, nombre_personne, adresse_prestation } = formData;

  // Vérifier que les données nécessaires sont présentes
  if (!menu || !nombre_personne) {
    return;
  }

  // Calcul prix menu
  const { prixMenu, reductionAppliquee } = calculatePrixMenu(
    nombre_personne,
    menu
  );

  // Calcul prix livraison
  const prixLivraison = calculatePrixLivraison(adresse_prestation, user);

  // Calcul total
  const prixTotal = prixMenu + prixLivraison;

  // Mettre à jour formData avec les nouveaux prix
  setFormData((prev) => ({
    ...prev,
    prix_menu: prixMenu,
    prix_livraison: prixLivraison,
    prix_total: prixTotal,
    reduction_appliquee: reductionAppliquee,
  }));
};
```

---

### 📚 **EXPLICATIONS DÉTAILLÉES DE LA LOGIQUE**

#### **1. Fonction `calculatePrixMenu`**

**Paramètres** :

- `nombrePersonnes` : Nombre de personnes (number)
- `menu` : Objet menu avec `prix_par_personne` et `nombre_personne_minimum`

**Logique** :

1. **Validation des paramètres** :

   ```javascript
   if (!menu || !nombrePersonnes || !menu.prix_par_personne) {
     return { prixMenu: 0, reductionAppliquee: false };
   }
   ```

   - Vérifie que tous les paramètres sont valides
   - Si invalide, retourne des valeurs par défaut (0€, pas de réduction)

2. **Calcul du prix de base** :

   ```javascript
   let prixMenu = menu.prix_par_personne * nombrePersonnes;
   ```

   - Prix = prix par personne × nombre de personnes
   - Exemple : 25€/personne × 4 personnes = 100€

3. **Application de la réduction** :
   ```javascript
   if (nombrePersonnes >= menu.nombre_personne_minimum + 5) {
     prixMenu = prixMenu * 0.9; // Réduction de 10%
     reductionAppliquee = true;
   }
   ```
   - Condition : `nombrePersonnes >= minimum + 5`
   - Exemple : Si minimum = 2, réduction si ≥ 7 personnes
   - `* 0.9` : Applique une réduction de 10% (multiplie par 0.9)
   - `reductionAppliquee = true` : Indique que la réduction a été appliquée

**Exemple concret** :

- Menu : 25€/personne, minimum 2 personnes
- 7 personnes : 25 × 7 = 175€ → 175 × 0.9 = 157.50€ (réduction appliquée)
- 4 personnes : 25 × 4 = 100€ (pas de réduction, car 4 < 2+5)

---

#### **2. Fonction `calculatePrixLivraison`**

**Paramètres** :

- `adressePrestation` : Adresse où la livraison doit être effectuée (string)
- `user` : Objet utilisateur avec `ville` et `adresse_postals`

**Logique** :

1. **Validation des paramètres** :

   ```javascript
   if (!adressePrestation || !user) {
     return 0;
   }
   ```

   - Si paramètres invalides, retourne 0€ (livraison gratuite par défaut)

2. **Vérification si hors Bordeaux** :

   ```javascript
   const isHorsBordeaux =
     user.ville !== "Bordeaux" || adressePrestation !== user.adresse_postals;
   ```

   - Deux conditions (OU) :
     - `user.ville !== "Bordeaux"` : L'utilisateur n'habite pas à Bordeaux
     - `adressePrestation !== user.adresse_postals` : L'adresse de prestation est différente de l'adresse du compte
   - Si une des deux est vraie → livraison hors Bordeaux

3. **Calcul du prix** :
   ```javascript
   if (isHorsBordeaux) {
     return 5.0; // 5€ de base
   }
   return 0; // Gratuit à Bordeaux
   ```
   - Hors Bordeaux : 5€
   - À Bordeaux : 0€ (gratuit)

**Exemples** :

- Utilisateur à Bordeaux, adresse prestation = adresse compte → 0€
- Utilisateur à Bordeaux, adresse prestation différente → 5€
- Utilisateur à Paris, n'importe quelle adresse → 5€

**TODO** : Ajouter le calcul de distance pour ajouter 0.59€/km

---

#### **3. Fonction `calculateAllPrices`**

**Paramètres** :

- `formData` : Toutes les données du formulaire
- `user` : Utilisateur connecté
- `setFormData` : Fonction pour mettre à jour formData

**Logique** :

1. **Extraction des données nécessaires** :

   ```javascript
   const { menu, nombre_personne, adresse_prestation } = formData;
   ```

   - Déstructuration pour récupérer uniquement ce dont on a besoin

2. **Validation** :

   ```javascript
   if (!menu || !nombre_personne) {
     return; // Sort si données manquantes
   }
   ```

   - Vérifie que le menu et le nombre de personnes sont définis
   - Si non, sort sans calculer (évite les erreurs)

3. **Calculs** :

   ```javascript
   const { prixMenu, reductionAppliquee } = calculatePrixMenu(
     nombre_personne,
     menu
   );
   const prixLivraison = calculatePrixLivraison(adresse_prestation, user);
   const prixTotal = prixMenu + prixLivraison;
   ```

   - Appelle les deux fonctions de calcul
   - Calcule le total = prix menu + prix livraison

4. **Mise à jour de formData** :
   ```javascript
   setFormData((prev) => ({
     ...prev,
     prix_menu: prixMenu,
     prix_livraison: prixLivraison,
     prix_total: prixTotal,
     reduction_appliquee: reductionAppliquee,
   }));
   ```
   - Met à jour tous les prix dans `formData`
   - Garde toutes les autres propriétés intactes (`...prev`)

**Quand appeler cette fonction ?**

- Quand le nombre de personnes change (dans `Step3Recap`)
- Quand l'adresse de prestation change (dans `Step1Informations`)
- Quand le menu change (dans `Step2Menu`)
- Au chargement initial si toutes les données sont présentes

---

## ✅ **Résumé de l'ordre de développement**

1. ✅ **Step1Informations.jsx** - Formulaire informations (COMPLET)
2. ✅ **Step2Menu.jsx** - Sélection menu (COMPLET)
3. ✅ **Step3Recap.jsx** - Récapitulatif et prix (COMPLET)
4. ✅ **Fonctions de calcul** - Calculs automatiques (COMPLET)
5. ⏭️ **CommandPage.jsx** - Assemblage final (prochaine étape)

---

## 🎯 **Prochaines étapes**

Une fois ces composants créés, vous pourrez :

1. Les tester individuellement
2. Les intégrer dans `CommandPage.jsx`
3. Ajouter les fonctions de navigation (`nextStep`, `prevStep`, `handleSubmit`)

**Le guide pour `CommandPage.jsx` sera dans le fichier `GUIDE_COMMANDE.md` !**
