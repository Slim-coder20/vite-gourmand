const express = require("express");
const Contact = require("../../models/Contact");

// Création du router Express //
const router = express.Router();

// Route GET pour récupérer tous les messages de contact
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
    console.log("Messages de contact récupérés avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des messages de contact",
      error: error.message,
    });
    console.error(
      "Erreur lors de la récupération des messages de contact :",
      error
    );
  }
});

// Route POST pour créer un message de contact
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, content } = req.body;

    // Vérification que tous les champs sont présents
    if (!name || !email || !subject || !content) {
      return res.status(400).json({
        message: "Tous les champs sont requis (name, email, subject, content)",
      });
    }

    // Création du nouveau message de contact
    const contact = new Contact({
      name,
      email,
      subject,
      content,
    });

    // Sauvegarde dans la base de données
    await contact.save();

    res.status(201).json(contact);
    console.log("Message de contact créé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du message de contact",
      error: error.message,
    });
    console.error("Erreur lors de la création du message de contact :", error);
  }
});

// Exportation du router pour l'utiliser dans index.js
module.exports = router;
