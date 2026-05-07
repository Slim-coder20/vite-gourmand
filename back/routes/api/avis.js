const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/auth");
const { createAvis, createAvisByCommande, getAvisPublic, getAvisById, getAllAvisValid, deleteAvis } = require("../../controllers/avisController");

console.log("🔧 Router /api/avis initialisé");

// Création de la route POST pour la création d'un avis
router.post("/", authenticateToken, createAvis);

// Création de la route POST pour créer un avis depuis une commande
router.post("/commande/:commandeId", authenticateToken, createAvisByCommande);

// Création de la route GET pour récupérer tous les avis publics //
router.get("/public", getAvisPublic);

// Création de la route GET pour récupérer tous les avis
// Retourne tous les avis validés pour l'affichage public
router.get("/", authenticateToken,getAllAvisValid);

// Création de la route GET pour récupérer un avis par son id
router.get("/:id", authenticateToken, getAvisById);

// Création de la route DELETE pour supprimer un avis par son ID
router.delete("/:id", authenticateToken, deleteAvis);

module.exports = router;
