USE vite_gourmand; 

CREATE TABLE role(
  role_id int NOT NULL AUTO_INCREMENT,
  libele  VARCHAR (50) NOT NULL,
  PRIMARY KEY (role_id)
  
);

-- Insertion des rôles par défaut
INSERT INTO role (libele) VALUES ('utilisateur');
INSERT INTO role (libele) VALUES ('admin');
INSERT INTO role (libele) VALUES ('employe');

CREATE TABLE user  (
  user_id int NOT NULL AUTO_INCREMENT,
  role_id int NOT NULL, 
  email VARCHAR (50) NOT NULL,
  password VARCHAR (255) NOT NULL,
  nom VARCHAR (50),
  prenom VARCHAR (50),
  telephone VARCHAR (50),
  ville VARCHAR (50),
  pays VARCHAR (50),
  adresse_postals VARCHAR (50),
  PRIMARY KEY (user_id),
  FOREIGN KEY (role_id) REFERENCES role(role_id)
);

CREATE TABLE avis(
  avis_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL, 
  note VARCHAR (50),
  description VARCHAR (50),
  statut VARCHAR(50),
  PRIMARY KEY (avis_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE allergene (
  allergene_id int NOT NULL AUTO_INCREMENT,
  libelle VARCHAR (50),
  PRIMARY KEY (allergene_id)
);


CREATE TABLE plat (
  plat_id int NOT NULL AUTO_INCREMENT,
  titre_plat VARCHAR (50),
  photo VARCHAR (255),
  PRIMARY KEY (plat_id)
);

CREATE TABLE plat_allergene (
  plat_id int NOT NULL,
  allergene_id int NOT NULL,
  CONSTRAINT pk_plat_allergene PRIMARY KEY (plat_id, allergene_id),
  FOREIGN KEY (plat_id) REFERENCES plat (plat_id),
  FOREIGN KEY (allergene_id) REFERENCES allergene (allergene_id)
);

CREATE TABLE regime (
  regime_id INT NOT NULL AUTO_INCREMENT,
  libelle VARCHAR (50),
  PRIMARY KEY (regime_id) 
); 

CREATE TABLE theme (
  theme_id INT NOT NULL AUTO_INCREMENT,
  libelle VARCHAR (50),
  PRIMARY KEY (theme_id)

);

CREATE TABLE menu (
  menu_id INT NOT NULL AUTO_INCREMENT,
  titre VARCHAR(50),
  nombre_personne_minimum INT,
  prix_par_personne DOUBLE,
  regime_id INT NOT NULL,
  theme_id INT NOT NULL,
  description VARCHAR(255),
  quantite_restante INT,
  PRIMARY KEY (menu_id),
  FOREIGN KEY (regime_id) REFERENCES regime (regime_id),
  FOREIGN KEY (theme_id) REFERENCES theme (theme_id)
); 

CREATE TABLE plat_menu (
  plat_id int NOT NULL,
  menu_id int NOT NULL,
  CONSTRAINT pk_plat_menu PRIMARY KEY (plat_id, menu_id),
  FOREIGN KEY (plat_id) REFERENCES plat (plat_id),
  FOREIGN KEY (menu_id) REFERENCES menu (menu_id)
);

CREATE TABLE commande (
  commande_id INT NOT NULL AUTO_INCREMENT,
  numero_commande VARCHAR(50) NOT NULL,
  date_commande DATE,
  date_prestation DATE,
  heure_livraison DATETIME,
  prix_menu DOUBLE,
  nombre_personne INT,
  prix_livraison DOUBLE,
  statut VARCHAR(50),
  pret_materiel BOOL,
  restitution_materiel BOOL,
  user_id INT NOT NULL, 
  PRIMARY KEY (commande_id),
  FOREIGN KEY (user_id) REFERENCES user (user_id)

);

CREATE TABLE commande_menu (
  commande_id int NOT NULL,
  menu_id int NOT NULL,
  CONSTRAINT pk_commande_menu PRIMARY KEY (commande_id, menu_id),
  FOREIGN KEY (commande_id) REFERENCES commande (commande_id),
  FOREIGN KEY (menu_id) REFERENCES menu (menu_id)
);
