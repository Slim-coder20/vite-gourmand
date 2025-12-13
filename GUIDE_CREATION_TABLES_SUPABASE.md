# 📊 Guide : Création des Tables dans Supabase

Ce guide vous explique comment créer toutes les tables nécessaires dans Supabase PostgreSQL.

## 📋 Prérequis

- Compte Supabase actif
- Projet Supabase créé
- Accès au dashboard Supabase

## 🚀 Étapes pour créer les tables

### Étape 1 : Accéder à l'éditeur SQL de Supabase

1. Connectez-vous à [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **"SQL Editor"**

### Étape 2 : Exécuter le script de migration

1. Cliquez sur **"New query"** (Nouvelle requête)
2. Ouvrez le fichier `back/mysql_data/migration-postgresql-v001.sql` dans votre éditeur local
3. Copiez **tout le contenu** du fichier
4. Collez-le dans l'éditeur SQL de Supabase
5. Cliquez sur **"Run"** (ou appuyez sur `Ctrl+Enter` / `Cmd+Enter`)

### Étape 3 : Vérifier la création des tables

1. Dans le menu de gauche, cliquez sur **"Table Editor"**
2. Vous devriez voir toutes les tables créées :
   - `role`
   - `user`
   - `avis`
   - `allergene`
   - `plat`
   - `plat_allergene`
   - `regime`
   - `theme`
   - `menu`
   - `plat_menu`
   - `commande`
   - `commande_menu`
   - `password_reset_tokens`
   - `commande_statut_history`

## ✅ Vérification

### Vérifier avec SQL

Exécutez cette requête dans l'éditeur SQL :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Vous devriez voir toutes les tables listées ci-dessus.

## 🔍 Résolution de problèmes

### Erreur : "relation already exists"

Si vous obtenez cette erreur, c'est que certaines tables existent déjà. Le script utilise `CREATE TABLE IF NOT EXISTS`, donc il devrait ignorer les tables existantes. Si vous voulez tout recréer :

1. **ATTENTION** : Cela supprimera toutes les données !
2. Dans Supabase Dashboard → Table Editor
3. Supprimez manuellement les tables existantes
4. Réexécutez le script

### Erreur : "permission denied"

Assurez-vous d'être connecté avec un compte ayant les droits d'administration sur le projet.

## 📝 Notes importantes

- Le script crée toutes les tables avec leurs relations (foreign keys)
- Les rôles par défaut sont automatiquement insérés :
  - `utilisateur`
  - `admin`
  - `employe`
- Les tables sont créées dans le schéma `public` par défaut

## 🎯 Prochaines étapes

Une fois les tables créées :

1. Vérifiez que votre `DATABASE_URL` dans Vercel est correcte
2. Testez l'API avec une requête simple (ex: `/api/health`)
3. Ajoutez des données de test si nécessaire

---

**Fichier de migration :** `back/mysql_data/migration-postgresql-v001.sql`

