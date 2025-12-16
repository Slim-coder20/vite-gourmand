-- Script de correction immédiate pour la séquence commande_commande_id_seq
-- À exécuter dans votre base de données PostgreSQL pour résoudre l'erreur de contrainte unique

-- Synchroniser la séquence commande_commande_id_seq avec la valeur maximale actuelle
SELECT setval('commande_commande_id_seq', COALESCE((SELECT MAX(commande_id) FROM commande), 1), true);

-- Vérification : afficher la valeur actuelle de la séquence et le MAX de la table
SELECT 
  'commande_commande_id_seq' as sequence_name,
  last_value as current_sequence_value,
  (SELECT MAX(commande_id) FROM commande) as max_id_in_table,
  CASE 
    WHEN last_value >= COALESCE((SELECT MAX(commande_id) FROM commande), 0) 
    THEN '✅ Séquence synchronisée'
    ELSE '❌ Séquence non synchronisée'
  END as status
FROM commande_commande_id_seq;

