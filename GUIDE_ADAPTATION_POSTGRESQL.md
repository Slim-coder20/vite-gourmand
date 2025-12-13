# 🔄 Guide d'Adaptation MySQL → PostgreSQL (Supabase)

Ce guide explique comment adapter votre code pour utiliser PostgreSQL (Supabase) au lieu de MySQL.

## 📋 Table des matières

- [Configuration](#configuration)
- [Différences principales](#différences-principales)
- [Adaptation des requêtes SQL](#adaptation-des-requêtes-sql)
- [Fonctions spécifiques](#fonctions-spécifiques)
- [Exemples de conversion](#exemples-de-conversion)
- [Checklist de migration](#checklist-de-migration)

---

## ⚙️ Configuration

### 1. Installer la dépendance PostgreSQL

```bash
npm install pg
```

### 2. Configurer les variables d'environnement

Dans Vercel (ou votre fichier `.env`), ajoutez :

```env
# Type de base de données
DB_TYPE=postgres

# Configuration Supabase
DATABASE_URL=postgresql://user:password@host:5432/database
# OU
DB_HOST=votre-projet.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre-mot-de-passe
DB_PORT=5432
DB_SSL=true
```

### 3. Le système bascule automatiquement

Le fichier `back/config/database.js` détecte automatiquement `DB_TYPE=postgres` et utilise PostgreSQL.

---

## 🔄 Différences principales

| Aspect | MySQL | PostgreSQL |
|-------|-------|------------|
| **Placeholders** | `?` | `$1, $2, $3...` |
| **ID après INSERT** | `result.insertId` | `result.rows[0].id` (avec RETURNING) |
| **Fonction date** | `CURDATE()` | `CURRENT_DATE` ou `NOW()` |
| **Concaténation** | `GROUP_CONCAT(...)` | `STRING_AGG(..., ',')` |
| **Limite** | `LIMIT n` | `LIMIT n` (identique) |
| **Offset** | `OFFSET n` | `OFFSET n` (identique) |

---

## 🔧 Adaptation des requêtes SQL

### 1. Placeholders (`?` → `$1, $2, $3...`)

**MySQL :**
```javascript
await pool.query(
  "SELECT * FROM user WHERE email = ? AND role_id = ?",
  [email, roleId]
);
```

**PostgreSQL :**
```javascript
await pool.query(
  "SELECT * FROM user WHERE email = $1 AND role_id = $2",
  [email, roleId]
);
```

### 2. Récupération de l'ID après INSERT

**MySQL :**
```javascript
const [result] = await pool.query(
  "INSERT INTO user (nom, email) VALUES (?, ?)",
  [nom, email]
);
const userId = result.insertId;
```

**PostgreSQL :**
```javascript
const [result] = await pool.query(
  "INSERT INTO user (nom, email) VALUES ($1, $2) RETURNING user_id",
  [nom, email]
);
const userId = result.rows[0].user_id;
```

### 3. Fonctions de date

**MySQL :**
```sql
INSERT INTO commande (date_commande) VALUES (CURDATE())
```

**PostgreSQL :**
```sql
INSERT INTO commande (date_commande) VALUES (CURRENT_DATE)
-- OU
INSERT INTO commande (date_commande) VALUES (NOW())
```

### 4. GROUP_CONCAT → STRING_AGG

**MySQL :**
```sql
SELECT 
  p.plat_id,
  GROUP_CONCAT(DISTINCT a.libelle ORDER BY a.libelle SEPARATOR ', ') as allergenes
FROM plat p
LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
GROUP BY p.plat_id
```

**PostgreSQL :**
```sql
SELECT 
  p.plat_id,
  STRING_AGG(DISTINCT a.libelle, ', ' ORDER BY a.libelle) as allergenes
FROM plat p
LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
GROUP BY p.plat_id
```

---

## 📝 Exemples de conversion

### Exemple 1 : Route d'authentification

**Avant (MySQL) :**
```javascript
const [existingUser] = await pool.query(
  "SELECT * FROM user WHERE email = ?",
  [email]
);
```

**Après (PostgreSQL) :**
```javascript
const [existingUser] = await pool.query(
  "SELECT * FROM user WHERE email = $1",
  [email]
);
```

### Exemple 2 : Insertion avec ID

**Avant (MySQL) :**
```javascript
const [result] = await pool.query(
  `INSERT INTO commande (
    numero_commande, 
    date_commande, 
    user_id
  ) VALUES (?, CURDATE(), ?)`,
  [numeroCommande, userId]
);

const commandeId = result.insertId;
```

**Après (PostgreSQL) :**
```javascript
const [result] = await pool.query(
  `INSERT INTO commande (
    numero_commande, 
    date_commande, 
    user_id
  ) VALUES ($1, CURRENT_DATE, $2) RETURNING commande_id`,
  [numeroCommande, userId]
);

const commandeId = result.rows[0].commande_id;
```

### Exemple 3 : Requête avec GROUP_CONCAT

**Avant (MySQL) :**
```javascript
const [rows] = await pool.query(
  `SELECT 
    p.plat_id,
    GROUP_CONCAT(DISTINCT a.libelle ORDER BY a.libelle SEPARATOR ', ') as allergenes
  FROM plat p
  LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
  LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
  WHERE p.plat_id = ?
  GROUP BY p.plat_id`,
  [id]
);
```

**Après (PostgreSQL) :**
```javascript
const [rows] = await pool.query(
  `SELECT 
    p.plat_id,
    STRING_AGG(DISTINCT a.libelle, ', ' ORDER BY a.libelle) as allergenes
  FROM plat p
  LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
  LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
  WHERE p.plat_id = $1
  GROUP BY p.plat_id`,
  [id]
);
```

---

## 🔍 Fonctions spécifiques

### Dates et heures

| MySQL | PostgreSQL |
|-------|------------|
| `CURDATE()` | `CURRENT_DATE` |
| `NOW()` | `NOW()` (identique) |
| `DATE_FORMAT(date, '%Y-%m-%d')` | `TO_CHAR(date, 'YYYY-MM-DD')` |

### Chaînes de caractères

| MySQL | PostgreSQL |
|-------|------------|
| `GROUP_CONCAT(...)` | `STRING_AGG(..., ',')` |
| `CONCAT(str1, str2)` | `str1 \|\| str2` ou `CONCAT(str1, str2)` |

### Autres

| MySQL | PostgreSQL |
|-------|------------|
| `AUTO_INCREMENT` | `SERIAL` ou `GENERATED ALWAYS AS IDENTITY` |
| `LIMIT n OFFSET m` | `LIMIT n OFFSET m` (identique) |

---

## ✅ Checklist de migration

### Fichiers à modifier

- [ ] `back/routes/api/auth.js` - Placeholders et INSERT
- [ ] `back/routes/api/commandes.js` - Placeholders, INSERT avec RETURNING, CURDATE()
- [ ] `back/routes/api/menus.js` - Placeholders
- [ ] `back/routes/api/plats.js` - GROUP_CONCAT → STRING_AGG
- [ ] `back/routes/api/avis.js` - Placeholders et INSERT
- [ ] `back/routes/api/admin.js` - Toutes les requêtes
- [ ] `back/routes/api/employe.js` - Toutes les requêtes
- [ ] `back/middleware/auth.js` - Placeholders

### Étapes

1. **Installer pg** : `npm install pg`
2. **Configurer DB_TYPE=postgres** dans les variables d'environnement
3. **Adapter toutes les requêtes** :
   - Remplacer `?` par `$1, $2, $3...`
   - Ajouter `RETURNING id` aux INSERT
   - Remplacer `CURDATE()` par `CURRENT_DATE`
   - Remplacer `GROUP_CONCAT` par `STRING_AGG`
4. **Tester chaque route** après modification
5. **Vérifier les résultats** : PostgreSQL retourne `result.rows` au lieu de `result`

---

## 🛠️ Script d'aide pour la conversion

Vous pouvez créer un script pour automatiser certaines conversions :

```javascript
// scripts/convert-mysql-to-postgres.js
// Script d'aide pour convertir les requêtes SQL

function convertPlaceholders(sql, params) {
  // Convertir ? en $1, $2, etc.
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

function convertGroupConcat(sql) {
  // Convertir GROUP_CONCAT en STRING_AGG
  return sql.replace(
    /GROUP_CONCAT\(([^)]+)\)/gi,
    (match, content) => {
      // Extraire les paramètres
      const parts = content.split('SEPARATOR');
      const expression = parts[0].trim();
      const separator = parts[1] ? parts[1].trim().replace(/['"]/g, '') : ',';
      
      return `STRING_AGG(${expression}, '${separator}')`;
    }
  );
}

function convertCurdate(sql) {
  return sql.replace(/CURDATE\(\)/gi, 'CURRENT_DATE');
}

// Exemple d'utilisation
const mysqlQuery = "SELECT * FROM user WHERE email = ? AND role_id = ?";
const postgresQuery = convertPlaceholders(mysqlQuery);
console.log(postgresQuery); // "SELECT * FROM user WHERE email = $1 AND role_id = $2"
```

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pg (node-postgres) Documentation](https://node-postgres.com/)

---

## ⚠️ Notes importantes

1. **Testez chaque route** après conversion
2. **Vérifiez les types de données** : certains types peuvent différer
3. **Les noms de colonnes** : PostgreSQL est sensible à la casse (utilisez des guillemets si nécessaire)
4. **Les transactions** : La syntaxe est similaire mais vérifiez les différences

---

**Besoin d'aide ?** Consultez la documentation Supabase ou PostgreSQL pour des cas spécifiques.

