#!/bin/bash
# Script de nettoyage Docker

echo "Nettoyage des conteneurs Docker..."

# Forcer l'arrêt et la suppression de tous les conteneurs du projet
docker-compose down --remove-orphans 2>/dev/null || true

# Supprimer les conteneurs individuellement si nécessaire
docker rm -f vite_gourmand-frontend-1 2>/dev/null || true
docker rm -f vite_gourmand-server-1 2>/dev/null || true
docker rm -f vite_gourmand-db-1 2>/dev/null || true
docker rm -f vite_gourmand-mongodb-1 2>/dev/null || true
docker rm -f vite_gourmand-adminer-1 2>/dev/null || true
docker rm -f vite_gourmand-mongo-express-1 2>/dev/null || true

echo "Nettoyage terminé. Vous pouvez maintenant relancer avec: docker-compose up -d"

