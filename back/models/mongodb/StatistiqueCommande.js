// Importation de mongoose
const mongoose = require("mongoose");

// Schéma pour les statistiques de commandes par menu
const statistiqueCommandeSchema = new mongoose.Schema({
  menu_id: {
    type: Number,
    required: true,
  },
  menu_titre: {
    type: String,
    required: true,
  },
  nombre_commandes: {
    type: Number,
    required: true,
    default: 0,
  },
  chiffre_affaires: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  date_creation: {
    type: Date,
    default: Date.now,
  },
});

// Création et exportation du modèle
const StatistiqueCommande = mongoose.model(
  "StatistiqueCommande",
  statistiqueCommandeSchema
);

module.exports = StatistiqueCommande;
