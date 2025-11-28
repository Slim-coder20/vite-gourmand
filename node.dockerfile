# Image de base : Node.js version 22 sur Alpine Linux
# Alpine est une distribution Linux légère, idéale pour les conteneurs Docker
FROM node:22-alpine

# Configuration de la variable d'environnement PATH
# Ajoute le répertoire des binaires npm au PATH pour pouvoir exécuter les commandes npm globales
ENV PATH /node_modules/.bin:$PATH

# Installation des dépendances de l'application
# Copie des fichiers de dépendances dans le conteneur
COPY ./package.json ./        # Fichier de définition des dépendances
COPY ./package-lock.json ./   # Fichier de verrouillage des versions (assure la reproductibilité)

# Installation de toutes les dépendances listées dans package.json
# Cette étape est mise en cache par Docker si package.json n'a pas changé
RUN npm install

# Exposition du port 3000
# Indique que le conteneur écoute sur le port 3000 (nécessaire pour le mapping dans docker-compose)
EXPOSE 3000