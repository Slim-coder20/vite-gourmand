-- Script SQL pour insérer des données de test pour les menus
-- À exécuter dans Adminer ou via la ligne de commande MySQL

USE vite_gourmand;

-- 1. Insertion des régimes
INSERT INTO regime (libelle) VALUES 
  ('Classique'),
  ('Végétarien'),
  ('Vegan')
ON DUPLICATE KEY UPDATE libelle = VALUES(libelle);

-- 2. Insertion des thèmes
INSERT INTO theme (libelle) VALUES 
  ('Classique'),
  ('Noël'),
  ('Pâques'),
  ('Événement')
ON DUPLICATE KEY UPDATE libelle = VALUES(libelle);

-- 3. Insertion des allergènes
INSERT INTO allergene (libelle) VALUES 
  ('Gluten'),
  ('Lactose'),
  ('Fruits à coque'),
  ('Œufs'),
  ('Poisson'),
  ('Crustacés'),
  ('Soja'),
  ('Arachides')
ON DUPLICATE KEY UPDATE libelle = VALUES(libelle);

-- 4. Insertion des plats
INSERT INTO plat (titre_plat, photo) VALUES 
  -- Entrées
  ('Salade de saison', 'salade-saison.jpg'),
  ('Velouté de potiron', 'veloute-potiron.jpg'),
  ('Terrine de légumes', 'terrine-legumes.jpg'),
  ('Salade de chèvre chaud', 'salade-chevre.jpg'),
  -- Plats principaux
  ('Poulet rôti aux herbes', 'poulet-roti.jpg'),
  ('Saumon grillé', 'saumon-grille.jpg'),
  ('Lasagnes végétariennes', 'lasagnes-veg.jpg'),
  ('Risotto aux champignons', 'risotto-champignons.jpg'),
  ('Magret de canard', 'magret-canard.jpg'),
  -- Desserts
  ('Tarte aux pommes', 'tarte-pommes.jpg'),
  ('Mousse au chocolat', 'mousse-chocolat.jpg'),
  ('Tiramisu', 'tiramisu.jpg'),
  ('Salade de fruits', 'salade-fruits.jpg')
ON DUPLICATE KEY UPDATE titre_plat = VALUES(titre_plat);

-- 5. Insertion des relations plat_allergene
-- Salade de saison : aucun allergène
-- Velouté de potiron : Lactose
INSERT INTO plat_allergene (plat_id, allergene_id) VALUES 
  (2, 2), -- Velouté de potiron contient Lactose
  (4, 2), -- Salade de chèvre chaud contient Lactose
  (5, 1), -- Poulet rôti contient Gluten (sauce)
  (6, 5), -- Saumon grillé contient Poisson
  (7, 1), -- Lasagnes végétariennes contient Gluten
  (7, 2), -- Lasagnes végétariennes contient Lactose
  (8, 1), -- Risotto aux champignons contient Gluten
  (8, 2), -- Risotto aux champignons contient Lactose
  (10, 1), -- Tarte aux pommes contient Gluten
  (10, 4), -- Tarte aux pommes contient Œufs
  (11, 2), -- Mousse au chocolat contient Lactose
  (11, 4), -- Mousse au chocolat contient Œufs
  (12, 1), -- Tiramisu contient Gluten
  (12, 2), -- Tiramisu contient Lactose
  (12, 4)  -- Tiramisu contient Œufs
ON DUPLICATE KEY UPDATE plat_id = VALUES(plat_id);

-- 6. Insertion des menus
INSERT INTO menu (
  titre, 
  description, 
  nombre_personne_minimum, 
  prix_par_personne, 
  regime_id, 
  theme_id, 
  quantite_restante, 
  image, 
  conditions
) VALUES 
  (
    'Menu Découverte',
    'Un menu complet pour découvrir notre cuisine : salade de saison, poulet rôti aux herbes et tarte aux pommes. Parfait pour une première expérience avec nos services.',
    10,
    15.00,
    1, -- Classique
    1, -- Classique
    5,
    'menu-decouverte-1.jpg,menu-decouverte-2.jpg,menu-decouverte-3.jpg',
    'Commander au minimum 7 jours avant la date de prestation. Stockage au frais recommandé.'
  ),
  (
    'Menu Festif Noël',
    'Menu spécial pour les fêtes de fin d\'année : velouté de potiron, saumon grillé et tiramisu. Idéal pour célébrer en famille ou entre amis.',
    12,
    25.00,
    1, -- Classique
    2, -- Noël
    3,
    'menu-noel-1.jpg,menu-noel-2.jpg,menu-noel-3.jpg',
    'Commander au minimum 14 jours avant la date de prestation. Disponible uniquement en décembre. Stockage au frais obligatoire.'
  ),
  (
    'Menu Végétarien',
    'Menu 100% végétarien : terrine de légumes, lasagnes végétariennes et salade de fruits. Une option savoureuse et équilibrée.',
    8,
    18.00,
    2, -- Végétarien
    1, -- Classique
    8,
    'menu-vegetarien-1.jpg,menu-vegetarien-2.jpg',
    'Commander au minimum 5 jours avant la date de prestation. Contient du gluten et du lactose.'
  ),
  (
    'Menu Événement Premium',
    'Menu haut de gamme pour vos événements spéciaux : salade de chèvre chaud, magret de canard et mousse au chocolat. Un menu qui impressionnera vos invités.',
    15,
    35.00,
    1, -- Classique
    4, -- Événement
    2,
    'menu-premium-1.jpg,menu-premium-2.jpg,menu-premium-3.jpg,menu-premium-4.jpg',
    'Commander au minimum 21 jours avant la date de prestation. Service traiteur disponible sur demande. Stockage au frais obligatoire.'
  ),
  (
    'Menu Pâques',
    'Menu spécial Pâques : velouté de potiron, risotto aux champignons et tarte aux pommes. Parfait pour célébrer Pâques en famille.',
    10,
    20.00,
    2, -- Végétarien
    3, -- Pâques
    6,
    'menu-paques-1.jpg,menu-paques-2.jpg',
    'Commander au minimum 10 jours avant la date de prestation. Disponible en mars et avril. Contient du gluten et du lactose.'
  )
ON DUPLICATE KEY UPDATE titre = VALUES(titre);

-- 7. Insertion des relations plat_menu
-- Menu Découverte (menu_id = 1)
INSERT INTO plat_menu (menu_id, plat_id) VALUES 
  (1, 1), -- Salade de saison (entrée)
  (1, 5), -- Poulet rôti aux herbes (plat)
  (1, 10) -- Tarte aux pommes (dessert)
ON DUPLICATE KEY UPDATE menu_id = VALUES(menu_id);

-- Menu Festif Noël (menu_id = 2)
INSERT INTO plat_menu (menu_id, plat_id) VALUES 
  (2, 2), -- Velouté de potiron (entrée)
  (2, 6), -- Saumon grillé (plat)
  (2, 12) -- Tiramisu (dessert)
ON DUPLICATE KEY UPDATE menu_id = VALUES(menu_id);

-- Menu Végétarien (menu_id = 3)
INSERT INTO plat_menu (menu_id, plat_id) VALUES 
  (3, 3), -- Terrine de légumes (entrée)
  (3, 7), -- Lasagnes végétariennes (plat)
  (3, 13) -- Salade de fruits (dessert)
ON DUPLICATE KEY UPDATE menu_id = VALUES(menu_id);

-- Menu Événement Premium (menu_id = 4)
INSERT INTO plat_menu (menu_id, plat_id) VALUES 
  (4, 4), -- Salade de chèvre chaud (entrée)
  (4, 9), -- Magret de canard (plat)
  (4, 11) -- Mousse au chocolat (dessert)
ON DUPLICATE KEY UPDATE menu_id = VALUES(menu_id);

-- Menu Pâques (menu_id = 5)
INSERT INTO plat_menu (menu_id, plat_id) VALUES 
  (5, 2), -- Velouté de potiron (entrée)
  (5, 8), -- Risotto aux champignons (plat)
  (5, 10) -- Tarte aux pommes (dessert)
ON DUPLICATE KEY UPDATE menu_id = VALUES(menu_id);

-- Vérification des données insérées
SELECT 'Données de test insérées avec succès !' as message;
SELECT COUNT(*) as nombre_menus FROM menu;
SELECT COUNT(*) as nombre_plats FROM plat;
SELECT COUNT(*) as nombre_regimes FROM regime;
SELECT COUNT(*) as nombre_themes FROM theme;

