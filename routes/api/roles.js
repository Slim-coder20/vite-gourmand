const express = require("express");
const pool = require("../../config/database");

// Création du router Express
const router = express.Router();

// Route GET pour récupérer tous les rôles
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM role");
    res.status(200).json(rows);
    console.log("Rôles récupérés avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des rôles",
      error: error.message,
    });
    console.error("Erreur lors de la récupération des rôles :", error);
  }
});

// Route GET pour récupérer un rôle par son ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM role WHERE role_id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    res.status(200).json(rows[0]);
    console.log("Rôle trouvé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du rôle",
      error: error.message,
    });
    console.error("Erreur lors de la récupération du rôle :", error);
  }
});

// Route POST pour créer un rôle
router.post("/", async (req, res) => {
  try {
    const { libele } = req.body;

    // Vérification que le champ requis est présent
    if (!libele) {
      return res.status(400).json({
        message: "Le champ libele est requis",
      });
    }

    // Insertion du nouveau rôle
    const [result] = await pool.query("INSERT INTO role (libele) VALUES (?)", [
      libele,
    ]);

    // Récupération du rôle créé
    const [rows] = await pool.query("SELECT * FROM role WHERE role_id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
    console.log("Rôle créé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du rôle",
      error: error.message,
    });
    console.error("Erreur lors de la création du rôle :", error);
  }
});

// Route PUT pour mettre à jour un rôle
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { libele } = req.body;

    // Vérification que le champ est fourni
    if (!libele) {
      return res.status(400).json({
        message: "Le champ libele est requis pour la mise à jour",
      });
    }

    // Mise à jour du rôle
    const [result] = await pool.query(
      "UPDATE role SET libele = ? WHERE role_id = ?",
      [libele, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    // Récupération du rôle mis à jour
    const [rows] = await pool.query("SELECT * FROM role WHERE role_id = ?", [
      id,
    ]);

    res.status(200).json(rows[0]);
    console.log("Rôle mis à jour avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du rôle",
      error: error.message,
    });
    console.error("Erreur lors de la mise à jour du rôle :", error);
  }
});

// Route DELETE pour supprimer un rôle
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification si le rôle existe
    const [checkRows] = await pool.query(
      "SELECT * FROM role WHERE role_id = ?",
      [id]
    );

    if (checkRows.length === 0) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    // Suppression du rôle
    await pool.query("DELETE FROM role WHERE role_id = ?", [id]);

    res.status(200).json({ message: "Rôle supprimé avec succès" });
    console.log("Rôle supprimé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du rôle",
      error: error.message,
    });
    console.error("Erreur lors de la suppression du rôle :", error);
  }
});

// Exportation du router pour l'utiliser dans index.js
module.exports = router;
