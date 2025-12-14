# Solutions alternatives - Problème DNS Vercel/Supabase

## Problème actuel
L'erreur `getaddrinfo ENOTFOUND db.wfbwmyeyudxqqidgsmcc.supabase.co` persiste malgré :
- ✅ URL correcte et complète
- ✅ Configuration SSL correcte
- ✅ Lazy initialization du pool
- ✅ Session Pooler (testé précédemment)

## Solutions à essayer

### Solution 1 : Contacter le support Vercel

Le problème semble être un problème d'infrastructure réseau entre Vercel et Supabase.

**Étapes :**
1. Allez sur https://vercel.com/support
2. Créez un ticket avec :
   - Description : "Cannot resolve DNS for Supabase PostgreSQL hostname"
   - Hostname : `db.wfbwmyeyudxqqidgsmcc.supabase.co`
   - Erreur : `getaddrinfo ENOTFOUND`
   - Environnement : Serverless Functions
   - Région Vercel : (vérifiez dans Settings → General)

### Solution 2 : Vérifier la région Vercel

Certaines régions Vercel peuvent avoir des problèmes DNS.

**Étapes :**
1. Vercel → Settings → General
2. Vérifiez la région de déploiement
3. Essayez de changer la région si possible
4. Redéployez

### Solution 3 : Utiliser Supabase via API REST (Alternative)

Au lieu d'une connexion PostgreSQL directe, utiliser l'API REST de Supabase.

**Avantages :**
- Pas de problème DNS
- Fonctionne avec Vercel
- Plus simple pour les opérations CRUD

**Inconvénients :**
- Nécessite de réécrire les requêtes SQL en appels API
- Moins performant pour les requêtes complexes
- Nécessite Supabase client library

**Documentation :**
- https://supabase.com/docs/reference/javascript/introduction
- https://supabase.com/docs/guides/api

### Solution 4 : Utiliser un service proxy/connexion indirecte

Utiliser un service intermédiaire pour la connexion.

**Options :**
- Railway (supporte PostgreSQL)
- PlanetScale (MySQL compatible)
- Neon (PostgreSQL serverless)

### Solution 5 : Vérifier les restrictions réseau Supabase

Vérifier si Supabase a des restrictions IP qui bloquent Vercel.

**Étapes :**
1. Supabase Dashboard → Settings → Database
2. Vérifiez "Network Restrictions"
3. Assurez-vous que toutes les IPs sont autorisées (ou ajoutez les IPs Vercel)

### Solution 6 : Utiliser une connexion directe avec retry logic

Ajouter une logique de retry avec backoff exponentiel.

**Code à ajouter dans `database-postgres.js` :**

```javascript
async function queryWithRetry(text, params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const pool = getPool();
      return await pool.query(text, params);
    } catch (error) {
      if (error.code === 'ENOTFOUND' && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Backoff exponentiel
        console.log(`Retry ${i + 1}/${maxRetries} après ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

## Recommandation immédiate

1. **Contacter le support Vercel** - C'est probablement un problème d'infrastructure
2. **Vérifier la région Vercel** - Certaines régions peuvent avoir des problèmes
3. **En attendant, utiliser MySQL local** - Pour continuer le développement

## Informations à fournir au support

- **Hostname** : `db.wfbwmyeyudxqqidgsmcc.supabase.co`
- **Erreur** : `getaddrinfo ENOTFOUND`
- **Environnement** : Vercel Serverless Functions
- **Région** : (à vérifier)
- **URL de connexion** : `postgresql://postgres:***@db.wfbwmyeyudxqqidgsmcc.supabase.co:5432/postgres`
- **Tentatives** : Pooler, lazy init, SSL config, etc.

