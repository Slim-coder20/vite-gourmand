// Ce fichier contient les routes pour les menus //
const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const authenticateToken = require("../../middleware/auth");
const checkEmployeeRole = require("../../middleware/checkRole");

// Route GET pour récupérer tous les menus (publique - pas d'authentification requise)
router.get("/", async (req, res) => {
  try {
    // 1. Récupérer les paramètres de la requête pour les filtres //
    const { prix_max, prix_min, theme_id, regime_id, min_personnes } =
      req.query;

    // 2. Initialiser les tableaux de conditions et paramètres //
    const conditions = [];
    const params = [];

    // 3. Ajouter les conditions de filtres si les paramètres existent //
    if (prix_max) {
      const prixMaxValue = parseFloat(prix_max);
      if (!isNaN(prixMaxValue) && prixMaxValue > 0) {
        conditions.push(
          "(m.prix_par_personne * m.nombre_personne_minimum) <= ?"
        );
        params.push(prixMaxValue);
      }
    }

    if (prix_min) {
      const prixMinValue = parseFloat(prix_min);
      if (!isNaN(prixMinValue) && prixMinValue > 0) {
        conditions.push(
          "(m.prix_par_personne * m.nombre_personne_minimum) >= ?"
        );
        params.push(prixMinValue);
      }
    }

    if (theme_id) {
      const themeIdValue = parseInt(theme_id);
      if (!isNaN(themeIdValue) && themeIdValue > 0) {
        conditions.push("m.theme_id = ?");
        params.push(themeIdValue);
      }
    }

    if (regime_id) {
      const regimeIdValue = parseInt(regime_id);
      if (!isNaN(regimeIdValue) && regimeIdValue > 0) {
        conditions.push("m.regime_id = ?");
        params.push(regimeIdValue);
      }
    }

    if (min_personnes) {
      const minPersonnesValue = parseInt(min_personnes);
      if (!isNaN(minPersonnesValue) && minPersonnesValue > 0) {
        conditions.push("m.nombre_personne_minimum >= ?");
        params.push(minPersonnesValue);
      }
    }

    // 4. Construire la requête SQL de base //
    let sql = `
      SELECT 
        m.menu_id,
        m.titre,
        m.description,
        m.nombre_personne_minimum,
        m.prix_par_personne,
        (m.prix_par_personne * m.nombre_personne_minimum) as prix_total_minimum,
        m.quantite_restante,
        m.image,
        m.conditions,
        r.regime_id,
        r.libelle as regime_libelle,
        t.theme_id,
        t.libelle as theme_libelle
      FROM menu m
      LEFT JOIN regime r ON m.regime_id = r.regime_id
      LEFT JOIN theme t ON m.theme_id = t.theme_id
    `;

    // 5. Ajouter WHERE si des conditions existent //
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY m.titre ASC";

    // 6. Exécuter la requête avec les paramètres //
    const [rows] = await pool.query(sql, params);

    // 7. Formater les résultats : convertir la galerie d'images en tableau //
    const menusFormatted = rows.map((menu) => {
      // Convertir la chaîne d'images en tableau et construire les chemins complets
      let galerie_images = [];
      if (menu.image) {
        galerie_images = menu.image.split(",").map((img) => {
          const imgTrimmed = img.trim();
          // Si c'est déjà une URL complète (http:// ou https://), on la garde telle quelle
          if (
            imgTrimmed.startsWith("http://") ||
            imgTrimmed.startsWith("https://")
          ) {
            return imgTrimmed;
          }
          // Sinon, on ajoute le chemin de base pour les images locales
          // Les images doivent être dans /public/images/menus/ ou /images/menus/
          return imgTrimmed.startsWith("/")
            ? imgTrimmed
            : `/images/menus/${imgTrimmed}`;
        });
      }

      return {
        menu_id: menu.menu_id,
        titre: menu.titre,
        description: menu.description,
        nombre_personne_minimum: menu.nombre_personne_minimum,
        prix_par_personne: menu.prix_par_personne,
        prix_total_minimum: menu.prix_total_minimum,
        quantite_restante: menu.quantite_restante,
        galerie_images: galerie_images,
        image_principale: galerie_images.length > 0 ? galerie_images[0] : null, // Première image comme image principale
        conditions: menu.conditions,
        regime: {
          regime_id: menu.regime_id,
          libelle: menu.regime_libelle,
        },
        theme: {
          theme_id: menu.theme_id,
          libelle: menu.theme_libelle,
        },
      };
    });

    // 8. Retourner les résultats avec succès //
    res.status(200).json(menusFormatted);
    console.log("Menus récupérés avec succès");
  } catch (error) {
    // Retourner une erreur si la récupération des menus échoue //
    res.status(500).json({
      message: "Erreur lors de la récupération des menus",
      error: error.message,
    });
    console.error("Erreur lors de la récupération des menus :", error);
  }
});

// Route GET pour récupérer un menu spécifique via son ID //
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Récupération de l'id du menu //

    // 1. Requête SQL pour récupérer les informations du menu avec régime et thème //
    const [menuRows] = await pool.query(
      `SELECT 
        m.*,
        (m.prix_par_personne * m.nombre_personne_minimum) as prix_total_minimum,
        r.regime_id,
        r.libelle as regime_libelle,
        t.theme_id,
        t.libelle as theme_libelle
      FROM menu m
      LEFT JOIN regime r ON m.regime_id = r.regime_id
      LEFT JOIN theme t ON m.theme_id = t.theme_id
      WHERE m.menu_id = ?`,
      [id]
    );

    // 2. Vérification que le menu existe //
    if (menuRows.length === 0) {
      return res.status(404).json({ message: "Menu non trouvé" });
    }

    const menu = menuRows[0];

    // 3. Requête SQL pour récupérer la liste des plats avec leurs allergènes //
    const [platsRows] = await pool.query(
      `SELECT 
        p.plat_id,
        p.titre_plat,
        p.photo,
        GROUP_CONCAT(DISTINCT a.libelle ORDER BY a.libelle SEPARATOR ', ') as allergenes
      FROM plat_menu pm
      JOIN plat p ON pm.plat_id = p.plat_id
      LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
      LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
      WHERE pm.menu_id = ?
      GROUP BY p.plat_id, p.titre_plat, p.photo
      ORDER BY p.plat_id`,
      [id]
    );

    // 4. Formater les allergènes : convertir la chaîne en tableau si nécessaire //
    const plats = platsRows.map((plat) => ({
      plat_id: plat.plat_id,
      titre_plat: plat.titre_plat,
      photo: plat.photo,
      allergenes: plat.allergenes ? plat.allergenes.split(", ") : [],
    }));

    // 5. Formater les images : convertir la chaîne en tableau et construire les chemins complets
    let galerie_images = [];
    if (menu.image) {
      galerie_images = menu.image.split(",").map((img) => {
        const imgTrimmed = img.trim();
        // Si c'est déjà une URL complète (http:// ou https://), on la garde telle quelle
        if (
          imgTrimmed.startsWith("http://") ||
          imgTrimmed.startsWith("https://")
        ) {
          return imgTrimmed;
        }
        // Sinon, on ajoute le chemin de base pour les images locales
        // Les images doivent être dans /public/images/menus/ ou /images/menus/
        return imgTrimmed.startsWith("/")
          ? imgTrimmed
          : `/images/menus/${imgTrimmed}`;
      });
    }

    // 6. Construire la réponse avec toutes les informations //
    const response = {
      menu_id: menu.menu_id,
      titre: menu.titre,
      description: menu.description,
      nombre_personne_minimum: menu.nombre_personne_minimum,
      prix_par_personne: menu.prix_par_personne,
      prix_total_minimum: menu.prix_total_minimum,
      quantite_restante: menu.quantite_restante,
      galerie_images: galerie_images,
      conditions: menu.conditions,
      regime: {
        regime_id: menu.regime_id,
        libelle: menu.regime_libelle,
      },
      theme: {
        theme_id: menu.theme_id,
        libelle: menu.theme_libelle,
      },
      plats: plats,
    };

    // 7. Retourner la réponse avec succès //
    res.status(200).json(response);
    console.log("Menu récupéré avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du menu",
      error: error.message,
    });
    console.error("Erreur lors de la récupération du menu :", error);
  }
});

// Route PUT pour modifier un menu (employé uniquement)
router.put("/:id", authenticateToken, checkEmployeeRole, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titre,
      description,
      nombre_personne_minimum,
      prix_par_personne,
      quantite_restante,
      regime_id,
      theme_id,
      image,
      conditions,
    } = req.body;

    //1. Vérifier que le menu existe
    const [menuRows] = await pool.query(
      "SELECT * FROM menu WHERE menu_id = ?",
      [id]
    );

    if (menuRows.length === 0) {
      return res.status(404).json({ message: "Menu non trouvé" });
    }

    // 2. Vérifier qu'au moins un champ est fourni pour la mise à jour
    if (
      !titre &&
      !description &&
      nombre_personne_minimum === undefined &&
      prix_par_personne === undefined &&
      quantite_restante === undefined &&
      !regime_id &&
      !theme_id &&
      !image &&
      !conditions
    ) {
      return res.status(400).json({
        message: "Au moins un champ doit être fourni pour la mise à jour",
      });
    }
    // 3. Construire la requête de mise à jour dynamiquement
    const updateFields = [];
    const updateValues = [];

    if (titre !== undefined) {
      updateFields.push("titre = ?");
      updateValues.push(titre);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }
    if (nombre_personne_minimum !== undefined) {
      updateFields.push("nombre_personne_minimum = ?");
      updateValues.push(nombre_personne_minimum);
    }
    if (prix_par_personne !== undefined) {
      updateFields.push("prix_par_personne = ?");
      updateValues.push(prix_par_personne);
    }
    if (quantite_restante !== undefined) {
      updateFields.push("quantite_restante = ?");
      updateValues.push(quantite_restante);
    }
    if (regime_id !== undefined) {
      // Vérifier que le régime existe
      const [regimeRows] = await pool.query(
        "SELECT * FROM regime WHERE regime_id = ?",
        [regime_id]
      );
      if (regimeRows.length === 0) {
        return res.status(404).json({ message: "Régime non trouvé" });
      }
      updateFields.push("regime_id = ?");
      updateValues.push(regime_id);
    }
    if (theme_id !== undefined) {
      // Vérifier que le thème existe
      const [themeRows] = await pool.query(
        "SELECT * FROM theme WHERE theme_id = ?",
        [theme_id]
      );
      if (themeRows.length === 0) {
        return res.status(404).json({ message: "Thème non trouvé" });
      }
      updateFields.push("theme_id = ?");
      updateValues.push(theme_id);
    }
    if (image !== undefined) {
      updateFields.push("image = ?");
      updateValues.push(image);
    }
    if (conditions !== undefined) {
      updateFields.push("conditions = ?");
      updateValues.push(conditions);
    }

    // 4. Ajouter l'ID à la fin pour la clause WHERE
    updateValues.push(id);

    // 5. Exécuter la mise à jour
    const [result] = await pool.query(
      `UPDATE menu SET ${updateFields.join(", ")} WHERE menu_id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Menu non trouvé" });
    }
    // 6. Récupérer le menu mis à jour
    const [updatedMenuRows] = await pool.query(
      `SELECT 
          m.*,
          (m.prix_par_personne * m.nombre_personne_minimum) as prix_total_minimum,
          r.regime_id,
          r.libelle as regime_libelle,
          t.theme_id,
          t.libelle as theme_libelle
        FROM menu m
        LEFT JOIN regime r ON m.regime_id = r.regime_id
        LEFT JOIN theme t ON m.theme_id = t.theme_id
        WHERE m.menu_id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Menu mis à jour avec succès",
      menu: updatedMenuRows[0],
    });

    console.log("Menu mis à jour avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du menu",
      error: error.message,
    });
    console.error("Erreur lors de la mise à jour du menu :", error);
  }
});

// Route DELETE pour supprimer un menu (employé uniquement)
router.delete(
  "/:id",
  authenticateToken,
  checkEmployeeRole,
  async (req, res) => {
    try {
      const { id } = req.params;

      // 1. Vérifier que le menu existe
      const [menuRows] = await pool.query(
        "SELECT * FROM menu WHERE menu_id = ?",
        [id]
      );

      if (menuRows.length === 0) {
        return res.status(404).json({ message: "Menu non trouvé" });
      }

      // 2. Vérifier s'il y a des commandes associées
      const [commandeRows] = await pool.query(
        "SELECT COUNT(*) as count FROM commande_menu WHERE menu_id = ?",
        [id]
      );

      if (commandeRows[0].count > 0) {
        return res.status(400).json({
          message:
            "Impossible de supprimer ce menu car il est associé à des commandes. Vous pouvez le désactiver en mettant quantite_restante à 0.",
        });
      }

      // 3. Supprimer les relations avec les plats
      await pool.query("DELETE FROM plat_menu WHERE menu_id = ?", [id]);

      // 4. Supprimer le menu
      const [result] = await pool.query("DELETE FROM menu WHERE menu_id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Menu non trouvé" });
      }

      res.status(200).json({
        message: "Menu supprimé avec succès",
      });

      console.log("Menu supprimé avec succès");
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la suppression du menu",
        error: error.message,
      });
      console.error("Erreur lors de la suppression du menu :", error);
    }
  }
);

// ============================================
// ROUTES POUR LA GESTION DES PLATS D'UN MENU
// ============================================

// Route PUT pour remplacer tous les plats d'un menu (employé uniquement)
router.put(
  "/:id/plats",
  authenticateToken,
  checkEmployeeRole,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { plats } = req.body;

      // 1. Vérifier que le menu existe
      const [menuRows] = await pool.query(
        "SELECT * FROM menu WHERE menu_id = ?",
        [id]
      );

      if (menuRows.length === 0) {
        return res.status(404).json({ message: "Menu non trouvé" });
      }

      // 2. Vérifier que plats est un tableau
      if (!Array.isArray(plats)) {
        return res.status(400).json({
          message: "Le champ 'plats' doit être un tableau de plat_id",
        });
      }

      // 3. Vérifier que tous les plats existent
      if (plats.length > 0) {
        const placeholders = plats.map(() => "?").join(",");
        const [platsRows] = await pool.query(
          `SELECT plat_id FROM plat WHERE plat_id IN (${placeholders})`,
          plats
        );

        if (platsRows.length !== plats.length) {
          const foundIds = platsRows.map((row) => row.plat_id);
          const notFoundIds = plats.filter((id) => !foundIds.includes(id));
          return res.status(404).json({
            message: `Certains plats n'existent pas : ${notFoundIds.join(
              ", "
            )}`,
          });
        }
      }

      // 4. Démarrer une transaction pour garantir la cohérence
      await pool.query("START TRANSACTION");

      try {
        // 5. Supprimer tous les plats existants du menu
        await pool.query("DELETE FROM plat_menu WHERE menu_id = ?", [id]);

        // 6. Ajouter les nouveaux plats
        if (plats.length > 0) {
          const values = plats.map((plat_id) => [id, plat_id]);
          const placeholders = values.map(() => "(?, ?)").join(",");
          const flatValues = values.flat();

          await pool.query(
            `INSERT INTO plat_menu (menu_id, plat_id) VALUES ${placeholders}`,
            flatValues
          );
        }

        // 7. Valider la transaction
        await pool.query("COMMIT");

        // 8. Récupérer les plats mis à jour avec leurs allergènes
        const [platsRows] = await pool.query(
          `SELECT 
            p.plat_id,
            p.titre_plat,
            p.photo,
            GROUP_CONCAT(DISTINCT a.libelle ORDER BY a.libelle SEPARATOR ', ') as allergenes
          FROM plat_menu pm
          JOIN plat p ON pm.plat_id = p.plat_id
          LEFT JOIN plat_allergene pa ON p.plat_id = pa.plat_id
          LEFT JOIN allergene a ON pa.allergene_id = a.allergene_id
          WHERE pm.menu_id = ?
          GROUP BY p.plat_id, p.titre_plat, p.photo
          ORDER BY p.plat_id`,
          [id]
        );

        // 9. Formater les allergènes
        const platsFormatted = platsRows.map((plat) => ({
          plat_id: plat.plat_id,
          titre_plat: plat.titre_plat,
          photo: plat.photo,
          allergenes: plat.allergenes ? plat.allergenes.split(", ") : [],
        }));

        res.status(200).json({
          message: "Plats du menu mis à jour avec succès",
          menu_id: parseInt(id),
          plats: platsFormatted,
        });

        console.log("Plats du menu mis à jour avec succès");
      } catch (error) {
        // En cas d'erreur, annuler la transaction
        await pool.query("ROLLBACK");
        throw error;
      }
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la mise à jour des plats du menu",
        error: error.message,
      });
      console.error("Erreur lors de la mise à jour des plats du menu :", error);
    }
  }
);

// Route POST pour ajouter un plat à un menu (employé uniquement)
router.post(
  "/:id/plats",
  authenticateToken,
  checkEmployeeRole,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { plat_id } = req.body;

      // 1. Vérifier que le menu existe
      const [menuRows] = await pool.query(
        "SELECT * FROM menu WHERE menu_id = ?",
        [id]
      );

      if (menuRows.length === 0) {
        return res.status(404).json({ message: "Menu non trouvé" });
      }

      // 2. Vérifier que plat_id est fourni
      if (!plat_id) {
        return res.status(400).json({
          message: "Le champ 'plat_id' est requis",
        });
      }

      // 3. Vérifier que le plat existe
      const [platRows] = await pool.query(
        "SELECT * FROM plat WHERE plat_id = ?",
        [plat_id]
      );

      if (platRows.length === 0) {
        return res.status(404).json({ message: "Plat non trouvé" });
      }

      // 4. Vérifier que le plat n'est pas déjà associé au menu
      const [existingRows] = await pool.query(
        "SELECT * FROM plat_menu WHERE menu_id = ? AND plat_id = ?",
        [id, plat_id]
      );

      if (existingRows.length > 0) {
        return res.status(400).json({
          message: "Ce plat est déjà associé à ce menu",
        });
      }

      // 5. Ajouter le plat au menu
      await pool.query(
        "INSERT INTO plat_menu (menu_id, plat_id) VALUES (?, ?)",
        [id, plat_id]
      );

      // 6. Récupérer le plat ajouté avec ses allergènes
      const [platRowsWithAllergenes] = await pool.query(
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
        [plat_id]
      );

      const plat = platRowsWithAllergenes[0];
      const platFormatted = {
        plat_id: plat.plat_id,
        titre_plat: plat.titre_plat,
        photo: plat.photo,
        allergenes: plat.allergenes ? plat.allergenes.split(", ") : [],
      };

      res.status(201).json({
        message: "Plat ajouté au menu avec succès",
        menu_id: parseInt(id),
        plat: platFormatted,
      });

      console.log("Plat ajouté au menu avec succès");
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de l'ajout du plat au menu",
        error: error.message,
      });
      console.error("Erreur lors de l'ajout du plat au menu :", error);
    }
  }
);

// Route DELETE pour retirer un plat d'un menu (employé uniquement)
router.delete(
  "/:id/plats/:platId",
  authenticateToken,
  checkEmployeeRole,
  async (req, res) => {
    try {
      const { id, platId } = req.params;

      // 1. Vérifier que le menu existe
      const [menuRows] = await pool.query(
        "SELECT * FROM menu WHERE menu_id = ?",
        [id]
      );

      if (menuRows.length === 0) {
        return res.status(404).json({ message: "Menu non trouvé" });
      }

      // 2. Vérifier que le plat existe
      const [platRows] = await pool.query(
        "SELECT * FROM plat WHERE plat_id = ?",
        [platId]
      );

      if (platRows.length === 0) {
        return res.status(404).json({ message: "Plat non trouvé" });
      }

      // 3. Vérifier que le plat est associé au menu
      const [existingRows] = await pool.query(
        "SELECT * FROM plat_menu WHERE menu_id = ? AND plat_id = ?",
        [id, platId]
      );

      if (existingRows.length === 0) {
        return res.status(404).json({
          message: "Ce plat n'est pas associé à ce menu",
        });
      }

      // 4. Retirer le plat du menu
      await pool.query(
        "DELETE FROM plat_menu WHERE menu_id = ? AND plat_id = ?",
        [id, platId]
      );

      res.status(200).json({
        message: "Plat retiré du menu avec succès",
        menu_id: parseInt(id),
        plat_id: parseInt(platId),
      });

      console.log("Plat retiré du menu avec succès");
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors du retrait du plat du menu",
        error: error.message,
      });
      console.error("Erreur lors du retrait du plat du menu :", error);
    }
  }
);

module.exports = router;
