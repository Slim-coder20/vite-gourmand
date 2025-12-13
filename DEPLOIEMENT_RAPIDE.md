# ⚡ Déploiement Rapide sur Vercel

Guide rapide pour déployer l'application sur Vercel en 5 étapes.

## 🚀 Étapes rapides

### 1. Préparer les bases de données

- **MySQL** : Créez un compte sur [PlanetScale](https://planetscale.com) (gratuit)
- **MongoDB** : Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)
- Exécutez les scripts SQL de migration sur votre base MySQL

### 2. Générer les routes API

```bash
npm run generate-api
```

Ce script crée automatiquement tous les fichiers nécessaires dans le dossier `api/`.

### 3. Installer Vercel CLI

```bash
npm install -g vercel
vercel login
```

### 4. Configurer les variables d'environnement

Dans le dashboard Vercel (après le premier déploiement), ajoutez toutes les variables depuis `.env.example`.

**Variables essentielles :**
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`
- `MONGODB_URI`
- `JWT_SECRET`
- `VITE_API_URL` (URL de votre déploiement Vercel)

### 5. Déployer

```bash
# Premier déploiement
vercel

# Déploiement en production
vercel --prod
```

## 📚 Documentation complète

Pour plus de détails, consultez :
- **[GUIDE_DEPLOIEMENT_VERCEL.md](./GUIDE_DEPLOIEMENT_VERCEL.md)** - Guide complet et détaillé
- **[EXEMPLE_STRUCTURE_API_VERCEL.md](./EXEMPLE_STRUCTURE_API_VERCEL.md)** - Exemples de code

## ✅ Checklist

- [ ] Bases de données cloud configurées
- [ ] Scripts SQL exécutés
- [ ] Routes API générées (`npm run generate-api`)
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Déploiement réussi
- [ ] Application testée en production

## 🆘 Besoin d'aide ?

Consultez la section [Dépannage](./GUIDE_DEPLOIEMENT_VERCEL.md#-dépannage) dans le guide complet.

