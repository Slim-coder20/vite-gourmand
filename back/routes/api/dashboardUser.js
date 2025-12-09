/**
 * Ce fichier contient les routes pour le dashboard de l'utilisateur
 */

const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/auth");
const pool = require("../../config/database");

// Route GET pour récupérer les information du dashboard du user authentifié //
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [userRows] = await pool.query(
      "SELECT * FROM user WHERE user_id = ?",
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const user = userRows[0];
    res.status(200).json({
      message: "Information du dashboard récupérées avec succès",
      user: {
        user_id: user.user_id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        adresse_postals: user.adresse_postals,
        ville: user.ville,
        pays: user.pays,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des information du dashboard",
      error: error.message,
    });
    console.error(
      "Erreur lors de la récupération des information du dashboard :",
      error
    );
  }
});

/**
 * ROUTE PUT pour mettre à jour les informations du dashboard du user connecté
 */
router.put("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    // 1. Vérification que tous les champs sont présents //
    const { nom, prenom, email, telephone, adresse_postals, ville, pays } =
      req.body;
    if (
      !nom ||
      !prenom ||
      !email ||
      !telephone ||
      !adresse_postals ||
      !ville ||
      !pays
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // 2. Validation du format de l'email //
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "L'email n'est pas valide (doit contenir un @ et un .)",
      });
    }

    // 3. Vérification si l'email existe déjà pour un autre utilisateur //
    const [existingUser] = await pool.query(
      "SELECT * FROM user WHERE email = ? AND user_id != ?",
      [email, userId]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "L'email existe déjà pour un autre utilisateur",
      });
    }

    // 4. Récupération des informations de l'utilisateur //
    const [userRows] = await pool.query(
      "SELECT * FROM user WHERE user_id = ?",
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // 5. Mise à jour des informations de l'utilisateur //
    const [result] = await pool.query(
      "UPDATE user SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse_postals = ?, ville = ?, pays = ? WHERE user_id = ?",
      [nom, prenom, email, telephone, adresse_postals, ville, pays, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(500).json({
        message: "Erreur lors de la mise à jour des information du dashboard",
      });
    }
    // 6. Récupération des informations de l'utilisateur mise à jour //
    const [updatedUserRows] = await pool.query(
      "SELECT * FROM user WHERE user_id = ?",
      [userId]
    );
    if (updatedUserRows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const updatedUser = updatedUserRows[0];

    // 7. Retourner les informations mises à jour (sans le mot de passe) //
    res.status(200).json({
      message: "Information du dashboard mise à jour avec succès",
      user: {
        user_id: updatedUser.user_id,
        nom: updatedUser.nom,
        prenom: updatedUser.prenom,
        email: updatedUser.email,
        telephone: updatedUser.telephone,
        adresse_postals: updatedUser.adresse_postals,
        ville: updatedUser.ville,
        pays: updatedUser.pays,
        role_id: updatedUser.role_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour des information du dashboard",
      error: error.message,
    });
    console.error(
      "Erreur lors de la mise à jour des information du dashboard :",
      error
    );
  }
});
module.exports = router;
