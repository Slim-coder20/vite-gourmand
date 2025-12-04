-- Migration pour ajouter la colonne image dans la table avis
-- Cette colonne stockera le chemin de l'image de profil de l'utilisateur qui a laissé l'avis

USE vite_gourmand;

-- Ajouter la colonne image (VARCHAR 255 pour stocker le chemin de l'image)
ALTER TABLE avis 
ADD COLUMN image VARCHAR(255) NULL AFTER description;

-- Vérification
DESCRIBE avis;

