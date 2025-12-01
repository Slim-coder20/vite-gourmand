# Image de base : Node.js version 22 sur Alpine Linux
FROM node:22-alpine

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances dans le conteneur
# Si package-lock.json n'existe pas, cette ligne fonctionnera quand même
COPY package.json package-lock.json* ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source (après npm install pour optimiser le cache Docker)
COPY . .

# Exposition du port 5173 (port par défaut de Vite)
EXPOSE 5173

# Commande à exécuter au démarrage du conteneur
# --host 0.0.0.0 permet d'accéder au serveur depuis l'extérieur du conteneur
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]