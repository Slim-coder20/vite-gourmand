# Guide de résolution - Connexion PostgreSQL Supabase sur Vercel

## Problème actuel

Erreur : `getaddrinfo ENOTFOUND` - Impossible de résoudre le hostname Supabase

## Ressources officielles

### 1. Documentation Supabase

- **Connection Strings** : https://supabase.com/docs/guides/database/connecting-to-postgres
- **Connection Pooling** : https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
- **Troubleshooting** : https://supabase.com/docs/guides/database/troubleshooting

### 2. Documentation Vercel

- **Environment Variables** : https://vercel.com/docs/concepts/projects/environment-variables
- **Serverless Functions** : https://vercel.com/docs/concepts/functions/serverless-functions
- **PostgreSQL avec Vercel** : https://vercel.com/docs/storage/vercel-postgres

### 3. Articles et tutoriels

- **Supabase + Vercel** : https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
- **Node.js pg avec Supabase** : https://github.com/supabase/supabase-js

## Étapes de diagnostic

### Étape 1 : Vérifier DATABASE_URL dans Vercel

1. Allez dans **Vercel Dashboard** → Votre projet → **Settings** → **Environment Variables**
2. Trouvez `DATABASE_URL`
3. **Copiez la valeur complète** (cliquez sur "Reveal" si nécessaire)

### Étape 2 : Vérifier le format de l'URL

L'URL doit avoir l'un de ces formats :

#### Format 1 : Connexion directe (recommandée pour Vercel)

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Exemple :

```
postgresql://postgres:viteGourmand@db.wfbwmyeyudxqqidgsmcc.supabase.co:5432/postgres
```

#### Format 2 : Session Pooler (recommandé pour serverless)

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### Étape 3 : Obtenir la bonne URL depuis Supabase

1. Allez dans **Supabase Dashboard** → Votre projet
2. **Settings** → **Database**
3. Dans la section **Connection string**, choisissez :

   - **URI** (pour connexion directe)
   - **Connection pooling** (pour pooler)

4. **Copiez l'URL complète** (elle contient déjà le mot de passe)

### Étape 4 : Vérifier les points critiques

✅ **Le hostname doit se terminer par `.supabase.co`** (pas `.sup`)
✅ **Le port doit être `5432`** (direct ou Session Pooler) ou `6543` (Transaction Pooler)
✅ **L'URL ne doit PAS être tronquée** (vérifiez qu'elle est complète)
✅ **Le mot de passe doit être correct** (pas d'espaces, caractères spéciaux encodés)

### Étape 5 : Tester la connexion localement

Créez un fichier `test-connection.js` :

```javascript
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool
  .query("SELECT NOW()")
  .then((result) => {
    console.log("✅ Connexion réussie !");
    console.log("Heure serveur:", result.rows[0].now);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion:", err.message);
    console.error("Code:", err.code);
    if (err.code === "ENOTFOUND") {
      console.error("Hostname non résolu. Vérifiez DATABASE_URL.");
    }
    process.exit(1);
  });
```

Exécutez :

```bash
node test-connection.js
```

## Solutions courantes

### Solution 1 : Hostname tronqué

**Symptôme** : Hostname se termine par `.sup` au lieu de `.supabase.co`

**Cause** : L'URL a été tronquée lors de la copie/collage dans Vercel

**Solution** :

1. Re-copiez l'URL complète depuis Supabase Dashboard
2. Collez-la dans Vercel → Environment Variables
3. Vérifiez qu'elle est complète avant de sauvegarder
4. Redéployez

### Solution 2 : Format d'URL incorrect

**Symptôme** : Erreur de parsing ou connexion refusée

**Solution** :

- Utilisez le format exact fourni par Supabase
- Ne modifiez pas l'URL manuellement
- Utilisez la connexion directe (port 5432) ou le Session Pooler (port 5432)

### Solution 3 : Variables d'environnement non chargées

**Symptôme** : `DATABASE_URL is undefined`

**Solution** :

1. Vérifiez que `DATABASE_URL` est définie dans Vercel
2. Vérifiez que l'environnement est correct (Production, Preview, Development)
3. Redéployez après avoir ajouté/modifié la variable

### Solution 4 : SSL non configuré

**Symptôme** : Erreur SSL/TLS

**Solution** :

- Supabase nécessite SSL
- Assurez-vous que `ssl: { rejectUnauthorized: false }` est configuré

## Commandes utiles

### Tester la connexion depuis le terminal

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Vérifier les variables d'environnement dans Vercel

```bash
# Via Vercel CLI
vercel env ls
vercel env pull .env.local
```

## Checklist de vérification

- [ ] `DATABASE_URL` est définie dans Vercel
- [ ] L'URL est complète (pas tronquée)
- [ ] Le hostname se termine par `.supabase.co`
- [ ] Le port est `5432` (direct ou Session Pooler) ou `6543` (Transaction Pooler)
- [ ] Le mot de passe est correct
- [ ] SSL est activé dans la configuration
- [ ] `DB_TYPE=postgres` est défini dans Vercel
- [ ] L'application a été redéployée après modification des variables

## Support

Si le problème persiste :

1. **Supabase Support** : https://supabase.com/support
2. **Vercel Support** : https://vercel.com/support
3. **GitHub Issues** :
   - https://github.com/supabase/supabase/issues
   - https://github.com/vercel/vercel/issues

## Fichiers de configuration à vérifier

- `back/config/database-postgres.js` - Configuration PostgreSQL
- `back/config/database.js` - Sélection MySQL/PostgreSQL
- `api/[...route].js` - Handler serverless Vercel
- `vercel.json` - Configuration Vercel
