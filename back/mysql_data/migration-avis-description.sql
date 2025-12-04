-- Migration pour augmenter la taille de la colonne description dans la table avis
-- La colonne description est actuellement VARCHAR(50) ce qui est trop court pour des avis complets

USE vite_gourmand;

-- Modifier la colonne description pour accepter jusqu'à 500 caractères
ALTER TABLE avis 
MODIFY COLUMN description VARCHAR(500) NULL;

-- Vérification
DESCRIBE avis;

