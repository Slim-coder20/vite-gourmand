// Ce fichier contient les routes pour les commandes //
const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const authenticateToken = require("../../middleware/auth");
const { sendOrderConfirmationEmail } = require("../../config/email");
const { sendMaterialReturnEmail } = require("../../config/email");
const StatistiqueCommande = require("../../models/StatistiqueCommande");

// Route GET pour récupérer toutes les commandes depuis l'espace utilisateur //
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Récupéré depuis le middleware

    // Requête SQL avec jointures
    const [rows] = await pool.query(
      `SELECT 
        c.*,
        m.menu_id,
        m.titre as menu_titre,
        m.prix_par_personne
      FROM commande c
      LEFT JOIN commande_menu cm ON c.commande_id = cm.commande_id
      LEFT JOIN menu m ON cm.menu_id = m.menu_id
      WHERE c.user_id = ?
      ORDER BY c.date_commande DESC`,
      [userId]
    );
    // Retourner les résultats avec succès //
    res.status(200).json(rows);
    console.log("Commandes récupérées avec succès");
  } catch (error) {
    // Retourner une erreur si la récupération des commandes échoue //
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes",
      error: error.message,
    });
  }
});

// Route pour récupérer l'historique des statuts d'une commande //
router.get("/:id/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    // 1. Vérifier que la commande existe et appartient à l'utilisateur authentifié //
    const [commandeRows] = await pool.query(
      "SELECT * FROM commande WHERE commande_id = ? AND user_id = ?",
      [id, userId]
    );
    if (commandeRows.length === 0) {
      return res.status(404).json({
        message:
          "Commande non trouvée ou vous n'avez pas accès à cette commande",
      });
    }
    // 2. Vérification du statut de la commande //
    // L'utilisateur peut accéder au suivi uniquement si la commande est "accepté" ou supérieur
    if (
      commandeRows[0].statut === "en attente" ||
      commandeRows[0].statut === "annulée"
    ) {
      return res.status(403).json({
        message:
          "Le suivi de commande n'est disponible qu'une fois la commande acceptée",
      });
    }
    // 3. Récupérer l'historique des statuts de la commande //
    const [rows] = await pool.query(
      "SELECT * FROM commande_statut_history WHERE commande_id = ? ORDER BY date_modification ASC",
      [id]
    );
    // 4. Retourner l'historique des statuts de la commande //
    // Retourner un tableau vide si aucun historique n'existe (c'est normal)
    res.status(200).json(rows);
    console.log("Historique des statuts récupéré avec succès");
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération de l'historique des statuts de la commande",
      error: error.message,
    });
    console.error(
      "Erreur lors de la récupération de l'historique des statuts de la commande :",
      error
    );
  }
});

// Route pour retourner une commande spécifique via son ID //
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Récupération de l'id de la commande //
    const userId = req.user.userId; // Récupération du user authentifié //

    // On vérifie que la commande existe et appartient à l'utilisateur //
    const [rows] = await pool.query(
      `SELECT 
        c.*,
        m.menu_id,
        m.titre as menu_titre,
        m.prix_par_personne
      FROM commande c
      LEFT JOIN commande_menu cm ON c.commande_id = cm.commande_id
      LEFT JOIN menu m ON cm.menu_id = m.menu_id
      WHERE c.commande_id = ? AND c.user_id = ?`,
      [id, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    // Retourner la commande trouvée avec succès //
    res.status(200).json(rows[0]);
    console.log("Commande trouvée avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la commande",
      error: error.message,
    });
  }
});

// Route pour créer une nouvelle commande //
router.post("/", authenticateToken, async (req, res) => {
  try {
    //1. Récupération de l'id du user authentifié //
    const userId = req.user.userId;
    //2. Récupération des données de la commande //
    const {
      menu_id,
      date_prestation,
      heure_livraison,
      nombre_personne,
      adresse_prestation,
      pret_materiel = false,
      restitution_materiel = false,
    } = req.body;
    //3. Vérification que tous les champs requis sont présents //
    if (
      !menu_id ||
      !date_prestation ||
      !heure_livraison ||
      !nombre_personne ||
      !adresse_prestation
    ) {
      return res.status(400).json({
        message:
          "Les champs menu_id, date_prestation, heure_livraison, nombre_personne et adresse_prestation sont requis",
      });
    }
    //4. Récupération des informations de l'utilisateur //
    const [userRows] = await pool.query(
      "SELECT nom, prenom, email, telephone, ville, adresse_postals FROM user WHERE user_id = ?",
      [userId]
    );
    // Vérification que l'utilisateur existe dans la base de données //
    if (userRows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Récupération des informations de l'utilisateur //
    const user = userRows[0];
    //5. Récupération des informations du menu //
    const [menuRows] = await pool.query(
      "SELECT menu_id, titre, nombre_personne_minimum, prix_par_personne FROM menu WHERE menu_id = ?",
      [menu_id]
    );
    // Vérification que le menu existe dans la base de données //
    if (menuRows.length === 0) {
      return res.status(404).json({ message: "Menu non trouvé" });
    }
    // Récupération des informations du menu //
    const menu = menuRows[0];

    //6. Validation : Vérification le nombre minimum de personnes pour le menu //
    // Vérification que le nombre de personnes est supérieur ou égal au nombre minimum de personnes pour le menu //
    if (nombre_personne < menu.nombre_personne_minimum) {
      return res.status(400).json({
        message: `Le nombre de personnes doit être au minimum de ${menu.nombre_personne_minimum}`,
      });
    }
    // 7. Calcul du prix du menu //
    // Calcul du prix du menu en fonction du nombre de personnes et du prix par personne //
    let prixMenu = menu.prix_par_personne * nombre_personne;

    // 8. Application de la réduction de 10% si nombre_personne >= nombre_personne_minimum + 5 //
    // Application de la réduction de 10% pour les commandes ayant 5 personnes de plus que le minimum //
    if (nombre_personne >= menu.nombre_personne_minimum + 5) {
      prixMenu = prixMenu * 0.9; // Réduction de 10%
    }
    // 9. Calcul du prix de livraison //
    // Calcul du prix de livraison en fonction de la ville et de l'adresse de prestation //
    let prixLivraison = 0;
    // Si la ville n'est pas Bordeaux OU si l'adresse de prestation est différente de l'adresse du compte
    if (
      user.ville !== "Bordeaux" ||
      adresse_prestation !== user.adresse_postals
    ) {
      // Pour l'instant, on met 5€ de base
      // TODO: Calculer la distance réelle avec une API (Google Maps, etc.)
      prixLivraison = 5.0;
      // Si vous avez la distance en km : prixLivraison = 5.00 + (0.59 * distance_km)
    }
    // 11. Génération de numéro de commande unique //
    // Génération de numéro de commande unique //
    const numeroCommande = `CMD-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;

    // 12. Combiner date_prestation et heure_livraison en une seule date et heure //
    const heureLivraisonComplete = `${date_prestation} ${heure_livraison}:00`;

    // 13. Insertion de la commande dans la base de données //
    const [result] = await pool.query(
      `INSERT INTO commande (
        numero_commande, 
        date_commande, 
        date_prestation, 
        heure_livraison, 
        prix_menu, 
        nombre_personne, 
        prix_livraison, 
        adresse_prestation,
        statut, 
        pret_materiel, 
        restitution_materiel, 
        user_id
      ) VALUES (?, CURDATE(), ?, ?, ?, ?, ?, ?, 'en attente', ?, ?, ?)`,
      [
        numeroCommande,
        date_prestation,
        heureLivraisonComplete,
        prixMenu,
        nombre_personne,
        prixLivraison,
        adresse_prestation,
        pret_materiel,
        restitution_materiel,
        userId,
      ]
    );

    // 14. Créer le lien entre la commande et le menu
    await pool.query(
      "INSERT INTO commande_menu (commande_id, menu_id) VALUES (?, ?)",
      [result.insertId, menu_id]
    );

    // 14.5. Enregistrer le statut initial dans l'historique
    await pool.query(
      "INSERT INTO commande_statut_history (commande_id, ancien_statut, nouveau_statut, user_id_modification) VALUES (?, NULL, ?, ?)",
      [result.insertId, "en attente", userId]
    );
    // 14.6 Synchronisation vers MongoDB pour les statistiques
    try {
      const chiffreAffaires = prixMenu + prixLivraison;
      const datePrestation = new Date(date_prestation);

      // Créer les dates de début et fin de journée pour la recherche
      const dateDebut = new Date(datePrestation);
      dateDebut.setHours(0, 0, 0, 0);
      const dateFin = new Date(datePrestation);
      dateFin.setHours(23, 59, 59, 999);

      // Chercher si un document existe déjà pour ce menu et cette date
      const existingStat = await StatistiqueCommande.findOne({
        menu_id: menu_id,
        date: {
          $gte: dateDebut,
          $lte: dateFin,
        },
      });

      if (existingStat) {
        // Mettre à jour le document existant
        existingStat.nombre_commandes += 1;
        existingStat.chiffre_affaires += chiffreAffaires;
        await existingStat.save();
      } else {
        // Créer un nouveau document
        await StatistiqueCommande.create({
          menu_id: menu_id,
          menu_titre: menu.titre,
          nombre_commandes: 1,
          chiffre_affaires: chiffreAffaires,
          date: datePrestation,
        });
      }
    } catch (mongoError) {
      // Ne pas bloquer la création de commande si MongoDB échoue
      // Juste logger l'erreur
      console.error("Erreur lors de la synchronisation MongoDB :", mongoError);
    }
    // 15. Récupérer la commande créée avec les détails
    const [commandeRows] = await pool.query(
      `SELECT 
        c.*,
        m.menu_id,
        m.titre as menu_titre,
        m.prix_par_personne
      FROM commande c
      LEFT JOIN commande_menu cm ON c.commande_id = cm.commande_id
      LEFT JOIN menu m ON cm.menu_id = m.menu_id
      WHERE c.commande_id = ?`,
      [result.insertId]
    );

    // 16. Envoyer l'email de confirmation
    try {
      await sendOrderConfirmationEmail(user, commandeRows[0]);
      console.log("Email de confirmation envoyé avec succès");
    } catch (emailError) {
      // Ne pas faire échouer la commande si l'email échoue
      // On log l'erreur mais on continue
      console.error(
        "Erreur lors de l'envoi de l'email de confirmation :",
        emailError
      );
    }

    // 17. Retourner la réponse
    res.status(201).json({
      message: "Commande créée avec succès",
      commande: commandeRows[0],
    });

    console.log("Commande créée avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la commande",
      error: error.message,
    });
    console.error("Erreur lors de la création de la commande :", error);
  }
});

// Route pour mettre à jour une commande //
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // 1. Vérification que la commande existe et appartient à l'utilisateur authentifié //
    const [commandeRows] = await pool.query(
      "SELECT * FROM commande WHERE commande_id = ? AND user_id = ?",
      [id, userId]
    );

    if (commandeRows.length === 0) {
      return res.status(404).json({
        message:
          "Commande non trouvée ou vous n'avez pas accès à cette commande",
      });
    }

    // 2. Récupération des données de la commande //
    const commande = commandeRows[0];

    // 3. Vérification que la commande peut être modifiée (statut < "accepté") //
    // modification possible tant qu'un employé n'a pas passé la commande en "accepté"
    if (
      commande.statut === "accepté" ||
      commande.statut === "en préparation" ||
      commande.statut === "en livraison" ||
      commande.statut === "terminée" ||
      commande.statut === "annulée"
    ) {
      return res.status(400).json({
        message: `Impossible de modifier une commande avec le statut "${commande.statut}". Seules les commandes en attente peuvent être modifiées.`,
      });
    }

    // 4. Récupération des données à mettre à jour depuis le body //
    const {
      date_prestation,
      heure_livraison,
      nombre_personne,
      statut,
      pret_materiel,
      restitution_materiel,
    } = req.body;

    // 5. Vérifier qu'au moins un champ est fourni pour la mise à jour
    if (
      date_prestation === undefined &&
      heure_livraison === undefined &&
      nombre_personne === undefined &&
      statut === undefined &&
      pret_materiel === undefined &&
      restitution_materiel === undefined
    ) {
      return res.status(400).json({
        message: "Au moins un champ doit être fourni pour la mise à jour",
      });
    }

    // 6. Préparer les valeurs à mettre à jour (utiliser les valeurs existantes si non fournies)
    const newDatePrestation =
      date_prestation !== undefined
        ? date_prestation
        : commande.date_prestation;
    const newHeureLivraison =
      heure_livraison !== undefined
        ? heure_livraison
        : commande.heure_livraison;
    const newNombrePersonne =
      nombre_personne !== undefined
        ? nombre_personne
        : commande.nombre_personne;
    const newStatut = statut !== undefined ? statut : commande.statut;
    const newPretMateriel =
      pret_materiel !== undefined ? pret_materiel : commande.pret_materiel;
    const newRestitutionMateriel =
      restitution_materiel !== undefined
        ? restitution_materiel
        : commande.restitution_materiel;

    // 7. Si nombre_personne change, récupérer le menu et recalculer le prix
    let newPrixMenu = commande.prix_menu;
    if (
      nombre_personne !== undefined &&
      nombre_personne !== commande.nombre_personne
    ) {
      // Récupérer le menu_id depuis la table commande_menu
      const [menuLinkRows] = await pool.query(
        "SELECT menu_id FROM commande_menu WHERE commande_id = ?",
        [id]
      );

      if (menuLinkRows.length > 0) {
        const menuId = menuLinkRows[0].menu_id;

        // Récupérer les informations du menu
        const [menuRows] = await pool.query(
          "SELECT nombre_personne_minimum, prix_par_personne FROM menu WHERE menu_id = ?",
          [menuId]
        );

        if (menuRows.length > 0) {
          const menu = menuRows[0];

          // Validation du nombre minimum
          if (nombre_personne < menu.nombre_personne_minimum) {
            return res.status(400).json({
              message: `Le nombre de personnes doit être au minimum de ${menu.nombre_personne_minimum}`,
            });
          }

          // Recalcul du prix
          newPrixMenu = menu.prix_par_personne * nombre_personne;

          // Application de la réduction de 10% si applicable
          if (nombre_personne >= menu.nombre_personne_minimum + 5) {
            newPrixMenu = newPrixMenu * 0.9;
          }
        }
      }
    }

    // 8. Combiner date_prestation et heure_livraison si nécessaire
    let heureLivraisonComplete = newHeureLivraison;
    if (date_prestation !== undefined || heure_livraison !== undefined) {
      const date =
        date_prestation !== undefined
          ? date_prestation
          : commande.date_prestation;
      let heure = heure_livraison;
      if (!heure) {
        // Extraire l'heure de l'heure_livraison existante
        const heurePart = commande.heure_livraison
          ? commande.heure_livraison.toString().split(" ")[1]
          : null;
        heure = heurePart ? heurePart.substring(0, 5) : "00:00";
      }
      heureLivraisonComplete = `${date} ${heure}:00`;
    }

    // 9. Mise à jour de la commande dans la base de données //
    const [result] = await pool.query(
      `UPDATE commande SET 
        date_prestation = ?,
        heure_livraison = ?,
        prix_menu = ?,
        nombre_personne = ?,
        statut = ?,
        pret_materiel = ?,
        restitution_materiel = ?
      WHERE commande_id = ? AND user_id = ?`,
      [
        newDatePrestation,
        heureLivraisonComplete,
        newPrixMenu,
        newNombrePersonne,
        newStatut,
        newPretMateriel,
        newRestitutionMateriel,
        id,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // 9.5. Enregistrer le changement de statut dans l'historique si le statut a changé
    if (statut !== undefined && statut !== commande.statut) {
      await pool.query(
        "INSERT INTO commande_statut_history (commande_id, ancien_statut, nouveau_statut, user_id_modification) VALUES (?, ?, ?, ?)",
        [id, commande.statut, newStatut, userId]
      );
    }

    // 10. Récupération de la commande mise à jour avec les détails //
    const [updatedCommandeRows] = await pool.query(
      `SELECT 
        c.*,
        m.menu_id,
        m.titre as menu_titre,
        m.prix_par_personne
      FROM commande c
      LEFT JOIN commande_menu cm ON c.commande_id = cm.commande_id
      LEFT JOIN menu m ON cm.menu_id = m.menu_id
      WHERE c.commande_id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Commande mise à jour avec succès",
      commande: updatedCommandeRows[0],
    });

    console.log("Commande mise à jour avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la commande",
      error: error.message,
    });
    console.error("Erreur lors de la mise à jour de la commande :", error);
  }
});

// Route DELETE pour annuler une commande //
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // ID de la commande à annuler
    const userId = req.user.userId; // ID de l'utilisateur authentifié

    // 1. Vérifier que la commande existe et appartient à l'utilisateur
    const [commandeRows] = await pool.query(
      "SELECT * FROM commande WHERE commande_id = ? AND user_id = ?",
      [id, userId]
    );

    if (commandeRows.length === 0) {
      return res.status(404).json({
        message:
          "Commande non trouvée ou vous n'avez pas accès à cette commande",
      });
    }

    const commande = commandeRows[0];

    // 2. Vérifier que la commande peut être annulée (statut < "accepté") //
    // annulation possible tant qu'un employé n'a pas passé la commande en "accepté"
    if (
      commande.statut === "accepté" ||
      commande.statut === "en préparation" ||
      commande.statut === "en livraison" ||
      commande.statut === "terminée" ||
      commande.statut === "annulée"
    ) {
      return res.status(400).json({
        message: `Impossible d'annuler une commande avec le statut "${commande.statut}". Seules les commandes en attente peuvent être annulées.`,
      });
    }

    // 3. Mettre à jour le statut de la commande à "annulée" (on ne supprime pas pour garder l'historique)
    const [result] = await pool.query(
      "UPDATE commande SET statut = 'annulée' WHERE commande_id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // 3.5. Enregistrer l'annulation dans l'historique
    await pool.query(
      "INSERT INTO commande_statut_history (commande_id, ancien_statut, nouveau_statut, user_id_modification) VALUES (?, ?, ?, ?)",
      [id, commande.statut, "annulée", userId]
    );

    // 4. Récupérer la commande annulée pour confirmation
    const [cancelledRows] = await pool.query(
      `SELECT 
        c.*,
        m.menu_id,
        m.titre as menu_titre,
        m.prix_par_personne
      FROM commande c
      LEFT JOIN commande_menu cm ON c.commande_id = cm.commande_id
      LEFT JOIN menu m ON cm.menu_id = m.menu_id
      WHERE c.commande_id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Commande annulée avec succès",
      commande: cancelledRows[0],
    });

    console.log("Commande annulée avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'annulation de la commande",
      error: error.message,
    });
    console.error("Erreur lors de l'annulation de la commande :", error);
  }
});

module.exports = router;
