# Authentification - Documentation

## 1. Installation des dépendances

### Packages installés

- `bcrypt` : Pour le hashage sécurisé des mots de passe
- `jsonwebtoken` : Pour la génération et la vérification des tokens JWT

### Commande d'installation

```bash
npm install bcrypt jsonwebtoken
```

## 2. Route d'inscription (POST /api/auth/register)

### Fonctionnalités implémentées

- Validation des champs requis (nom, prénom, email, password, adresse_postals, telephone)
- Validation du format email (regex)
- Vérification de l'unicité de l'email
- Validation du mot de passe selon le cahier des charges :
  - Minimum 10 caractères
  - Au moins 1 caractère spécial
  - Au moins 1 majuscule
  - Au moins 1 minuscule
  - Au moins 1 chiffre
- Hashage du mot de passe avec bcrypt (10 rounds)
- Attribution automatique du rôle "utilisateur"
- Génération d'un token JWT (expiration 24h)
- Retour du token et des informations utilisateur (sans le mot de passe)

### Structure de la requête

- URL : `POST /api/auth/register`
- Body : `{ nom, prenom, email, password, adresse_postals, telephone, ville?, pays? }`

### Réponse

- Status : 201 Created
- Body : `{ message, token, user: { user_id, nom, prenom, email, ... } }`

## 3. Route de connexion (POST /api/auth/login)

### Fonctionnalités implémentées

- Validation des champs requis (email, password)
- Recherche de l'utilisateur par email en utilisant le pool de connexions MySQL (`pool.query()`) depuis le fichier `config/database.js`
- Vérification de l'existence de l'utilisateur dans la base de données
- Comparaison du mot de passe avec bcrypt (`bcrypt.compare()`)
- Génération d'un token JWT (expiration 24h)
- Retour du token et des informations utilisateur (sans le mot de passe)

### Structure de la requête

- URL : `POST /api/auth/login`
- Body : `{ email, password }`

### Réponse

- Status : `200 OK` (succès) ou `401 Unauthorized` (échec)
- Body (succès) : `{ message, token, user: { user_id, nom, prenom, email, telephone, adresse_postals, ville, pays, role_id } }`
- Body (échec) : `{ message: "Email ou mot de passe incorrect" }`

### Gestion des erreurs

- `400 Bad Request` : Champs manquants (email ou password)
- `401 Unauthorized` : Email ou mot de passe incorrect
- `500 Internal Server Error` : Erreur serveur

## 4. Route de déconnexion (POST /api/auth/logout)

### Fonctionnalités implémentées

- Vérification de la présence du token dans le body
- Vérification de la validité du token JWT (invalide ou expiré)
- Retour d'un message de succès
- Note : Avec JWT stateless, le frontend doit supprimer le token du localStorage pour compléter la déconnexion

### Structure de la requête

- URL : `POST /api/auth/logout`
- Body : `{ token }`

### Réponse

- Status : `200 OK` (succès) ou `401 Unauthorized` (token invalide)
- Body (succès) : `{ message: "Déconnexion réussie" }`
- Body (échec) : `{ message: "Token invalide ou expiré" }`

### Gestion des erreurs

- `400 Bad Request` : Token manquant
- `401 Unauthorized` : Token invalide ou expiré
- `500 Internal Server Error` : Erreur serveur
