const express = require("express");
const authenticateToken = require("../../middleware/auth");
const checkEmployeeRole = require("../../middleware/checkRole");
const {
  getAllHoraires,
  getHoraireById,
  createHoraire,
  updateHoraire,
  deleteHoraire,
} = require("../../controllers/horaireController");
// Création du router Express
const router = express.Router();

// Route GET pour récupérer tous les horaires
router.get("/", getAllHoraires);

// Route GET pour récupérer un horaire par son ID
router.get("/:id", getHoraireById);

// Route POST pour créer un horaire (employé uniquement)
router.post("/", authenticateToken, checkEmployeeRole, createHoraire);

// Route PUT pour mettre à jour un horaire (employé uniquement)
router.put("/:id", authenticateToken, checkEmployeeRole, updateHoraire);

// Route DELETE pour supprimer un horaire (employé uniquement)
router.delete(
  "/:id",
  authenticateToken,
  checkEmployeeRole,
  deleteHoraire,
);

// Exportation du router pour l'utiliser dans index.js
module.exports = router;
