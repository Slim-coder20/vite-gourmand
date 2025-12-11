ALTER TABLE commande_statut_history
ADD COLUMN motif_annulation TEXT NULL AFTER user_id_modification,
ADD COLUMN mode_contact VARCHAR(50) NULL AFTER motif_annulation;