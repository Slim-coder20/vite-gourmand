# Guide : Utiliser le Session Pooler de Supabase

## Problème actuel
L'erreur `getaddrinfo ENOTFOUND` indique que Vercel ne peut pas résoudre le DNS pour `db.wfbwmyeyudxqqidgsmcc.supabase.co`.

## Solution : Session Pooler

Le Session Pooler de Supabase utilise un hostname différent (`aws-0-[region].pooler.supabase.com`) qui fonctionne mieux avec les environnements serverless comme Vercel.

## Étapes pour obtenir l'URL du Session Pooler

1. **Allez dans Supabase Dashboard**
   - Ouvrez votre projet Supabase
   - Allez dans **Settings** → **Database**

2. **Trouvez la section "Connection Pooling"**
   - Cherchez "Connection Pooling" ou "Session Pooler"
   - Vous verrez une connection string qui ressemble à :
   ```
   postgresql://postgres.wfbwmyeyudxqqidgsmcc:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```

3. **Copiez l'URL complète**
   - Remplacez `[PASSWORD]` par votre mot de passe réel
   - L'URL devrait ressembler à :
   ```
   postgresql://postgres.wfbwmyeyudxqqidgsmcc:viteGourmand@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```

4. **Mettez à jour dans Vercel**
   - Allez dans **Vercel** → **Settings** → **Environment Variables**
   - Modifiez `DATABASE_URL` avec la nouvelle URL du pooler
   - Sauvegardez

5. **Redéployez**
   - Vercel redéploiera automatiquement
   - Testez à nouveau

## Différences entre connexion directe et pooler

### Connexion directe (actuelle - ne fonctionne pas)
- Hostname : `db.wfbwmyeyudxqqidgsmcc.supabase.co`
- Port : `5432`
- Problème : DNS non résolu par Vercel

### Session Pooler (recommandé)
- Hostname : `aws-0-[region].pooler.supabase.com`
- Port : `5432` (mode session) ou `6543` (mode transaction)
- Avantage : Meilleure compatibilité avec serverless, gestion automatique des connexions

## Format attendu de l'URL Session Pooler

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

Exemple :
```
postgresql://postgres.wfbwmyeyudxqqidgsmcc:viteGourmand@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

## Notes importantes

- Le Session Pooler utilise généralement le port **5432** (mode session)
- Le format du username est différent : `postgres.[PROJECT-REF]` au lieu de juste `postgres`
- Le hostname est complètement différent : `aws-0-[region].pooler.supabase.com`
- Le port 6543 est utilisé pour le Transaction Pooler (mode transaction), mais le Session Pooler (port 5432) est recommandé pour les applications serverless

## Si vous ne trouvez pas le Session Pooler

1. Vérifiez que votre projet Supabase est actif
2. Certains projets peuvent avoir besoin d'activer le pooler
3. Contactez le support Supabase si nécessaire

