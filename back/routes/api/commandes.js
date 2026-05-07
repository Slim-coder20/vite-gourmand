// Ce fichier contient les routes pour les commandes //
const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/auth");
const { getAllCommandes, getStatutsCommandeHistory, getCommandeById, createNewCommande, updateCommande, deleteCommande } = require("../../controllers/commandesController");

// Route GET pour récupérer toutes les commandes depuis l'espace utilisateur //
router.get("/", authenticateToken, getAllCommandes);

// Route pour récupérer l'historique des statuts d'une commande //
router.get("/:id/history", authenticateToken, getStatutsCommandeHistory);

// Route pour retourner une commande spécifique via son ID //
router.get("/:id", authenticateToken, getCommandeById);

// Route pour créer une nouvelle commande //
router.post("/", authenticateToken, createNewCommande);

// Route pour mettre à jour une commande //
router.put("/:id", authenticateToken, updateCommande);

// Route DELETE pour annuler une commande //
router.delete("/:id", authenticateToken, deleteCommande);

module.exports = router;
