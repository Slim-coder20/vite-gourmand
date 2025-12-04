-- Script SQL pour insérer des avis de test dans la base de données
-- Ces avis seront utilisés pour tester l'affichage sur la home page


-- Forcer l'encodage UTF-8 pour garantir le bon affichage des caractères spéciaux
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vite_gourmand;

-- Vérifier que la table user contient des utilisateurs
-- Si nécessaire, créer un utilisateur de test
INSERT INTO user (role_id, email, password, nom, prenom, telephone, ville, pays, adresse_postals)
SELECT 
  1, -- role_id pour 'utilisateur'
  'test.user1@example.com',
  '$2b$10$dummyhashforpassword', -- Hash bcrypt factice
  'Dupont',
  'Marie',
  '0612345678',
  'Paris',
  'France',
  '123 Rue de la Paix'
WHERE NOT EXISTS (
  SELECT 1 FROM user WHERE email = 'test.user1@example.com'
);

INSERT INTO user (role_id, email, password, nom, prenom, telephone, ville, pays, adresse_postals)
SELECT 
  1,
  'test.user2@example.com',
  '$2b$10$dummyhashforpassword',
  'Martin',
  'Jean',
  '0623456789',
  'Lyon',
  'France',
  '456 Avenue des Champs'
WHERE NOT EXISTS (
  SELECT 1 FROM user WHERE email = 'test.user2@example.com'
);

INSERT INTO user (role_id, email, password, nom, prenom, telephone, ville, pays, adresse_postals)
SELECT 
  1,
  'test.user3@example.com',
  '$2b$10$dummyhashforpassword',
  'Bernard',
  'Sophie',
  '0634567890',
  'Marseille',
  'France',
  '789 Boulevard de la Mer'
WHERE NOT EXISTS (
  SELECT 1 FROM user WHERE email = 'test.user3@example.com'
);

-- Récupérer les IDs des utilisateurs créés ou existants
SET @user1_id = (SELECT user_id FROM user WHERE email = 'test.user1@example.com' LIMIT 1);
SET @user2_id = (SELECT user_id FROM user WHERE email = 'test.user2@example.com' LIMIT 1);
SET @user3_id = (SELECT user_id FROM user WHERE email = 'test.user3@example.com' LIMIT 1);
SET @existing_user_id = (SELECT user_id FROM user LIMIT 1); -- Utiliser un utilisateur existant si les test n'existent pas

-- Insérer des avis de test avec statut "validée"
-- Avis 1 - Excellent service
INSERT INTO avis (user_id, note, description, image,  statut)
SELECT 
  COALESCE(@user1_id, @existing_user_id),
  '5',
  'Service exceptionnel, plats délicieux et livraison rapide !',
  'person-1.jpg',
  'validée'
WHERE NOT EXISTS (
  SELECT 1 FROM avis WHERE description LIKE 'Service exceptionnel%'
);

-- Avis 2 - Très satisfait
INSERT INTO avis (user_id, note, description, image, statut)
SELECT 
  COALESCE(@user2_id, @existing_user_id),
  '5',
  'Qualité irréprochable, je recommande vivement !',
  'person-2.jpg',
  'validée'
WHERE NOT EXISTS (
  SELECT 1 FROM avis WHERE description LIKE 'Qualité irréprochable%'
);

-- Avis 3 - Bon rapport qualité/prix
INSERT INTO avis (user_id, note, description, image, statut)
SELECT 
  COALESCE(@user3_id, @existing_user_id),
  '4',
  'Très bon rapport qualité-prix, plats savoureux.',
  'person-3.jpg',
  'validée'
WHERE NOT EXISTS (
  SELECT 1 FROM avis WHERE description LIKE 'Très bon rapport%'
);

-- Avis 4 - Parfait pour les événements
INSERT INTO avis (user_id, note, description, image, statut)
SELECT 
  COALESCE(@user1_id, @existing_user_id),
  '5',
  'Parfait pour nos événements, nos invités ont adoré !',
  'person-4.jpg',
  'validée'
WHERE NOT EXISTS (
  SELECT 1 FROM avis WHERE description LIKE 'Parfait pour nos événements%'
);

-- Avis 5 - Service client au top
INSERT INTO avis (user_id, note, description, image, statut)
SELECT 
  COALESCE(@user2_id, @existing_user_id),
  '5',
  'Service client réactif et professionnel, bravo !',
  'person-5.jpg',
  'validée'
WHERE NOT EXISTS (
  SELECT 1 FROM avis WHERE description LIKE 'Service client réactif%'
);

-- Avis 6 - Cuisine raffinée
INSERT INTO avis (user_id, note, description, image, statut)
SELECT 
  COALESCE(@user3_id, @existing_user_id),
  '4',
  'Cuisine raffinée, produits frais et de qualité.',
  'person-6.jpg',
  'validée'
WHERE NOT EXISTS (
  SELECT 1 FROM avis WHERE description LIKE 'Cuisine raffinée%'
);

-- Avis 7 - Livraison ponctuelle
INSERT INTO avis (user_id, note, description, image, statut)
SELECT 
  COALESCE(@user1_id, @existing_user_id),
  '5',
  'Livraison toujours ponctuelle, emballage soigné.',
  'person-7.jpg',
  'validée'
WHERE NOT EXISTS (
  SELECT 1 FROM avis WHERE description LIKE 'Livraison toujours ponctuelle%'
);

-- Avis 8 - Menu varié
INSERT INTO avis (user_id, note, description, image, statut)
SELECT 
  COALESCE(@user2_id, @existing_user_id),
  '4',
  'Menu varié qui plaît à toute la famille.',
  'person-8.jpg', 
  'validée'
WHERE NOT EXISTS (
  SELECT 1 FROM avis WHERE description LIKE 'Menu varié qui plaît%'
);

-- Mettre à jour les avis existants avec les images
UPDATE avis SET image = 'person-1.jpg' WHERE description LIKE 'Service exceptionnel%' AND (image IS NULL OR image = '');
UPDATE avis SET image = 'person-2.jpg' WHERE description LIKE 'Qualité irréprochable%' AND (image IS NULL OR image = '');
UPDATE avis SET image = 'person-3.jpg' WHERE description LIKE 'Très bon rapport%' AND (image IS NULL OR image = '');
UPDATE avis SET image = 'person-4.jpg' WHERE description LIKE 'Parfait pour nos événements%' AND (image IS NULL OR image = '');
UPDATE avis SET image = 'person-5.jpg' WHERE description LIKE 'Service client réactif%' AND (image IS NULL OR image = '');
UPDATE avis SET image = 'person-6.jpg' WHERE description LIKE 'Cuisine raffinée%' AND (image IS NULL OR image = '');
UPDATE avis SET image = 'person-7.jpg' WHERE description LIKE 'Livraison toujours ponctuelle%' AND (image IS NULL OR image = '');
UPDATE avis SET image = 'person-8.jpg' WHERE description LIKE 'Menu varié qui plaît%' AND (image IS NULL OR image = '');

-- Vérification des avis insérés
SELECT 
  a.avis_id,
  a.note,
  a.description,
  a.image,
  a.statut,
  u.nom,
  u.prenom
FROM avis a
LEFT JOIN user u ON a.user_id = u.user_id
WHERE a.statut = 'validée'
ORDER BY a.avis_id DESC;

