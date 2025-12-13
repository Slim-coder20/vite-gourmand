-- Migration PostgreSQL pour Supabase
-- Conversion de migration-v001.sql de MySQL vers PostgreSQL

-- Création de la table role
CREATE TABLE IF NOT EXISTS role(
  role_id SERIAL PRIMARY KEY,
  libele VARCHAR(50) NOT NULL
);

-- Insertion des rôles par défaut
INSERT INTO role (libele) VALUES ('utilisateur') ON CONFLICT DO NOTHING;
INSERT INTO role (libele) VALUES ('admin') ON CONFLICT DO NOTHING;
INSERT INTO role (libele) VALUES ('employe') ON CONFLICT DO NOTHING;

-- Création de la table user
CREATE TABLE IF NOT EXISTS "user" (
  user_id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  nom VARCHAR(50),
  prenom VARCHAR(50),
  telephone VARCHAR(50),
  ville VARCHAR(50),
  pays VARCHAR(50),
  adresse_postals VARCHAR(50),
  FOREIGN KEY (role_id) REFERENCES role(role_id)
);

-- Création de la table avis
CREATE TABLE IF NOT EXISTS avis(
  avis_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  note VARCHAR(50),
  description TEXT,
  statut VARCHAR(50),
  image TEXT,
  FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

-- Création de la table allergene
CREATE TABLE IF NOT EXISTS allergene (
  allergene_id SERIAL PRIMARY KEY,
  libelle VARCHAR(50)
);

-- Création de la table plat
CREATE TABLE IF NOT EXISTS plat (
  plat_id SERIAL PRIMARY KEY,
  titre_plat VARCHAR(50),
  photo TEXT
);

-- Création de la table plat_allergene
CREATE TABLE IF NOT EXISTS plat_allergene (
  plat_id INTEGER NOT NULL,
  allergene_id INTEGER NOT NULL,
  CONSTRAINT pk_plat_allergene PRIMARY KEY (plat_id, allergene_id),
  FOREIGN KEY (plat_id) REFERENCES plat(plat_id),
  FOREIGN KEY (allergene_id) REFERENCES allergene(allergene_id)
);

-- Création de la table regime
CREATE TABLE IF NOT EXISTS regime (
  regime_id SERIAL PRIMARY KEY,
  libelle VARCHAR(50)
);

-- Création de la table theme
CREATE TABLE IF NOT EXISTS theme (
  theme_id SERIAL PRIMARY KEY,
  libelle VARCHAR(50)
);

-- Création de la table menu
CREATE TABLE IF NOT EXISTS menu (
  menu_id SERIAL PRIMARY KEY,
  titre VARCHAR(50),
  nombre_personne_minimum INTEGER,
  prix_par_personne DOUBLE PRECISION,
  regime_id INTEGER NOT NULL,
  theme_id INTEGER NOT NULL,
  description TEXT,
  quantite_restante INTEGER,
  image TEXT,
  conditions TEXT,
  FOREIGN KEY (regime_id) REFERENCES regime(regime_id),
  FOREIGN KEY (theme_id) REFERENCES theme(theme_id)
);

-- Création de la table plat_menu
CREATE TABLE IF NOT EXISTS plat_menu (
  plat_id INTEGER NOT NULL,
  menu_id INTEGER NOT NULL,
  CONSTRAINT pk_plat_menu PRIMARY KEY (plat_id, menu_id),
  FOREIGN KEY (plat_id) REFERENCES plat(plat_id),
  FOREIGN KEY (menu_id) REFERENCES menu(menu_id)
);

-- Création de la table commande
CREATE TABLE IF NOT EXISTS commande (
  commande_id SERIAL PRIMARY KEY,
  numero_commande VARCHAR(50) NOT NULL,
  date_commande DATE,
  date_prestation DATE,
  heure_livraison TIMESTAMP,
  prix_menu DOUBLE PRECISION,
  nombre_personne INTEGER,
  prix_livraison DOUBLE PRECISION,
  statut VARCHAR(50),
  pret_materiel BOOLEAN,
  restitution_materiel BOOLEAN,
  user_id INTEGER NOT NULL,
  adresse_prestation TEXT,
  FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

-- Création de la table commande_menu
CREATE TABLE IF NOT EXISTS commande_menu (
  commande_id INTEGER NOT NULL,
  menu_id INTEGER NOT NULL,
  CONSTRAINT pk_commande_menu PRIMARY KEY (commande_id, menu_id),
  FOREIGN KEY (commande_id) REFERENCES commande(commande_id),
  FOREIGN KEY (menu_id) REFERENCES menu(menu_id)
);

-- Création de la table password_reset_tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

-- Création des index pour password_reset_tokens
CREATE INDEX IF NOT EXISTS idx_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_expires_at ON password_reset_tokens(expires_at);

-- Création de la table commande_statut_history
CREATE TABLE IF NOT EXISTS commande_statut_history (
  history_id SERIAL PRIMARY KEY,
  commande_id INTEGER NOT NULL,
  ancien_statut VARCHAR(50),
  nouveau_statut VARCHAR(50),
  date_changement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (commande_id) REFERENCES commande(commande_id)
);

-- Ajout de la colonne actif à la table user si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user' AND column_name = 'actif') THEN
    ALTER TABLE "user" ADD COLUMN actif BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

