-- Migration pour ajouter la colonne adresse_prestation à la table commande


USE vite_gourmand;

ALTER TABLE commande 
ADD COLUMN adresse_prestation VARCHAR(255) AFTER prix_livraison;
