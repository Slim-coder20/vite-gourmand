-- Script pour synchroniser les séquences PostgreSQL après import MySQL
-- À exécuter dans Supabase SQL Editor après l'import des données

-- Synchroniser la séquence user_user_id_seq
SELECT setval('"user_user_id_seq"', COALESCE((SELECT MAX(user_id) FROM "user"), 1), true);

-- Synchroniser la séquence role_role_id_seq
SELECT setval('role_role_id_seq', COALESCE((SELECT MAX(role_id) FROM role), 1), true);

-- Synchroniser la séquence avis_avis_id_seq
SELECT setval('avis_avis_id_seq', COALESCE((SELECT MAX(avis_id) FROM avis), 1), true);

-- Synchroniser la séquence commande_commande_id_seq
SELECT setval('commande_commande_id_seq', COALESCE((SELECT MAX(commande_id) FROM commande), 1), true);

-- Synchroniser la séquence menu_menu_id_seq
SELECT setval('menu_menu_id_seq', COALESCE((SELECT MAX(menu_id) FROM menu), 1), true);

-- Synchroniser la séquence plat_plat_id_seq
SELECT setval('plat_plat_id_seq', COALESCE((SELECT MAX(plat_id) FROM plat), 1), true);

-- Synchroniser la séquence theme_theme_id_seq
SELECT setval('theme_theme_id_seq', COALESCE((SELECT MAX(theme_id) FROM theme), 1), true);

-- Synchroniser la séquence regime_regime_id_seq
SELECT setval('regime_regime_id_seq', COALESCE((SELECT MAX(regime_id) FROM regime), 1), true);

-- Synchroniser la séquence allergene_allergene_id_seq
SELECT setval('allergene_allergene_id_seq', COALESCE((SELECT MAX(allergene_id) FROM allergene), 1), true);

-- Vérifier les séquences
SELECT 
  'user_user_id_seq' as sequence_name,
  last_value as current_value,
  (SELECT MAX(user_id) FROM "user") as max_id_in_table
FROM "user_user_id_seq"
UNION ALL
SELECT 
  'role_role_id_seq',
  last_value,
  (SELECT MAX(role_id) FROM role)
FROM role_role_id_seq;

