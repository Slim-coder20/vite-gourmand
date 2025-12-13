# 📤 Guide : Export MySQL vers PostgreSQL (Supabase)

Ce guide vous explique comment exporter toutes vos données de MySQL locale vers PostgreSQL (Supabase).

## 📋 Prérequis

1. **MySQL local en cours d'exécution** (via Docker ou installation locale)
2. **Accès à la base de données** `vite_gourmand`
3. **Node.js installé** (v18 ou supérieur)
4. **Tables déjà créées dans Supabase** (via `migration-postgresql-v001.sql`)

## 🚀 Étapes d'export

### Étape 1 : Vérifier la connexion MySQL

Assurez-vous que votre MySQL local fonctionne :

```bash
# Si vous utilisez Docker
docker-compose ps

# Vérifier que le service db est "Up"
```

### Étape 2 : Configurer les variables d'environnement (optionnel)

Le script utilise les valeurs par défaut, mais vous pouvez les personnaliser :

Créez un fichier `.env` à la racine (si ce n'est pas déjà fait) :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=vite_gourmand
DB_PORT=3306
```

**Note :** Si vous utilisez les valeurs par défaut (root/root sur localhost:3306), vous n'avez pas besoin de créer le `.env`.

### Étape 3 : Exécuter le script d'export

#### Option A : Avec npm (recommandé)

```bash
npm run export-mysql
```

#### Option B : Directement avec Node.js

```bash
node scripts/export-mysql-to-postgresql.js
```

### Étape 4 : Vérifier le fichier généré

Le script génère un fichier :
```
back/mysql_data/export-postgresql-data.sql
```

Ce fichier contient tous vos `INSERT` statements au format PostgreSQL.

## 📥 Import dans Supabase

### Étape 1 : Ouvrir Supabase SQL Editor

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Cliquez sur **"SQL Editor"** dans le menu de gauche

### Étape 2 : Importer le fichier

1. Cliquez sur **"New query"**
2. Ouvrez le fichier `back/mysql_data/export-postgresql-data.sql`
3. **Copiez tout le contenu** du fichier
4. **Collez** dans l'éditeur SQL de Supabase
5. Cliquez sur **"Run"** (ou `Ctrl+Enter` / `Cmd+Enter`)

### Étape 3 : Vérifier les données

1. Allez dans **"Table Editor"**
2. Vérifiez que vos données sont présentes :
   - `menu` → vos menus avec images
   - `plat` → vos plats avec photos
   - `avis` → vos avis
   - `user` → vos utilisateurs
   - etc.

## 🔍 Résolution de problèmes

### Erreur : "Cannot connect to MySQL"

**Solution :**
- Vérifiez que MySQL est démarré : `docker-compose ps`
- Vérifiez les identifiants dans `.env` ou les valeurs par défaut
- Testez la connexion : `mysql -h localhost -u root -proot vite_gourmand`

### Erreur : "Table doesn't exist"

**Solution :**
- Le script ignore les tables qui n'existent pas
- C'est normal si certaines tables n'ont pas été créées

### Erreur dans Supabase : "relation already exists"

**Solution :**
- Le script utilise `ON CONFLICT DO NOTHING`, donc les doublons sont ignorés
- Si vous voulez tout réimporter, supprimez d'abord les données dans Supabase :
  ```sql
  TRUNCATE TABLE menu, plat, avis, user, commande CASCADE;
  ```

### Les images ne s'affichent pas

**Solution :**
- Les images sont stockées dans `frontend/public/images/`
- Elles seront déployées automatiquement avec Vercel
- Vérifiez que les noms dans la base correspondent aux fichiers

## 📊 Tables exportées

Le script exporte les tables suivantes (dans cet ordre) :

1. `role` - Rôles utilisateurs
2. `user` - Utilisateurs
3. `regime` - Régimes alimentaires
4. `theme` - Thèmes de menus
5. `allergene` - Allergènes
6. `plat` - Plats (avec photos)
7. `menu` - Menus (avec images)
8. `plat_allergene` - Relations plats/allergènes
9. `plat_menu` - Relations plats/menus
10. `commande` - Commandes
11. `commande_menu` - Relations commandes/menus
12. `avis` - Avis clients
13. `password_reset_tokens` - Tokens de réinitialisation
14. `commande_statut_history` - Historique des statuts

## ✅ Checklist

- [ ] MySQL local fonctionne
- [ ] Script d'export exécuté avec succès
- [ ] Fichier `export-postgresql-data.sql` généré
- [ ] Fichier importé dans Supabase
- [ ] Données vérifiées dans Table Editor
- [ ] Images présentes dans `frontend/public/images/`

## 🎯 Notes importantes

- **Les images physiques** doivent être dans `frontend/public/images/`
- **Les noms d'images** dans la base doivent correspondre aux fichiers
- **Les données sont exportées** avec `ON CONFLICT DO NOTHING` pour éviter les doublons
- **Les booléens** sont convertis automatiquement (0/1 → FALSE/TRUE)
- **Les dates** sont converties au format PostgreSQL

---

**Fichier généré :** `back/mysql_data/export-postgresql-data.sql`

