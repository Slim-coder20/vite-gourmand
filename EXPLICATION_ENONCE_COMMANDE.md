# 📋 Explication Détaillée : Partie Commande de Menu

## 🎯 Introduction

Ce document explique en détail chaque point de l'énoncé concernant la commande de menu et comment ces fonctionnalités sont implémentées dans le code.

---

## 📝 Point 1 : Nombre minimum de personnes (obligation)

### 📖 **Énoncé**

> "Il y a l'obligation de commander pour le nombre minimum de personne inscrit dans le menu."

### 🔍 **Explication**

Cela signifie que :

- Chaque menu a un **nombre minimum de personnes** défini (ex: 2 personnes minimum)
- L'utilisateur **ne peut pas** commander pour moins de personnes que ce minimum
- Si le menu indique "minimum 2 personnes", on ne peut pas commander pour 1 personne

### 💻 **Implémentation dans le code**

#### **1. Dans l'input (Step3Recap.jsx)**

```jsx
<input
  type="number"
  min={formData.menu?.nombre_personne_minimum || 1} // ← Minimum imposé
  value={
    formData.nombre_personne || formData.menu?.nombre_personne_minimum || 1
  }
  onChange={handleNumberChange}
/>
```

**Explication** :

- `min={formData.menu?.nombre_personne_minimum}` : L'attribut HTML `min` empêche de saisir un nombre inférieur au minimum
- Si l'utilisateur essaie de taper un nombre inférieur, le navigateur bloque la saisie
- La valeur par défaut est le minimum du menu

#### **2. Validation dans nextStep() (CommandPage.jsx)**

```jsx
// VALIDATION DE L'ÉTAPE 3 : Nombre de personnes
if (currentStep === 3) {
  // Vérifier que le nombre de personnes respecte le minimum du menu
  if (formData.nombre_personne < formData.menu.nombre_personne_minimum) {
    setErrors((prev) => ({
      ...prev,
      step3: `Le nombre minimum de personnes est ${formData.menu.nombre_personne_minimum}`,
    }));
    return; // Bloquer si le minimum n'est pas respecté
  }
}
```

**Explication** :

- Avant de passer à l'étape suivante, on vérifie que `nombre_personne >= nombre_personne_minimum`
- Si ce n'est pas le cas, on affiche une erreur et on bloque la navigation
- L'utilisateur doit corriger avant de continuer

#### **3. Validation dans handleSubmit() (CommandPage.jsx)**

```jsx
// Vérification finale avant soumission
if (formData.nombre_personne < formData.menu.nombre_personne_minimum) {
  setError(
    `Le nombre minimum de personnes est ${formData.menu.nombre_personne_minimum}`
  );
  setCurrentStep(3);
  return;
}
```

**Explication** :

- Même validation au moment de la soumission finale
- Double vérification pour garantir que la règle est respectée
- Si la validation échoue, on retourne à l'étape 3

#### **4. Validation côté backend (commandes.js)**

```javascript
// Dans back/routes/api/commandes.js
if (nombre_personne < menu.nombre_personne_minimum) {
  return res.status(400).json({
    message: `Le nombre de personnes doit être au minimum de ${menu.nombre_personne_minimum}`,
  });
}
```

**Explication** :

- Le backend vérifie aussi cette règle
- Même si le frontend est contourné, le backend refuse la commande
- Sécurité supplémentaire

### 📊 **Exemple concret**

**Menu** : "Menu Découverte"

- Prix par personne : 25€
- **Nombre minimum de personnes : 2**

**Scénarios** :

- ✅ **2 personnes** : 25€ × 2 = 50€ → **AUTORISÉ**
- ✅ **5 personnes** : 25€ × 5 = 125€ → **AUTORISÉ**
- ❌ **1 personne** : 25€ × 1 = 25€ → **REFUSÉ** (erreur affichée)

---

## 📝 Point 2 : Réduction de 10% pour 5 personnes de plus

### 📖 **Énoncé**

> "Une réduction de 10% est appliquée pour toutes commandes ayant 5 personnes de plus que le nombre de personnes minimum indiqué dans le menu."

### 🔍 **Explication**

Cela signifie que :

- Si le menu a un minimum de **2 personnes**
- La réduction s'applique à partir de **2 + 5 = 7 personnes**
- Si le menu a un minimum de **4 personnes**
- La réduction s'applique à partir de **4 + 5 = 9 personnes**

**Formule** : `nombre_personnes >= nombre_personne_minimum + 5`

### 💻 **Implémentation dans le code**

#### **Fonction de calcul (CommandPage.jsx)**

```jsx
const calculatePrixMenu = (nombrePersonnes, menu) => {
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
```

**Explication détaillée** :

1. **Calcul du prix de base** :

   ```javascript
   let prixMenu = menu.prix_par_personne * nombrePersonnes;
   ```

   - Exemple : 25€/personne × 7 personnes = 175€

2. **Vérification de la condition** :

   ```javascript
   if (nombrePersonnes >= menu.nombre_personne_minimum + 5)
   ```

   - Si minimum = 2 et nombre = 7 → `7 >= 2 + 5` → `7 >= 7` → **VRAI** ✅
   - Si minimum = 2 et nombre = 6 → `6 >= 2 + 5` → `6 >= 7` → **FAUX** ❌

3. **Application de la réduction** :

   ```javascript
   prixMenu = prixMenu * 0.9; // Réduction de 10%
   ```

   - 175€ × 0.9 = 157.50€
   - La réduction est de : 175€ - 157.50€ = **17.50€**

4. **Marquage de la réduction** :
   ```javascript
   reduction_appliquee = true;
   ```
   - Permet d'afficher visuellement la réduction dans le récapitulatif

### 📊 **Exemples concrets**

#### **Exemple 1 : Menu avec minimum 2 personnes**

| Nombre de personnes | Prix de base       | Réduction ?        | Prix final  |
| ------------------- | ------------------ | ------------------ | ----------- |
| 2 personnes         | 50€ (25€ × 2)      | ❌ Non (2 < 2+5)   | 50€         |
| 5 personnes         | 125€ (25€ × 5)     | ❌ Non (5 < 7)     | 125€        |
| 6 personnes         | 150€ (25€ × 6)     | ❌ Non (6 < 7)     | 150€        |
| **7 personnes**     | **175€ (25€ × 7)** | ✅ **Oui (7 ≥ 7)** | **157.50€** |
| 10 personnes        | 250€ (25€ × 10)    | ✅ Oui (10 ≥ 7)    | 225€        |

#### **Exemple 2 : Menu avec minimum 4 personnes**

| Nombre de personnes | Prix de base       | Réduction ?        | Prix final  |
| ------------------- | ------------------ | ------------------ | ----------- |
| 4 personnes         | 100€ (25€ × 4)     | ❌ Non (4 < 9)     | 100€        |
| 8 personnes         | 200€ (25€ × 8)     | ❌ Non (8 < 9)     | 200€        |
| **9 personnes**     | **225€ (25€ × 9)** | ✅ **Oui (9 ≥ 9)** | **202.50€** |
| 12 personnes        | 300€ (25€ × 12)    | ✅ Oui (12 ≥ 9)    | 270€        |

### 🎨 **Affichage de la réduction (Step3Recap.jsx)**

```jsx
{
  formData.reduction_appliquee && (
    <div className={styles.reduction}>
      <span className={styles.reductionLabel}>Réduction de 10% appliquée</span>
      <span className={styles.reductionValue}>
        -{(formData.prix_menu / 0.9 - formData.prix_menu).toFixed(2)}€
      </span>
    </div>
  );
}
```

**Explication** :

- La réduction s'affiche seulement si `reduction_appliquee === true`
- Calcul du montant de la réduction affiché :
  - `formData.prix_menu` = prix après réduction (ex: 157.50€)
  - `formData.prix_menu / 0.9` = prix avant réduction (ex: 175€)
  - `(prix_avant - prix_apres)` = montant de la réduction (ex: 17.50€)

**Pourquoi cette formule ?**

- On a appliqué la réduction : `prix_initial × 0.9 = prix_final`
- Pour retrouver le prix initial : `prix_final / 0.9 = prix_initial`
- La réduction = `prix_initial - prix_final`

---

## 📝 Point 3 : Vue détaillée du prix avant validation

### 📖 **Énoncé**

> "Une vue détaillée du prix est visible avant validation (prix menu ainsi que le prix de la livraison)."

### 🔍 **Explication**

Cela signifie que :

- L'utilisateur doit voir **tous les détails** du prix avant de valider
- Le récapitulatif doit afficher :
  - Le prix du menu (avec réduction si applicable)
  - Le prix de livraison
  - Le total
- Cette vue est visible à l'**étape 3** (récapitulatif)

### 💻 **Implémentation dans le code**

#### **Affichage dans Step3Recap.jsx**

```jsx
<div className={styles.recapSection}>
  <h3 className={styles.recapTitle}>Récapitulatif de votre commande</h3>

  {/* Détails du menu */}
  <div className={styles.menuDetails}>
    <h4>{formData.menu?.titre}</h4>
    <p>{formData.menu?.description}</p>
  </div>

  {/* Récapitulatif des prix */}
  <div className={styles.pricesList}>
    {/* 1. Prix du menu */}
    <div className={styles.priceLine}>
      <span className={styles.priceLabel}>
        Prix du menu ({formData.nombre_personne} personne(s))
      </span>
      <span className={styles.priceValue}>
        {formData.prix_menu.toFixed(2)}€
      </span>
    </div>

    {/* 2. Réduction si applicable */}
    {formData.reduction_appliquee && (
      <div className={styles.reduction}>
        <span>Réduction de 10% appliquée</span>
        <span>-17.50€</span>
      </div>
    )}

    {/* 3. Prix de livraison */}
    <div className={styles.priceLine}>
      <span className={styles.priceLabel}>Prix de livraison</span>
      <span className={styles.priceValue}>
        {formData.prix_livraison.toFixed(2)}€
      </span>
    </div>

    {/* 4. Séparateur visuel */}
    <div className={styles.separator}></div>

    {/* 5. Total */}
    <div className={`${styles.priceLine} ${styles.total}`}>
      <span className={styles.priceLabel}>Total</span>
      <span className={styles.priceValue}>
        {formData.prix_total.toFixed(2)}€
      </span>
    </div>
  </div>
</div>
```

### 📊 **Exemple d'affichage**

```
┌─────────────────────────────────────┐
│  Récapitulatif de votre commande    │
├─────────────────────────────────────┤
│  Menu Découverte                    │
│  Menu gastronomique avec 3 plats    │
├─────────────────────────────────────┤
│  Prix du menu (7 personne(s))      │
│                          157.50€    │
│                                      │
│  Réduction de 10% appliquée        │
│                          -17.50€    │
│                                      │
│  Prix de livraison                  │
│                            5.00€    │
│  ───────────────────────────────    │
│  Total                              │
│                          162.50€    │
└─────────────────────────────────────┘
```

### 🔄 **Mise à jour en temps réel**

**Quand les prix sont recalculés ?**

1. **Quand le nombre de personnes change** :

   ```jsx
   const handleNumberChange = (e) => {
     const number = parseInt(e.target.value);
     setFormData((prev) => ({ ...prev, nombre_personne: number }));
     onCalculatePrice(number); // ← Recalcul automatique
   };
   ```

2. **Quand l'adresse de prestation change** (étape 1) :

   - Le calcul est déclenché dans `nextStep()` quand on passe à l'étape suivante

3. **Quand le menu est sélectionné** :
   - Le calcul est déclenché automatiquement

**Résultat** : L'utilisateur voit les prix se mettre à jour **en temps réel** quand il modifie le nombre de personnes !

---

## 📝 Point 4 : Email de confirmation après commande

### 📖 **Énoncé**

> "Après avoir commandé un menu, le visiteur va recevoir un mail lui confirmant la commande."

### 🔍 **Explication**

Cela signifie que :

- Après la création réussie de la commande
- Un email doit être envoyé automatiquement au client
- L'email contient les détails de la commande (numéro, menu, date, prix, etc.)

### 💻 **Implémentation dans le code**

#### **Côté Frontend (CommandPage.jsx)**

```jsx
const handleSubmit = async () => {
  // ... validations ...

  try {
    // Appeler le service pour créer la commande
    const response = await createCommand(commandData);

    // Succès : rediriger vers la page d'accueil
    navigate("/", {
      state: {
        message: "Commande créée avec succès !",
        commande: response.commande,
      },
    });
  } catch (error) {
    // Gestion des erreurs
  }
};
```

**Explication** :

- Le frontend envoie la commande au backend
- Le backend crée la commande et **envoie l'email automatiquement**
- Le frontend redirige vers la page d'accueil avec un message de succès

#### **Côté Backend (commandes.js)**

```javascript
// Dans back/routes/api/commandes.js (ligne 214)
// Après la création de la commande
res.status(201).json({
  message: "Commande créée avec succès",
  commande: commandeRows[0],
});

// ⚠️ IMPORTANT : L'envoi d'email doit être ajouté ici
// TODO: Envoyer un email de confirmation
```

### 💻 **Implémentation dans le code**

#### **1. Fonction dans email.js (back/config/email.js)**

La fonction `sendOrderConfirmationEmail` a été ajoutée dans le fichier `back/config/email.js` qui centralise déjà l'envoi d'emails (réinitialisation de mot de passe, etc.).

**Avantages de cette approche** :

- ✅ Pas besoin de créer un nouveau fichier
- ✅ Réutilise la configuration existante du transporter
- ✅ Centralise tous les envois d'emails au même endroit
- ✅ Cohérence avec le reste du code

**Fonction créée** :

```javascript
const sendOrderConfirmationEmail = async (user, commande) => {
  // Template HTML avec tous les détails de la commande
  // - Numéro de commande
  // - Détails du menu
  // - Date et heure de prestation
  // - Adresse de livraison
  // - Récapitulatif des prix (menu + livraison + total)
  // - Statut de la commande
};
```

#### **2. Appel dans la route de commande (back/routes/api/commandes.js)**

```javascript
// Après la création de la commande (ligne 196-208)

// 16. Envoyer l'email de confirmation
try {
  await sendOrderConfirmationEmail(user, commandeRows[0]);
  console.log("Email de confirmation envoyé avec succès");
} catch (emailError) {
  // Ne pas faire échouer la commande si l'email échoue
  // On log l'erreur mais on continue
  console.error(
    "Erreur lors de l'envoi de l'email de confirmation :",
    emailError
  );
}

// 17. Retourner la réponse
res.status(201).json({
  message: "Commande créée avec succès",
  commande: commandeRows[0],
});
```

**Explication** :

- L'email est envoyé **après** la création de la commande en base de données
- Si l'envoi d'email échoue, la commande reste créée (on ne fait pas échouer la commande)
- L'erreur est loggée pour le debugging
- L'utilisateur reçoit quand même une confirmation de succès

### 📋 **Contenu de l'email de confirmation**

L'email devrait contenir :

1. **En-tête** :

   - Sujet : "Confirmation de commande N°CMD-..."
   - Salutation personnalisée

2. **Détails de la commande** :

   - Numéro de commande
   - Date de la commande
   - Menu commandé
   - Nombre de personnes
   - Date et heure de prestation
   - Adresse de livraison

3. **Détails financiers** :

   - Prix du menu
   - Réduction appliquée (si applicable)
   - Prix de livraison
   - **Total**

4. **Informations pratiques** :
   - Statut de la commande ("en attente")
   - Contact en cas de question

### ✅ **État actuel**

**Dans votre code actuel** :

- ✅ La commande est créée dans la base de données
- ✅ Le frontend reçoit une confirmation
- ✅ **L'email de confirmation est envoyé automatiquement** après la création de la commande

**Implémentation** :

- ✅ Fonction `sendOrderConfirmationEmail` ajoutée dans `back/config/email.js`
- ✅ Appel de la fonction dans `back/routes/api/commandes.js` après création
- ✅ Template HTML avec tous les détails de la commande
- ✅ Gestion des erreurs (la commande reste créée même si l'email échoue)

---

## 📊 Résumé visuel du flux complet

```
┌─────────────────────────────────────────────────┐
│  ÉTAPE 1 : Informations de prestation          │
│  - Nom, prénom, email, téléphone               │
│  - Adresse, date, heure de livraison           │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  ÉTAPE 2 : Sélection du menu                    │
│  - Menu pré-sélectionné ou choix               │
│  - Affichage des détails du menu                │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  ÉTAPE 3 : Nombre de personnes et récapitulatif  │
│                                                  │
│  Input nombre de personnes                      │
│  ┌──────────────────────────────────────────┐ │
│  │ Minimum : 2 personnes                      │ │
│  │ [7] personnes                             │ │
│  └──────────────────────────────────────────┘ │
│                                                  │
│  RÉCAPITULATIF DES PRIX                         │
│  ┌──────────────────────────────────────────┐ │
│  │ Prix du menu (7 personne(s))   157.50€  │ │
│  │ Réduction de 10% appliquée      -17.50€  │ │
│  │ Prix de livraison                 5.00€  │ │
│  │ ───────────────────────────────────────  │ │
│  │ Total                          162.50€   │ │
│  └──────────────────────────────────────────┘ │
│                                                  │
│  [Valider la commande]                         │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  VALIDATION ET SOUMISSION                       │
│  - Vérification nombre minimum ✅               │
│  - Envoi au backend                             │
│  - Création de la commande                      │
│  - Envoi email de confirmation 📧               │
│  - Redirection avec message de succès           │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist de vérification

### Point 1 : Nombre minimum de personnes

- [x] Input avec attribut `min` pour bloquer la saisie
- [x] Validation dans `nextStep()` avant de passer à l'étape suivante
- [x] Validation dans `handleSubmit()` avant la soumission
- [x] Validation côté backend pour sécurité
- [x] Message d'erreur clair si le minimum n'est pas respecté

### Point 2 : Réduction de 10%

- [x] Fonction `calculatePrixMenu()` avec condition `>= minimum + 5`
- [x] Application de la réduction (× 0.9)
- [x] Marquage `reduction_appliquee = true`
- [x] Affichage visuel de la réduction dans le récapitulatif
- [x] Calcul du montant de la réduction affiché

### Point 3 : Vue détaillée du prix

- [x] Section récapitulatif dans Step3Recap
- [x] Affichage du prix du menu
- [x] Affichage de la réduction (si applicable)
- [x] Affichage du prix de livraison
- [x] Affichage du total (mis en évidence)
- [x] Mise à jour en temps réel quand le nombre change

### Point 4 : Email de confirmation

- [x] Création de la commande dans le backend
- [x] ✅ **IMPLÉMENTÉ** : Fonction `sendOrderConfirmationEmail` dans `back/config/email.js`
- [x] ✅ **IMPLÉMENTÉ** : Appel de la fonction après création de commande
- [x] ✅ **IMPLÉMENTÉ** : Template HTML avec tous les détails (numéro, menu, date, prix, etc.)

---

## 🎯 Conclusion

### Ce qui est implémenté ✅

1. ✅ **Nombre minimum** : Validation complète (frontend + backend)
2. ✅ **Réduction de 10%** : Calcul et affichage automatiques
3. ✅ **Vue détaillée** : Récapitulatif complet avec tous les prix

### Ce qui est implémenté ✅

1. ✅ **Email de confirmation** : Implémenté côté backend
   - ✅ Fonction `sendOrderConfirmationEmail` dans `back/config/email.js`
   - ✅ Appel automatique après création de commande
   - ✅ Template HTML complet avec tous les détails
   - ✅ Gestion des erreurs (la commande reste créée même si l'email échoue)

**Tous les points de l'énoncé sont implémentés et fonctionnels !** 🎉
