const express = require("express");
const Horaire = require("../../models/Horaire");
const authenticateToken = require("../../middleware/auth");
const checkEmployeeRole = require("../../middleware/checkRole");

// Création du router Express
const router = express.Router();

// Route GET pour récupérer tous les horaires
router.get("/", async (req, res) => {
  try {
    const horaires = await Horaire.find();
    res.status(200).json(horaires);
    console.log("Horaires récupérés avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des horaires",
      error: error.message,
    });
    console.error("Erreur lors de la récupération des horaires :", error);
  }
});

// Route GET pour récupérer un horaire par son ID
router.get("/:id", async (req, res) => {
  try {
    const horaire = await Horaire.findById(req.params.id);
    if (!horaire) {
      return res.status(404).json({ message: "Horaire non trouvé" });
    }
    res.status(200).json(horaire);
    console.log("Horaire trouvé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'horaire",
      error: error.message,
    });
    console.error("Erreur lors de la récupération de l'horaire :", error);
  }
});

// Route POST pour créer un horaire (employé uniquement)
router.post("/", authenticateToken, checkEmployeeRole, async (req, res) => {
  try {
    const { horaire_id, jour, heure_ouverture, heure_fermeture } = req.body;

    // Vérification que tous les champs requis sont présents
    if (!horaire_id || !jour || !heure_ouverture || !heure_fermeture) {
      return res.status(400).json({
        message:
          "Tous les champs sont requis (horaire_id, jour, heure_ouverture, heure_fermeture)",
      });
    }

    const horaire = new Horaire({
      horaire_id,
      jour,
      heure_ouverture,
      heure_fermeture,
    });
    await horaire.save();
    res.status(201).json(horaire);
    console.log("Horaire créé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'horaire",
      error: error.message,
    });
    console.error("Erreur lors de la création de l'horaire :", error);
  }
});

// Route PUT pour mettre à jour un horaire (employé uniquement)
router.put("/:id", authenticateToken, checkEmployeeRole, async (req, res) => {
  try {
    const { jour, heure_ouverture, heure_fermeture } = req.body;

    // Vérification que au moins un champ est fourni pour la mise à jour
    if (!jour && !heure_ouverture && !heure_fermeture) {
      return res.status(400).json({
        message: "Au moins un champ doit être fourni pour la mise à jour",
      });
    }

    // Construction de l'objet de mise à jour avec seulement les champs fournis
    const updateData = {};
    if (jour) updateData.jour = jour;
    if (heure_ouverture) updateData.heure_ouverture = heure_ouverture;
    if (heure_fermeture) updateData.heure_fermeture = heure_fermeture;

    // Mise à jour de l'horaire
    // { new: true } retourne le document mis à jour au lieu de l'ancien
    const horaire = await Horaire.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!horaire) {
      return res.status(404).json({ message: "Horaire non trouvé" });
    }

    res.status(200).json(horaire);
    console.log("Horaire mis à jour avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'horaire",
      error: error.message,
    });
    console.error("Erreur lors de la mise à jour de l'horaire :", error);
  }
});

// Route DELETE pour supprimer un horaire (employé uniquement)
router.delete(
  "/:id",
  authenticateToken,
  checkEmployeeRole,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Vérifier que l'horaire existe
      const horaire = await Horaire.findById(id);
      if (!horaire) {
        return res.status(404).json({ message: "Horaire non trouvé" });
      }

      // Supprimer l'horaire
      await Horaire.findByIdAndDelete(id);

      res.status(200).json({
        message: "Horaire supprimé avec succès",
      });

      console.log("Horaire supprimé avec succès");
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la suppression de l'horaire",
        error: error.message,
      });
      console.error("Erreur lors de la suppression de l'horaire :", error);
    }
  }
);

// Exportation du router pour l'utiliser dans index.js
module.exports = router;
