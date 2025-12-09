-- Ajout de la colonne commande_id à la table Avis pour lier l'avis à une commande

USE vite_gourmand;

ALTER TABLE avis
ADD COLUMN commande_id INT NULL AFTER user_id;

ALTER TABLE avis
ADD CONSTRAINT fk_avis_commande 
FOREIGN KEY (commande_id) REFERENCES commande (commande_id);


DESCRIBE avis;
