-- Ajout de la colonne image à la table user pour stocker la photo de profil


-- Ajouter la colonne image (chemin/URL de l'image)
ALTER TABLE "user" 
ADD COLUMN image VARCHAR(255) NULL;

-- Commentaire pour documenter la colonne
COMMENT ON COLUMN "user".image IS 'Chemin ou URL de la photo de profil de l''utilisateur';



