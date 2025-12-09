-- Migration pour ajouter la table commande_statut_history

use vite_gourmand;

CREATE TABLE commande_statut_history (
  history_id int NOT NULL AUTO_INCREMENT,
  commande_id int NOT NULL,
  ancien_statut VARCHAR(50)  NULL,
  nouveau_statut VARCHAR(50) NOT NULL,
  date_modification DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id_modification int NOT NULL,
  PRIMARY KEY (history_id),
  FOREIGN KEY (commande_id) REFERENCES commande (commande_id),
  FOREIGN KEY (user_id_modification) REFERENCES user (user_id)
);
