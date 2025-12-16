-- Export MySQL vers PostgreSQL
-- Généré le: 2025-12-13T20:13:10.032Z
-- Base de données source: vite_gourmand
-- 
-- IMPORTANT: 
-- 1. Assurez-vous que les tables existent déjà dans Supabase
-- 2. Exécutez ce script dans Supabase SQL Editor
-- 3. Les INSERT utilisent ON CONFLICT DO NOTHING pour éviter les doublons
--

BEGIN;


-- Export de la table role
-- 3 lignes

INSERT INTO role ("role_id", "libele") VALUES (1, 'utilisateur') ON CONFLICT DO NOTHING;
INSERT INTO role ("role_id", "libele") VALUES (2, 'admin') ON CONFLICT DO NOTHING;
INSERT INTO role ("role_id", "libele") VALUES (3, 'employe') ON CONFLICT DO NOTHING;


-- Export de la table user
-- 9 lignes

INSERT INTO "user" ("user_id", "role_id", "actif", "email", "password", "nom", "prenom", "telephone", "ville", "pays", "adresse_postals") VALUES (1, 1, TRUE, 'test.user1@example.com', '$2b$10$dummyhashforpassword', 'Dupont', 'Marie', '0612345678', 'Paris', 'France', '123 Rue de la Paix') ON CONFLICT DO NOTHING;
INSERT INTO "user" ("user_id", "role_id", "actif", "email", "password", "nom", "prenom", "telephone", "ville", "pays", "adresse_postals") VALUES (2, 1, TRUE, 'test.user2@example.com', '$2b$10$dummyhashforpassword', 'Martin', 'Jean', '0623456789', 'Lyon', 'France', '456 Avenue des Champs') ON CONFLICT DO NOTHING;
INSERT INTO "user" ("user_id", "role_id", "actif", "email", "password", "nom", "prenom", "telephone", "ville", "pays", "adresse_postals") VALUES (3, 1, TRUE, 'test.user3@example.com', '$2b$10$dummyhashforpassword', 'Bernard', 'Sophie', '0634567890', 'Marseille', 'France', '789 Boulevard de la Mer') ON CONFLICT DO NOTHING;
INSERT INTO "user" ("user_id", "role_id", "actif", "email", "password", "nom", "prenom", "telephone", "ville", "pays", "adresse_postals") VALUES (4, 1, TRUE, 'wafa@gmail.com', '$2b$10$i2g/e3rH.u3UJPdZpvHVqe.w6AlxDs1nOHn3FrySL5xbzuQGtQHQG', 'Abida', 'wafa', '0607651050', 'Montrouge', 'France', '30 rue Hippolyte Mulin') ON CONFLICT DO NOTHING;
INSERT INTO "user" ("user_id", "role_id", "actif", "email", "password", "nom", "prenom", "telephone", "ville", "pays", "adresse_postals") VALUES (5, 3, TRUE, 'slimabida21@gmail.com', '$2b$10$DC6MXdDi6wNyEZWdZ1Ua5.lPK2Yd3C/addATt8il57IKy6jpU55ta', 'Abida', 'Slim', '0608654012', 'Montrouge', 'France', '30 rue Hippolyte Mulin') ON CONFLICT DO NOTHING;
INSERT INTO "user" ("user_id", "role_id", "actif", "email", "password", "nom", "prenom", "telephone", "ville", "pays", "adresse_postals") VALUES (6, 3, TRUE, 'khaled@gmail.com', '$2b$10$NMy2FkpVrrRir/sBfk8CIuMxVyXHGcXiBTOtDQgiQ8Bm0hhP8jUk.', 'Abida', 'Khaled', '0607651050', 'Paris', 'France', '10 Rue Fourcade') ON CONFLICT DO NOTHING;
INSERT INTO "user" ("user_id", "role_id", "actif", "email", "password", "nom", "prenom", "telephone", "ville", "pays", "adresse_postals") VALUES (7, 1, TRUE, 'fanny@gmail.com', '$2b$10$sjTaXCR72UitTr.dPk.aBu.KumMW5zaeyYBylCJDdVEMSG.Eucv26', 'Vallois', 'Fanny', '0607651050', 'Montrouge', 'France', '30 rue Hippolyte Mulin') ON CONFLICT DO NOTHING;
INSERT INTO "user" ("user_id", "role_id", "actif", "email", "password", "nom", "prenom", "telephone", "ville", "pays", "adresse_postals") VALUES (8, 2, TRUE, 'jose@vitegourmand.fr', '$2b$10$i56Oya6dPAf8Lx329u2IDetoz41t/VvbUJAUj6qYuljQIOM8IlkDK', 'Fernandez', 'José', NULL, NULL, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "user" ("user_id", "role_id", "actif", "email", "password", "nom", "prenom", "telephone", "ville", "pays", "adresse_postals") VALUES (9, 1, TRUE, 'vitegourmand@gmail.com', '$2b$10$av35NVMGvAqzCCjIoxd/M.XCAELUwHOtxEgkV.QtYAo685iB3UNMK', 'Slim', 'Abida', '0607651050', 'Paris', 'France', '10 Rue Fourcade') ON CONFLICT DO NOTHING;
ALTER SEQUENCE user_user_id_seq RESTART WITH 10;

-- Export de la table regime
-- 3 lignes

INSERT INTO regime ("regime_id", "libelle") VALUES (1, 'Classique') ON CONFLICT DO NOTHING;
INSERT INTO regime ("regime_id", "libelle") VALUES (2, 'Végétarien') ON CONFLICT DO NOTHING;
INSERT INTO regime ("regime_id", "libelle") VALUES (3, 'Vegan') ON CONFLICT DO NOTHING;


-- Export de la table theme
-- 4 lignes

INSERT INTO theme ("theme_id", "libelle") VALUES (1, 'Classique') ON CONFLICT DO NOTHING;
INSERT INTO theme ("theme_id", "libelle") VALUES (2, 'Noël') ON CONFLICT DO NOTHING;
INSERT INTO theme ("theme_id", "libelle") VALUES (3, 'Pâques') ON CONFLICT DO NOTHING;
INSERT INTO theme ("theme_id", "libelle") VALUES (4, 'Événement') ON CONFLICT DO NOTHING;


-- Export de la table allergene
-- 8 lignes

INSERT INTO allergene ("allergene_id", "libelle") VALUES (1, 'Gluten') ON CONFLICT DO NOTHING;
INSERT INTO allergene ("allergene_id", "libelle") VALUES (2, 'Lactose') ON CONFLICT DO NOTHING;
INSERT INTO allergene ("allergene_id", "libelle") VALUES (3, 'Fruits à coque') ON CONFLICT DO NOTHING;
INSERT INTO allergene ("allergene_id", "libelle") VALUES (4, 'Œufs') ON CONFLICT DO NOTHING;
INSERT INTO allergene ("allergene_id", "libelle") VALUES (5, 'Poisson') ON CONFLICT DO NOTHING;
INSERT INTO allergene ("allergene_id", "libelle") VALUES (6, 'Crustacés') ON CONFLICT DO NOTHING;
INSERT INTO allergene ("allergene_id", "libelle") VALUES (7, 'Soja') ON CONFLICT DO NOTHING;
INSERT INTO allergene ("allergene_id", "libelle") VALUES (8, 'Arachides') ON CONFLICT DO NOTHING;


-- Export de la table plat
-- 13 lignes

INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (1, 'Salade de saison', 'https://i0.wp.com/clemfoodie.com/wp-content/uploads/2024/03/IMG_4209.jpg?resize=720%2C900&ssl=1') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (2, 'Velouté de potiron', 'https://assets.afcdn.com/recipe/20221010/135900_w1024h576c1cx1160cy863cxt0cyt0cxb2121cyb1414.webp') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (3, 'Terrine de légumes', 'https://euredenfs-1e0f7.kxcdn.com/wp-content/uploads/2021/12/preparation-riche-en-proteines-1kg-recette-terrine-legumes.jpg') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (4, 'Salade de chèvre chaud', 'https://www.soignon.fr/uploads/salade-ch%C3%A8vre-chaud-pommes-noix-540px.png') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (5, 'Poulet rôti aux herbes', 'https://mccormick.widen.net/content/ajszpbmyqs/original/poulet_roti_aux_herbes_de_provence_et_ses_legumes_2000x1125.jpg') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (6, 'Saumon grillé', 'https://www.cetofine.com/681-medium_default/salmon-with-spinach-prepared-meal.jpg') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (7, 'Lasagnes végétariennes', 'https://recettescookeo.com/wp-content/uploads/2015/04/Lasagnes-v%C3%A9g%C3%A9tariennes.jpg') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (8, 'Risotto aux champignons', 'https://assets.afcdn.com/recipe/20221108/137260_w1024h1024c1cx1048cy721cxt0cyt0cxb2119cyb1414.jpg') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (9, 'Magret de canard', 'https://www.esprit-foie-gras.fr/wp-content/uploads/2024/12/Roti-de-magret-de-canard-e1763573122295.jpeg') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (10, 'Tarte aux pommes', 'https://assets.afcdn.com/recipe/20220128/128250_w1024h1024c1cx1294cy688cxt0cyt0cxb2037cyb1472.webp') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (11, 'Mousse au chocolat', 'https://assets.afcdn.com/recipe/20210311/118509_w1024h768c1cx300cy533cxt0cyt0cxb600cyb1066.webp') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (12, 'Tiramisu', 'https://assets.afcdn.com/recipe/20190529/93097_w1024h768c1cx3008cy2008cxt0cyt0cxb6016cyb4016.webp') ON CONFLICT DO NOTHING;
INSERT INTO plat ("plat_id", "titre_plat", "photo") VALUES (13, 'Salade de fruits', 'https://assets.afcdn.com/recipe/20210215/117981_w1024h768c1cx2652cy2652cxt0cyt0cxb5304cyb5304.webp') ON CONFLICT DO NOTHING;


-- Export de la table menu
-- 6 lignes

INSERT INTO menu ("menu_id", "titre", "nombre_personne_minimum", "prix_par_personne", "regime_id", "theme_id", "description", "quantite_restante", "image", "conditions") VALUES (1, 'Menu Découverte', 10, 15, 1, 1, 'Un menu complet pour découvrir notre cuisine : salade de saison, poulet rôti aux herbes et tarte aux pommes. Parfait pour une première expérience avec nos services.', 5, 'menu-decouverte-1.jpg,menu-decouverte-2.jpg,menu-decouverte-3.jpg', 'Commander au minimum 7 jours avant la date de prestation. Stockage au frais recommandé.') ON CONFLICT DO NOTHING;
INSERT INTO menu ("menu_id", "titre", "nombre_personne_minimum", "prix_par_personne", "regime_id", "theme_id", "description", "quantite_restante", "image", "conditions") VALUES (2, 'Menu Festif Noël', 12, 25, 1, 2, 'Menu spécial pour les fêtes de fin d''année : velouté de potiron, saumon grillé et tiramisu. Idéal pour célébrer en famille ou entre amis.', 3, 'menu-noel-1.jpg,menu-noel-2.jpg,menu-noel-3.jpg', 'Commander au minimum 14 jours avant la date de prestation. Disponible uniquement en décembre. Stockage au frais obligatoire.') ON CONFLICT DO NOTHING;
INSERT INTO menu ("menu_id", "titre", "nombre_personne_minimum", "prix_par_personne", "regime_id", "theme_id", "description", "quantite_restante", "image", "conditions") VALUES (3, 'Menu Végétarien', 8, 18, 2, 1, 'Menu 100% végétarien : terrine de légumes, lasagnes végétariennes et salade de fruits. Une option savoureuse et équilibrée.', 8, 'menu-vegetarien-1.jpg,menu-vegetarien-2.jpg', 'Commander au minimum 5 jours avant la date de prestation. Contient du gluten et du lactose.') ON CONFLICT DO NOTHING;
INSERT INTO menu ("menu_id", "titre", "nombre_personne_minimum", "prix_par_personne", "regime_id", "theme_id", "description", "quantite_restante", "image", "conditions") VALUES (4, 'Menu Événement Premium', 15, 20, 1, 4, 'Menu haut de gamme pour vos événements spéciaux : salade de chèvre chaud, magret de canard et mousse au chocolat. Un menu qui impressionnera vos invités.', 10, 'menu-premium-1.jpg,menu-premium-2.jpg,menu-premium-3.jpg,menu-premium-4.jpg', 'Commander au minimum 21 jours avant la date de prestation. Service traiteur disponible sur demande. Stockage au frais obligatoire.') ON CONFLICT DO NOTHING;
INSERT INTO menu ("menu_id", "titre", "nombre_personne_minimum", "prix_par_personne", "regime_id", "theme_id", "description", "quantite_restante", "image", "conditions") VALUES (5, 'Menu Pâques', 10, 20, 2, 3, 'Menu spécial Pâques : velouté de potiron, risotto aux champignons et tarte aux pommes. Parfait pour célébrer Pâques en famille.', 6, 'menu-paques-1.jpg,menu-paques-2.jpg', 'Commander au minimum 10 jours avant la date de prestation. Disponible en mars et avril. Contient du gluten et du lactose.') ON CONFLICT DO NOTHING;
INSERT INTO menu ("menu_id", "titre", "nombre_personne_minimum", "prix_par_personne", "regime_id", "theme_id", "description", "quantite_restante", "image", "conditions") VALUES (6, 'Menu Classique', 10, 15, 1, 1, 'Menu classique : salade de saison, poulet rôti aux herbes et tarte aux pommes. Parfait pour une première expérience avec nos services.', 5, 'menu-classique-1.jpg,menu-classique-2.jpg,menu-classique-3.jpg', 'Commander au minimum 7 jours avant la date de prestation. Stockage au frais recommandé.') ON CONFLICT DO NOTHING;


-- Export de la table plat_allergene
-- 15 lignes

INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (1, 1) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (5, 1) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (7, 1) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (9, 1) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (10, 1) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (12, 1) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (2, 2) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (4, 2) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (7, 2) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (8, 2) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (12, 2) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (10, 4) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (11, 4) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (12, 4) ON CONFLICT DO NOTHING;
INSERT INTO plat_allergene ("plat_id", "allergene_id") VALUES (6, 5) ON CONFLICT DO NOTHING;


-- Export de la table plat_menu
-- 14 lignes

INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (1, 1) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (10, 1) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (2, 2) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (6, 2) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (12, 2) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (3, 3) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (7, 3) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (13, 3) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (4, 4) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (9, 4) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (11, 4) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (2, 5) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (8, 5) ON CONFLICT DO NOTHING;
INSERT INTO plat_menu ("plat_id", "menu_id") VALUES (10, 5) ON CONFLICT DO NOTHING;


-- Export de la table commande
-- 5 lignes

INSERT INTO commande ("commande_id", "numero_commande", "date_commande", "date_prestation", "heure_livraison", "prix_menu", "nombre_personne", "prix_livraison", "adresse_prestation", "statut", "pret_materiel", "restitution_materiel", "user_id") VALUES (1, 'CMD-1765136226016-6677', '2025-12-07'::date, '2025-12-13'::date, '2025-12-13 21:35:00'::timestamp, 150, 10, 5, '30 rue Hippolyte Mulin', 'en attente', FALSE, FALSE, 4) ON CONFLICT DO NOTHING;
INSERT INTO commande ("commande_id", "numero_commande", "date_commande", "date_prestation", "heure_livraison", "prix_menu", "nombre_personne", "prix_livraison", "adresse_prestation", "statut", "pret_materiel", "restitution_materiel", "user_id") VALUES (2, 'CMD-1765138464508-1150', '2025-12-07'::date, '2025-12-10'::date, '2025-12-10 11:18:00'::timestamp, 150, 10, 5, '30 rue Hippolyte Mulin', 'annulée', FALSE, FALSE, 5) ON CONFLICT DO NOTHING;
INSERT INTO commande ("commande_id", "numero_commande", "date_commande", "date_prestation", "heure_livraison", "prix_menu", "nombre_personne", "prix_livraison", "adresse_prestation", "statut", "pret_materiel", "restitution_materiel", "user_id") VALUES (3, 'CMD-1765144307551-36', '2025-12-07'::date, '2025-12-10'::date, '2025-12-10 12:00:00'::timestamp, 200, 10, 5, '30 rue Hippolyte Mulin', 'en attente', TRUE, TRUE, 5) ON CONFLICT DO NOTHING;
INSERT INTO commande ("commande_id", "numero_commande", "date_commande", "date_prestation", "heure_livraison", "prix_menu", "nombre_personne", "prix_livraison", "adresse_prestation", "statut", "pret_materiel", "restitution_materiel", "user_id") VALUES (4, 'CMD-1765453166753-5642', '2025-12-11'::date, '2025-12-12'::date, '2025-12-12 16:43:00'::timestamp, 150, 10, 5, '30 rue Hippolyte Mulin', 'en attente', FALSE, FALSE, 7) ON CONFLICT DO NOTHING;
INSERT INTO commande ("commande_id", "numero_commande", "date_commande", "date_prestation", "heure_livraison", "prix_menu", "nombre_personne", "prix_livraison", "adresse_prestation", "statut", "pret_materiel", "restitution_materiel", "user_id") VALUES (5, 'CMD-1765536361050-943', '2025-12-12'::date, '2025-12-13'::date, '2025-12-13 15:45:00'::timestamp, 150, 10, 5, '10 Rue Fourcade', 'en attente', FALSE, FALSE, 9) ON CONFLICT DO NOTHING;


-- Export de la table commande_menu
-- 5 lignes

INSERT INTO commande_menu ("commande_id", "menu_id") VALUES (1, 1) ON CONFLICT DO NOTHING;
INSERT INTO commande_menu ("commande_id", "menu_id") VALUES (2, 1) ON CONFLICT DO NOTHING;
INSERT INTO commande_menu ("commande_id", "menu_id") VALUES (4, 1) ON CONFLICT DO NOTHING;
INSERT INTO commande_menu ("commande_id", "menu_id") VALUES (5, 1) ON CONFLICT DO NOTHING;
INSERT INTO commande_menu ("commande_id", "menu_id") VALUES (3, 5) ON CONFLICT DO NOTHING;


-- Export de la table avis
-- 8 lignes

INSERT INTO avis ("avis_id", "user_id", "commande_id", "note", "description", "image", "statut") VALUES (1, 1, NULL, '5', 'Service exceptionnel, plats délicieux et livraison rapide !', 'person-1.jpg', 'validée') ON CONFLICT DO NOTHING;
INSERT INTO avis ("avis_id", "user_id", "commande_id", "note", "description", "image", "statut") VALUES (2, 2, NULL, '5', 'Qualité irréprochable, je recommande vivement !', 'person-2.jpg', 'validée') ON CONFLICT DO NOTHING;
INSERT INTO avis ("avis_id", "user_id", "commande_id", "note", "description", "image", "statut") VALUES (3, 3, NULL, '4', 'Très bon rapport qualité-prix, plats savoureux.', 'person-3.jpg', 'validée') ON CONFLICT DO NOTHING;
INSERT INTO avis ("avis_id", "user_id", "commande_id", "note", "description", "image", "statut") VALUES (4, 1, NULL, '5', 'Parfait pour nos événements, nos invités ont adoré !', 'person-4.jpg', 'validée') ON CONFLICT DO NOTHING;
INSERT INTO avis ("avis_id", "user_id", "commande_id", "note", "description", "image", "statut") VALUES (5, 2, NULL, '5', 'Service client réactif et professionnel, bravo !', 'person-5.jpg', 'validée') ON CONFLICT DO NOTHING;
INSERT INTO avis ("avis_id", "user_id", "commande_id", "note", "description", "image", "statut") VALUES (6, 3, NULL, '4', 'Cuisine raffinée, produits frais et de qualité.', 'person-6.jpg', 'validée') ON CONFLICT DO NOTHING;
INSERT INTO avis ("avis_id", "user_id", "commande_id", "note", "description", "image", "statut") VALUES (7, 1, NULL, '5', 'Livraison toujours ponctuelle, emballage soigné.', 'person-7.jpg', 'validée') ON CONFLICT DO NOTHING;
INSERT INTO avis ("avis_id", "user_id", "commande_id", "note", "description", "image", "statut") VALUES (8, 2, NULL, '4', 'Menu varié qui plaît à toute la famille.', 'person-8.jpg', 'validée') ON CONFLICT DO NOTHING;

-- Table password_reset_tokens est vide

-- Export de la table commande_statut_history
-- 9 lignes

INSERT INTO commande_statut_history ("history_id", "commande_id", "ancien_statut", "nouveau_statut", "date_modification", "user_id_modification", "motif_annulation", "mode_contact") VALUES (1, 3, 'en attente', 'accepté', '2025-12-09 17:00:49'::timestamp, 6, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO commande_statut_history ("history_id", "commande_id", "ancien_statut", "nouveau_statut", "date_modification", "user_id_modification", "motif_annulation", "mode_contact") VALUES (2, 2, 'en attente', 'annulée', '2025-12-09 17:30:22'::timestamp, 5, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO commande_statut_history ("history_id", "commande_id", "ancien_statut", "nouveau_statut", "date_modification", "user_id_modification", "motif_annulation", "mode_contact") VALUES (3, 3, 'accepté', 'en préparation', '2025-12-10 13:39:40'::timestamp, 6, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO commande_statut_history ("history_id", "commande_id", "ancien_statut", "nouveau_statut", "date_modification", "user_id_modification", "motif_annulation", "mode_contact") VALUES (4, 3, 'en préparation', 'accepté', '2025-12-10 13:39:42'::timestamp, 6, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO commande_statut_history ("history_id", "commande_id", "ancien_statut", "nouveau_statut", "date_modification", "user_id_modification", "motif_annulation", "mode_contact") VALUES (5, 3, 'accepté', 'en attente', '2025-12-10 13:39:46'::timestamp, 6, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO commande_statut_history ("history_id", "commande_id", "ancien_statut", "nouveau_statut", "date_modification", "user_id_modification", "motif_annulation", "mode_contact") VALUES (6, 1, 'en attente', 'accepté', '2025-12-10 13:43:22'::timestamp, 6, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO commande_statut_history ("history_id", "commande_id", "ancien_statut", "nouveau_statut", "date_modification", "user_id_modification", "motif_annulation", "mode_contact") VALUES (7, 1, 'accepté', 'en attente', '2025-12-10 13:43:31'::timestamp, 6, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO commande_statut_history ("history_id", "commande_id", "ancien_statut", "nouveau_statut", "date_modification", "user_id_modification", "motif_annulation", "mode_contact") VALUES (8, 4, NULL, 'en attente', '2025-12-11 11:39:26'::timestamp, 7, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO commande_statut_history ("history_id", "commande_id", "ancien_statut", "nouveau_statut", "date_modification", "user_id_modification", "motif_annulation", "mode_contact") VALUES (9, 5, NULL, 'en attente', '2025-12-12 10:46:01'::timestamp, 9, NULL, NULL) ON CONFLICT DO NOTHING;

COMMIT;

-- Export terminé
-- Vérifiez les données dans Supabase Table Editor
