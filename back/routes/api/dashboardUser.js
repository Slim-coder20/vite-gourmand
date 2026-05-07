/**
 * Ce fichier contient les routes pour le dashboard de l'utilisateur
 */
const express = require("express");
const router = express.Router();
const {
  getDashboardUser,
  updateDashboardUser,
} = require("../../controllers/dashboardUserController");
const authenticateToken = require("../../middleware/auth");


// Route GET pour récupérer les information du dashboard du user authentifié //
router.get("/", authenticateToken, getDashboardUser);

/**
 * ROUTE PUT pour mettre à jour les informations du dashboard du user connecté
 */
router.put("/", authenticateToken, updateDashboardUser);



module.exports = router;
