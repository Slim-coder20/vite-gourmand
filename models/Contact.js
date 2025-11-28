// Importation de mongoose
const mongoose = require("mongoose");

// Schéma pour les messages de contact
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Sera rempli automatiquement avec la date actuelle
  },
});

// Création et exportation du modèle
const Contact = mongoose.model("Contact", contactSchema);

// Exportation pour pouvoir l'utiliser dans d'autres fichiers
module.exports = Contact;
