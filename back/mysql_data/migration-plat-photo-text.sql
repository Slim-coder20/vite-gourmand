-- Migration pour augmenter la taille de la colonne photo dans la table plat
-- De VARCHAR(255) à TEXT pour supporter des URLs d'images plus longues

USE vite_gourmand;

ALTER TABLE plat MODIFY COLUMN photo TEXT;
