const express = require("express");
const { getAllContacts, createContact } = require("../../controllers/contactController");

// Création du router Express //
const router = express.Router();

// Route GET pour récupérer tous les messages de contact
router.get("/", getAllContacts);

// Route POST pour créer un message de contact
router.post("/", createContact);

// Exportation du router pour l'utiliser dans index.js
module.exports = router;

