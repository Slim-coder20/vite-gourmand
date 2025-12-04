const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const authenticateToken = require("../../middleware/auth");

// Création de la route POST pour la création d'un avis
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { note, description, statut } = req.body;

    // Vérification que tous les champs sont requis
    if (!note || !description || !statut) {
      return res.status(400).json({
        message: "Tous les champs sont requis (note, description, statut)",
      });
    }

    // Vérification que la note est comprise entre 1 et 5
    const noteNum = parseInt(note);
    if (isNaN(noteNum) || noteNum < 1 || noteNum > 5) {
      return res.status(400).json({
        message: "La note doit être un nombre compris entre 1 et 5",
      });
    }

    // Vérification que le statut est valide (validée ou non validée)
    if (statut !== "validée" && statut !== "non validée") {
      return res.status(400).json({
        message: "Le statut doit être 'validée' ou 'non validée'",
      });
    }

    // Récupération de l'id de l'utilisateur authentifié (déjà vérifié par le middleware)
    const userId = req.user.userId;

    // Insertion de l'avis dans la base de données
    const [result] = await pool.query(
      "INSERT INTO avis (note, description, statut, user_id) VALUES (?, ?, ?, ?)",
      [noteNum, description, statut, userId]
    );

    // Récupération de l'avis créé
    const [avisRows] = await pool.query(
      "SELECT * FROM avis WHERE avis_id = ?",
      [result.insertId]
    );

    if (avisRows.length === 0) {
      return res.status(500).json({
        message: "Erreur lors de la récupération de l'avis créé",
      });
    }

    const avis = avisRows[0];

    // Retourner la réponse avec l'avis créé
    res.status(201).json({
      message: "Avis créé avec succès",
      avis: {
        avis_id: avis.avis_id,
        note: avis.note,
        description: avis.description,
        statut: avis.statut,
        user_id: avis.user_id,
      },
    });
    console.log("Avis créé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'avis",
      error: error.message,
    });
    console.error("Erreur lors de la création de l'avis :", error);
  }
});

// Création de la route GET pour récupérer tous les avis publics //
router.get("/public", async (req, res) => {
  try {
    // Récupérer tous les avis public validés avec les informations de l'utilisateur
    const [rows] = await pool.query(
      `SELECT 
        a.avis_id,
        a.note,
        a.description,
        a.image,
        a.statut,
        u.nom as user_nom,
        u.prenom as user_prenom
      FROM avis a
      LEFT JOIN user u ON a.user_id = u.user_id
      WHERE a.statut = 'validée'
      ORDER BY a.avis_id DESC
      LIMIT 10`
    );
    // Formater les résultats : formater les chemins d'images comme dans menus.js
    const avisFormatted = rows.map((avis) => {
      // Formater le chemin de l'image
      let imagePath = null;
      if (avis.image) {
        const imgTrimmed = avis.image.trim();
        // Si c'est déjà une URL complète (http:// ou https://), on la garde telle quelle
        if (
          imgTrimmed.startsWith("http://") ||
          imgTrimmed.startsWith("https://")
        ) {
          imagePath = imgTrimmed;
        } else {
          // Sinon, on ajoute le chemin de base pour les images locales
          // Les images doivent être dans /public/images/avis/ ou /images/avis/
          imagePath = imgTrimmed.startsWith("/")
            ? imgTrimmed
            : `/images/avis/${imgTrimmed}`;
        }
      }

      return {
        avis_id: avis.avis_id,
        note: avis.note,
        description: avis.description,
        image: imagePath, // Chemin formaté de l'image
        statut: avis.statut,
        user_nom: avis.user_nom,
        user_prenom: avis.user_prenom,
      };
    });

    res.status(200).json(avisFormatted);
    console.log("Avis publics récupérés avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des avis publics",
      error: error.message,
    });
    console.error("Erreur lors de la récupération des avis publics :", error);
  }
});

// Création de la route GET pour récupérer tous les avis
// Retourne tous les avis validés pour l'affichage public
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Récupérer tous les avis validés avec les informations de l'utilisateur
    const [rows] = await pool.query(
      `SELECT 
        a.avis_id,
        a.note,
        a.description,
        a.statut,
        a.user_id,
        u.email as user_email
      FROM avis a
      LEFT JOIN user u ON a.user_id = u.user_id
      WHERE a.statut = 'validée'
      ORDER BY a.avis_id DESC`
    );

    res.status(200).json(rows);
    console.log("Avis récupérés avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des avis",
      error: error.message,
    });
    console.error("Erreur lors de la récupération des avis :", error);
  }
});

// Création de la route GET pour récupérer un avis par son id
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Vérification que l'ID est un nombre valide
    const avisId = parseInt(id);
    if (isNaN(avisId) || avisId <= 0) {
      return res.status(400).json({ message: "ID d'avis invalide" });
    }

    // Vérifier que l'avis existe et appartient à l'utilisateur authentifié
    const [rows] = await pool.query(
      `SELECT 
        a.avis_id,
        a.note,
        a.description,
        a.statut,
        a.user_id,
        u.email as user_email
      FROM avis a
      LEFT JOIN user u ON a.user_id = u.user_id
      WHERE a.avis_id = ? AND a.user_id = ?`,
      [avisId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }

    // Retourner l'avis trouvé avec succès
    res.status(200).json(rows[0]);
    console.log("Avis trouvé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'avis",
      error: error.message,
    });
    console.error("Erreur lors de la récupération de l'avis :", error);
  }
});

// Création de la route DELETE pour supprimer un avis par son ID
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Vérification que l'ID est un nombre valide
    const avisId = parseInt(id);
    if (isNaN(avisId) || avisId <= 0) {
      return res.status(400).json({ message: "ID d'avis invalide" });
    }

    // Vérification que l'avis existe bien dans la base et appartient à l'utilisateur authentifié
    const [rows] = await pool.query(
      "SELECT * FROM avis WHERE avis_id = ? AND user_id = ?",
      [avisId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Avis non trouvé ou vous n'avez pas accès à cet avis",
      });
    }

    // Récupération de l'avis
    const avis = rows[0];

    // Vérification que l'avis peut être supprimé (seulement les avis "non validée")
    if (avis.statut !== "non validée") {
      return res.status(400).json({
        message: `Impossible de supprimer un avis avec le statut "${avis.statut}". Seuls les avis non validés peuvent être supprimés.`,
      });
    }

    // Suppression de l'avis
    const [result] = await pool.query(
      "DELETE FROM avis WHERE avis_id = ? AND user_id = ?",
      [avisId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }

    res.status(200).json({ message: "Avis supprimé avec succès" });
    console.log("Avis supprimé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'avis",
      error: error.message,
    });
    console.error("Erreur lors de la suppression de l'avis :", error);
  }
});

module.exports = router;
