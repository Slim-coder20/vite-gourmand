// Ce fichier contient les routes pour les menus //
const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

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

module.exports = router;
