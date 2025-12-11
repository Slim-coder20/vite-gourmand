const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const authenticateToken = require("../../middleware/auth");
const checkEmployeeRole = require("../../middleware/checkRole");

// Route GET pour récupérer tout les plats (public) ne necessite pas d'authentification //
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        p.plat_id,
        p.titre_plat,
        p.photo,
        GROUP_CONCAT(DISTINCT a.libelle ORDER BY a.libelle SEPARATOR ', ') as allergenes
      FROM plat p
      LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
      LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
      GROUP BY p.plat_id, p.titre_plat, p.photo
      ORDER BY p.titre_plat ASC`
    );
    // Formater les allergènes
    const plats = rows.map((plat) => ({
      plat_id: plat.plat_id,
      titre_plat: plat.titre_plat,
      photo: plat.photo,
      allergenes: plat.allergenes ? plat.allergenes.split(", ") : [],
    }));
    res.status(200).json(plats);
    console.log("Plats récupérés avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des plats",
      error: error.message,
    });
    console.error("Erreur lors de la récupération des plats :", error);
  }
});

// Route GET pour récuprérer un plat avec son id //
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT 
        p.plat_id,
        p.titre_plat,
        p.photo,
        GROUP_CONCAT(DISTINCT a.libelle ORDER BY a.libelle SEPARATOR ', ') as allergenes
      FROM plat p
      LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
      LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
      WHERE p.plat_id = ?
      GROUP BY p.plat_id, p.titre_plat, p.photo`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Plat non trouvé" });
    }

    const plat = rows[0];
    const platFormatted = {
      plat_id: plat.plat_id,
      titre_plat: plat.titre_plat,
      photo: plat.photo,
      allergenes: plat.allergenes ? plat.allergenes.split(", ") : [],
    };

    res.status(200).json(platFormatted);
    console.log("Plat récupéré avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du plat",
      error: error.message,
    });
    console.error("Erreur lors de la récupération du plat :", error);
  }
});

// Route PUT pour modifier un plat (employé uniquement)
router.put("/:id", authenticateToken, checkEmployeeRole, async (req, res) => {
  try {
    const { id } = req.params;
    const { titre_plat, photo, allergenes } = req.body;

    // 1. Vérifier que le plat existe
    const [platRows] = await pool.query(
      "SELECT * FROM plat WHERE plat_id = ?",
      [id]
    );

    if (platRows.length === 0) {
      return res.status(404).json({ message: "Plat non trouvé" });
    }

    // 2. Vérifier qu'au moins un champ est fourni
    if (!titre_plat && !photo && !allergenes) {
      return res.status(400).json({
        message: "Au moins un champ doit être fourni pour la mise à jour",
      });
    }

    // 3. Validation de la longueur de la photo (max 65535 caractères pour TEXT)
    if (photo !== undefined && photo !== null && photo.length > 65535) {
      return res.status(400).json({
        message: "L'URL de la photo est trop longue (maximum 65535 caractères)",
      });
    }

    // 4. Mettre à jour le plat
    const updateFields = [];
    const updateValues = [];

    if (titre_plat !== undefined) {
      updateFields.push("titre_plat = ?");
      updateValues.push(titre_plat);
    }
    if (photo !== undefined) {
      updateFields.push("photo = ?");
      updateValues.push(photo);
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await pool.query(
        `UPDATE plat SET ${updateFields.join(", ")} WHERE plat_id = ?`,
        updateValues
      );
    }

    // 4. Gérer les allergènes si fournis
    if (allergenes !== undefined && Array.isArray(allergenes)) {
      // Supprimer les allergènes existants
      await pool.query("DELETE FROM plat_allergene WHERE plat_id = ?", [id]);

      // Ajouter les nouveaux allergènes
      for (const allergeneLibelle of allergenes) {
        // Trouver ou créer l'allergène
        let [allergeneRows] = await pool.query(
          "SELECT allergene_id FROM allergene WHERE libelle = ?",
          [allergeneLibelle]
        );

        let allergeneId;
        if (allergeneRows.length === 0) {
          // Créer l'allergène s'il n'existe pas
          const [insertResult] = await pool.query(
            "INSERT INTO allergene (libelle) VALUES (?)",
            [allergeneLibelle]
          );
          allergeneId = insertResult.insertId;
        } else {
          allergeneId = allergeneRows[0].allergene_id;
        }

        // Lier le plat à l'allergène
        await pool.query(
          "INSERT INTO plat_allergene (plat_id, allergene_id) VALUES (?, ?)",
          [id, allergeneId]
        );
      }
    }

    // 6. Récupérer le plat mis à jour
    const [updatedPlatRows] = await pool.query(
      `SELECT 
        p.plat_id,
        p.titre_plat,
        p.photo,
        GROUP_CONCAT(DISTINCT a.libelle ORDER BY a.libelle SEPARATOR ', ') as allergenes
      FROM plat p
      LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
      LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
      WHERE p.plat_id = ?
      GROUP BY p.plat_id, p.titre_plat, p.photo`,
      [id]
    );

    const plat = updatedPlatRows[0];
    const platFormatted = {
      plat_id: plat.plat_id,
      titre_plat: plat.titre_plat,
      photo: plat.photo,
      allergenes: plat.allergenes ? plat.allergenes.split(", ") : [],
    };

    res.status(200).json({
      message: "Plat mis à jour avec succès",
      plat: platFormatted,
    });

    console.log("Plat mis à jour avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du plat",
      error: error.message,
    });
    console.error("Erreur lors de la mise à jour du plat :", error);
  }
});

// Route DELETE pour supprimer un plat (employé uniquement)
router.delete(
  "/:id",
  authenticateToken,
  checkEmployeeRole,
  async (req, res) => {
    try {
      const { id } = req.params;

      // 1. Vérifier que le plat existe
      const [platRows] = await pool.query(
        "SELECT * FROM plat WHERE plat_id = ?",
        [id]
      );

      if (platRows.length === 0) {
        return res.status(404).json({ message: "Plat non trouvé" });
      }

      // 2. Vérifier s'il y a des menus associés
      const [menuRows] = await pool.query(
        "SELECT COUNT(*) as count FROM plat_menu WHERE plat_id = ?",
        [id]
      );

      if (menuRows[0].count > 0) {
        return res.status(400).json({
          message:
            "Impossible de supprimer ce plat car il est associé à des menus. Veuillez d'abord le retirer des menus.",
        });
      }

      // 3. Supprimer les relations avec les allergènes
      await pool.query("DELETE FROM plat_allergene WHERE plat_id = ?", [id]);

      // 4. Supprimer le plat
      const [result] = await pool.query("DELETE FROM plat WHERE plat_id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Plat non trouvé" });
      }

      res.status(200).json({
        message: "Plat supprimé avec succès",
      });

      console.log("Plat supprimé avec succès");
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la suppression du plat",
        error: error.message,
      });
      console.error("Erreur lors de la suppression du plat :", error);
    }
  }
);

module.exports = router;
