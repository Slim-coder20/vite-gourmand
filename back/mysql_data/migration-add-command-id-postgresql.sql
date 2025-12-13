-- Ajout de la colonne commande_id à la table Avis pour lier l'avis à une commande
-- Migration PostgreSQL pour Supabase

-- Ajouter la colonne commande_id si elle n'existe pas déjà
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'avis' AND column_name = 'commande_id') THEN
    ALTER TABLE avis ADD COLUMN commande_id INTEGER NULL;
    
    -- Ajouter la contrainte de clé étrangère
    ALTER TABLE avis
    ADD CONSTRAINT fk_avis_commande 
    FOREIGN KEY (commande_id) REFERENCES commande(commande_id);
    
    RAISE NOTICE 'Colonne commande_id ajoutée à la table avis';
  ELSE
    RAISE NOTICE 'Colonne commande_id existe déjà dans la table avis';
  END IF;
END $$;

