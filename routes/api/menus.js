// Ce fichier contient les routes pour les menus //
const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

// Route GET pour récupérer tous les menus (publique - pas d'authentification requise)
router.get("/", async (req, res) => {
  try {
    // Requete SQL pour récuprérer tous les menus //
    const [rows] = await pool.query(
      `SELECT 
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
      ORDER BY m.titre ASC`
    );

    // 1. Formater les résultats : convertir la galerie d'images en tableau //
    const menusFormatted = rows.map((menu) => ({
      menu_id: menu.menu_id,
      titre: menu.titre,
      description: menu.description,
      nombre_personne_minimum: menu.nombre_personne_minimum,
      prix_par_personne: menu.prix_par_personne,
      prix_total_minimum: menu.prix_total_minimum,
      quantite_restante: menu.quantite_restante,
      galerie_images: menu.image
        ? menu.image.split(",").map((img) => img.trim())
        : [],
      conditions: menu.conditions,
      regime: {
        regime_id: menu.regime_id,
        libelle: menu.regime_libelle,
      },
      theme: {
        theme_id: menu.theme_id,
        libelle: menu.theme_libelle,
      },
    }));

    // 2. Retourner les résultats avec succès //
    res.status(200).json(menusFormatted);
    console.log("Menus récupérés avec succès");
  } catch (error) {
    // 2. Retourner une erreur si la récupération des menus échoue //
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

    // 5. Construire la réponse avec toutes les informations //
    const response = {
      menu_id: menu.menu_id,
      titre: menu.titre,
      description: menu.description,
      nombre_personne_minimum: menu.nombre_personne_minimum,
      prix_par_personne: menu.prix_par_personne,
      prix_total_minimum: menu.prix_total_minimum,
      quantite_restante: menu.quantite_restante,
      galerie_images: menu.image
        ? menu.image.split(",").map((img) => img.trim())
        : [],
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

    // 6. Retourner la réponse avec succès //
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

module.exports = router;
