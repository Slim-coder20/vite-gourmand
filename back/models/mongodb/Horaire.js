// Importation de mongoose
const mongoose = require("mongoose");

// Schéma pour les horaires d'ouverture
const horaireSchema = new mongoose.Schema({
  horaire_id: {
    type: Number,
    required: true,
    unique: true,
  },
  jour: {
    type: String,
    required: true,
  },
  heure_ouverture: {
    type: String,
    required: true,
  },
  heure_fermeture: {
    type: String,
    required: true,
  },
});

// Création et exportation du modèle
// Le premier paramètre est le nom de la collection (MongoDB ajoutera un "s")
const Horaire = mongoose.model("Horaire", horaireSchema);

// Exportation pour pouvoir l'utiliser dans d'autres fichiers
module.exports = Horaire;
