#!/bin/bash
# Script pour initialiser/réinitialiser la base de données MySQL
# Ce script peut être exécuté après un docker compose down pour réinitialiser les données

echo "🔄 Initialisation de la base de données MySQL..."

# Attendre que MySQL soit prêt
echo "⏳ Attente que MySQL soit prêt..."
sleep 5

# Exécuter les migrations
echo "📝 Exécution des migrations..."
docker compose exec -T db mysql -uroot -proot vite_gourmand < back/mysql_data/migration-v001.sql
docker compose exec -T db mysql -uroot -proot vite_gourmand < back/mysql_data/migration-password-reset.sql
docker compose exec -T db mysql -uroot -proot vite_gourmand < back/mysql_data/migration-avis-description.sql
docker compose exec -T db mysql -uroot -proot vite_gourmand < back/mysql_data/migration-avis-image.sql

# Insérer les données de test
echo "📊 Insertion des données de test..."
docker compose exec -T db mysql -uroot -proot vite_gourmand < back/mysql_data/data-test-menus.sql
docker compose exec -T db mysql -uroot -proot vite_gourmand < back/mysql_data/data-test-avis.sql

echo "✅ Base de données initialisée avec succès !"
echo ""
echo "Vérification des données :"
docker compose exec -T db mysql -uroot -proot --default-character-set=utf8mb4 -e "SELECT COUNT(*) as menus FROM vite_gourmand.menu; SELECT COUNT(*) as avis FROM vite_gourmand.avis;" 2>/dev/null

