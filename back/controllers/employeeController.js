const pool = require("../config/database");
const {
  sendMaterialReturnEmail,
  sendAvisConfirmationEmail,
} = require("../config/email");

//Controller pour récupérer le dashboar Employe //
const getDashboardEmploye = async (req, res) => {
  try {
    const userId = req.user.userId;
    //1. Récupération des informations de l'employé connecté //
    const [userRows] = await pool.query(
      `SELECT 
        u.user_id,
        u.email,
        u.nom,
        u.prenom,
        u.telephone,
        r.libele as role
      FROM user u
      JOIN role r ON u.role_id = r.role_id
      WHERE u.user_id = ?`,
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const employe = userRows[0];

    // 2. Récupérer les statistiques des commandes par statut
    const [commandesStats] = await pool.query(
      `SELECT 
      statut,
      COUNT(*) as nombre
    FROM commande
    GROUP BY statut
    ORDER BY statut`
    );
    // 3. Récupérer le nombre total de commandes
    const [totalCommandes] = await pool.query(
      "SELECT COUNT(*) as total FROM commande"
    );
    // 4. Récupérer les commandes en attente (prioritaires)
    const [commandesEnAttente] = await pool.query(
      `SELECT 
        c.commande_id,
        c.numero_commande,
        c.date_prestation,
        c.statut,
        u.nom as client_nom,
        u.prenom as client_prenom,
        u.email as client_email
      FROM commande c
      LEFT JOIN user u ON c.user_id = u.user_id
      WHERE c.statut = 'en attente'
      ORDER BY c.date_commande DESC
      LIMIT 10`
    );

    // 5. Récupérer les avis en attente de validation
    const [avisEnAttente] = await pool.query(
      `SELECT 
        a.avis_id,
        a.note,
        a.description,
        a.statut,
        u.nom as user_nom,
        u.prenom as user_prenom
      FROM avis a
      LEFT JOIN user u ON a.user_id = u.user_id
      WHERE a.statut = 'non validée'
      ORDER BY a.avis_id DESC
      LIMIT 10`
    );
    // 6. Récupérer les statistiques des menus
    const [menusStats] = await pool.query(
      `SELECT 
        COUNT(*) as total_menus,
        SUM(quantite_restante) as total_quantite_restante,
        COUNT(CASE WHEN quantite_restante = 0 THEN 1 END) as menus_epuises
      FROM menu`
    );
    // 7. Récupérer les commandes récentes (dernières 24h)
    const [commandesRecent] = await pool.query(
      `SELECT 
        c.commande_id,
        c.numero_commande,
        c.date_commande,
        c.statut,
        u.nom as client_nom,
        u.prenom as client_prenom
      FROM commande c
      LEFT JOIN user u ON c.user_id = u.user_id
      WHERE c.date_commande >= NOW() - INTERVAL '24 HOUR'
      ORDER BY c.date_commande DESC
      LIMIT 10`
    );
    // 8. Construire la réponse avec toutes les informations
    const dashboardData = {
      employe: {
        user_id: employe.user_id,
        email: employe.email,
        nom: employe.nom,
        prenom: employe.prenom,
        telephone: employe.telephone,
        role: employe.role,
      },
      statistiques: {
        commandes: {
          total: totalCommandes[0].total,
          par_statut: commandesStats.reduce((acc, stat) => {
            acc[stat.statut] = stat.nombre;
            return acc;
          }, {}),
        },
        menus: {
          total: menusStats[0].total_menus,
          quantite_restante_totale: menusStats[0].total_quantite_restante,
          menus_epuises: menusStats[0].menus_epuises,
        },
        avis: {
          en_attente: avisEnAttente.length,
        },
      },
      alertes: {
        commandes_en_attente: commandesEnAttente,
        avis_en_attente: avisEnAttente,
        commandes_recentes: commandesRecent,
      },
    };

    res.status(200).json(dashboardData);
    console.log("Dashboard employé récupéré avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du dashboard",
      error: error.message,
    });
    console.error("Erreur lors de la récupération du dashboard :", error);
  }
}

//Controller pour récupérer le profil de l'employé connecté //
const getProfileEmploye = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [userRows] = await pool.query(
      `SELECT 
        u.user_id,
        u.email,
        u.nom,
        u.prenom,
        u.telephone,
        u.ville,
        u.adresse_postals,
        r.libele as role
      FROM user u
      JOIN role r ON u.role_id = r.role_id
      WHERE u.user_id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(userRows[0]);
    console.log("Profil employé récupéré avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du profil",
      error: error.message,
    });
    console.error("Erreur lors de la récupération du profil :", error);
  }
}


// Controller pour mettre à jour le profile Employe //
const updateProfileEmploye = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nom, prenom, telephone, ville, adresse_postals } = req.body;

    // Vérifier qu'au moins un champ est fourni
    if (!nom && !prenom && !telephone && !ville && !adresse_postals) {
      return res.status(400).json({
        message: "Au moins un champ doit être fourni pour la mise à jour",
      });
    }

    // Construire la requête de mise à jour dynamiquement
    const updateFields = [];
    const updateValues = [];

    if (nom !== undefined) {
      updateFields.push("nom = ?");
      updateValues.push(nom);
    }
    if (prenom !== undefined) {
      updateFields.push("prenom = ?");
      updateValues.push(prenom);
    }
    if (telephone !== undefined) {
      updateFields.push("telephone = ?");
      updateValues.push(telephone);
    }
    if (ville !== undefined) {
      updateFields.push("ville = ?");
      updateValues.push(ville);
    }
    if (adresse_postals !== undefined) {
      updateFields.push("adresse_postals = ?");
      updateValues.push(adresse_postals);
    }

    // Ajouter l'ID à la fin pour la clause WHERE
    updateValues.push(userId);

    // Exécuter la mise à jour
    const [result] = await pool.query(
      `UPDATE user SET ${updateFields.join(", ")} WHERE user_id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Récupérer l'utilisateur mis à jour
    const [updatedUserRows] = await pool.query(
      `SELECT 
      u.user_id,
      u.email,
      u.nom,
      u.prenom,
      u.telephone,
      u.ville,
      u.adresse_postals,
      r.libele as role
    FROM user u
    JOIN role r ON u.role_id = r.role_id
    WHERE u.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: updatedUserRows[0],
    });

    console.log("Profil employé mis à jour avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du profil",
      error: error.message,
    });
    console.error("Erreur lors de la mise à jour du profil :", error);
  }
}

//Controller pour récupérer toutes les commandes avec filtres (employé uniquement)
const getCommandesEmploye = async (req, res) => {
  try {
    const { statut, user_id, date_debut, date_fin } = req.query;

    // Construire la requête avec filtres
    let sql = `
      SELECT 
        c.*,
        m.menu_id,
        m.titre as menu_titre,
        m.prix_par_personne,
        u.nom as user_nom,
        u.prenom as user_prenom,
        u.email as user_email,
        u.telephone as user_telephone
      FROM commande c
      LEFT JOIN commande_menu cm ON c.commande_id = cm.commande_id
      LEFT JOIN menu m ON cm.menu_id = m.menu_id
      LEFT JOIN user u ON c.user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    // Filtre par statut
    if (statut) {
      sql += " AND c.statut = ?";
      params.push(statut);
    }

    // Filtre par client (user_id)
    if (user_id) {
      const userIdNum = parseInt(user_id);
      if (!isNaN(userIdNum)) {
        sql += " AND c.user_id = ?";
        params.push(userIdNum);
      }
    }

    // Filtre par date de début
    if (date_debut) {
      sql += " AND c.date_prestation >= ?";
      params.push(date_debut);
    }

    // Filtre par date de fin
    if (date_fin) {
      sql += " AND c.date_prestation <= ?";
      params.push(date_fin);
    }

    sql += " ORDER BY c.date_commande DESC";

    const [rows] = await pool.query(sql, params);

    res.status(200).json(rows);
    console.log("Commandes récupérées avec succès par l'employé");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes",
      error: error.message,
    });
    console.error("Erreur lors de la récupération des commandes :", error);
  }
}

//Controller pour mettre à jour le statut d'une commande / 
const updateCommandeStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    // 1. Vérifier que le statut est valide
    const statutsValides = [
      "en attente",
      "accepté",
      "en préparation",
      "en cours de livraison",
      "livré",
      "en attente du retour de matériel",
      "terminée",
      "annulée",
    ];

    if (!statut || !statutsValides.includes(statut)) {
      return res.status(400).json({
        message: `Statut invalide. Statuts valides : ${statutsValides.join(
          ", "
        )}`,
      });
    }

    // 2. Vérifier que la commande existe
    const [commandeRows] = await pool.query(
      "SELECT * FROM commande WHERE commande_id = ?",
      [id]
    );

    if (commandeRows.length === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    const commande = commandeRows[0];
    const ancienStatut = commande.statut;

    // 3. Vérifier les transitions de statut valides
    // On ne peut pas revenir en arrière sur une commande terminée ou annulée
    if (ancienStatut === "terminée" && statut !== "terminée") {
      return res.status(400).json({
        message: "Impossible de modifier le statut d'une commande terminée",
      });
    }

    if (ancienStatut === "annulée" && statut !== "annulée") {
      return res.status(400).json({
        message: "Impossible de modifier le statut d'une commande annulée",
      });
    }

    // 4. Mettre à jour le statut
    await pool.query("UPDATE commande SET statut = ? WHERE commande_id = ?", [
      statut,
      id,
    ]);

    // 5. Enregistrer dans l'historique
    await pool.query(
      "INSERT INTO commande_statut_history (commande_id, ancien_statut, nouveau_statut, user_id_modification) VALUES (?, ?, ?, ?)",
      [id, ancienStatut, statut, req.user.userId]
    );

    // 6. Envoyer des emails selon le statut
    // 6.1. Si le statut est "en attente du retour de matériel", envoyer un email
    if (statut === "en attente du retour de matériel") {
      try {
        // Récupérer les informations du client
        const [userRows] = await pool.query(
          'SELECT nom, prenom, email FROM "user" WHERE user_id = ?',
          [commande.user_id]
        );

        if (userRows.length > 0) {
          const user = userRows[0];
          await sendMaterialReturnEmail(user, commande);
          console.log("Email de notification de retour de matériel envoyé");
        }
      } catch (emailError) {
        // Ne pas faire échouer la mise à jour si l'email échoue
        console.error(
          "Erreur lors de l'envoi de l'email de notification :",
          emailError
        );
      }
    }

    // 6.2. Si le statut est "livré" ou "terminée", envoyer un email pour demander un avis
    if (statut === "livré" || statut === "terminée") {
      try {
        // Récupérer les informations complètes du client et de la commande
        const [userRows] = await pool.query(
          'SELECT nom, prenom, email FROM "user" WHERE user_id = ?',
          [commande.user_id]
        );

        if (userRows.length > 0) {
          const user = userRows[0];

          // Déterminer l'URL du frontend (production ou développement)
          let frontendUrl = process.env.FRONTEND_URL;
          if (!frontendUrl) {
            // En production Vercel, utiliser l'URL de la requête
            const protocol =
              req.headers["x-forwarded-proto"] || req.protocol || "https";
            const host = req.headers.host || req.headers["x-forwarded-host"];

            // Si c'est une URL de preview Vercel, utiliser l'URL de production
            if (host && host.includes(".vercel.app")) {
              const projectMatch = host.match(/^([^-]+)/);
              if (projectMatch) {
                const projectName = projectMatch[1];
                frontendUrl = `${protocol}://${projectName}.vercel.app`;
              } else {
                frontendUrl = `${protocol}://${host}`;
              }
            } else if (host) {
              frontendUrl = `${protocol}://${host}`;
            } else {
              frontendUrl = "http://localhost:5173";
            }
          }

          // Récupérer les informations complètes de la commande pour l'email
          const [commandeRows] = await pool.query(
            `SELECT 
              c.*,
              m.titre as menu_titre
            FROM commande c
            LEFT JOIN commande_menu cm ON c.commande_id = cm.commande_id
            LEFT JOIN menu m ON cm.menu_id = m.menu_id
            WHERE c.commande_id = ?`,
            [id]
          );

          if (commandeRows.length > 0) {
            const commandeComplete = commandeRows[0];
            await sendAvisConfirmationEmail(
              user,
              commandeComplete,
              frontendUrl
            );
            console.log(
              `✅ Email d'invitation à donner un avis envoyé pour la commande ${commandeComplete.numero_commande}`
            );
          }
        }
      } catch (emailError) {
        // Ne pas faire échouer la mise à jour si l'email échoue
        console.error(
          "❌ Erreur lors de l'envoi de l'email d'invitation à donner un avis :",
          emailError
        );
      }
    }

    // 7. Récupérer la commande mise à jour avec toutes les informations
    const [updatedCommandeRows] = await pool.query(
      `SELECT 
        c.*,
        m.menu_id,
        m.titre as menu_titre,
        m.prix_par_personne,
        u.nom as user_nom,
        u.prenom as user_prenom,
        u.email as user_email,
        u.telephone as user_telephone
      FROM commande c
      LEFT JOIN commande_menu cm ON c.commande_id = cm.commande_id
      LEFT JOIN menu m ON cm.menu_id = m.menu_id
      LEFT JOIN user u ON c.user_id = u.user_id
      WHERE c.commande_id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Statut de la commande mis à jour avec succès",
      commande: updatedCommandeRows[0],
      ancien_statut: ancienStatut,
      nouveau_statut: statut,
    });

    console.log(
      `Statut de la commande ${id} mis à jour : ${ancienStatut} -> ${statut}`
    );
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du statut de la commande",
      error: error.message,
    });
    console.error(
      "Erreur lors de la mise à jour du statut de la commande :",
      error
    );
  }
}

// Controller pour annuler une commande // 
const cancelCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const { motif_annulation, mode_contact } = req.body;

    // 1. Vérifier que les champs requis sont présents
    if (!motif_annulation || !mode_contact) {
      return res.status(400).json({
        message:
          "Les champs motif_annulation et mode_contact sont requis pour annuler une commande",
      });
    }

    // 2. Vérifier que le mode de contact est valide
    const modesValides = ["GSM", "email"];
    if (!modesValides.includes(mode_contact)) {
      return res.status(400).json({
        message: `Mode de contact invalide. Modes valides : ${modesValides.join(
          ", "
        )}`,
      });
    }

    // 3. Vérifier que la commande existe
    const [commandeRows] = await pool.query(
      "SELECT * FROM commande WHERE commande_id = ?",
      [id]
    );

    if (commandeRows.length === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    const commande = commandeRows[0];

    // 4. Vérifier que la commande peut être annulée
    if (commande.statut === "terminée" || commande.statut === "annulée") {
      return res.status(400).json({
        message: `Impossible d'annuler une commande avec le statut "${commande.statut}"`,
      });
    }

    // 5. Mettre à jour le statut de la commande
    await pool.query(
      "UPDATE commande SET statut = 'annulée' WHERE commande_id = ?",
      [id]
    );

    // 6. Enregistrer dans l'historique avec le motif
    await pool.query(
      "INSERT INTO commande_statut_history (commande_id, ancien_statut, nouveau_statut, user_id_modification, motif_annulation, mode_contact) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id,
        commande.statut,
        "annulée",
        req.user.userId,
        motif_annulation,
        mode_contact,
      ]
    );

    // 7. Récupérer la commande annulée
    const [cancelledRows] = await pool.query(
      `SELECT 
        c.*,
        m.menu_id,
        m.titre as menu_titre,
        m.prix_par_personne,
        u.nom as user_nom,
        u.prenom as user_prenom,
        u.email as user_email,
        u.telephone as user_telephone
      FROM commande c
      LEFT JOIN commande_menu cm ON c.commande_id = cm.commande_id
      LEFT JOIN menu m ON cm.menu_id = m.menu_id
      LEFT JOIN user u ON c.user_id = u.user_id
      WHERE c.commande_id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Commande annulée avec succès",
      commande: cancelledRows[0],
      motif_annulation: motif_annulation,
      mode_contact: mode_contact,
    });

    console.log("Commande annulée avec succès par l'employé");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'annulation de la commande",
      error: error.message,
    });
    console.error("Erreur lors de l'annulation de la commande :", error);
  }
}

// Controller pour récupérer les statistiques détaillées des commandes (employé uniquement)//
const getStatistiquesCommandesEmploye = async (req, res) => {
  try {
    const { periode } = req.query; // 'jour', 'semaine', 'mois', 'annee'

    // Définir la date de début selon la période
    let dateDebut = null;
    const maintenant = new Date();

    switch (periode) {
      case "jour":
        dateDebut = new Date(
          maintenant.getFullYear(),
          maintenant.getMonth(),
          maintenant.getDate()
        );
        break;
      case "semaine":
        const jourSemaine = maintenant.getDay();
        dateDebut = new Date(maintenant);
        dateDebut.setDate(maintenant.getDate() - jourSemaine);
        break;
      case "mois":
        dateDebut = new Date(
          maintenant.getFullYear(),
          maintenant.getMonth(),
          1
        );
        break;
      case "annee":
        dateDebut = new Date(maintenant.getFullYear(), 0, 1);
        break;
      default:
        dateDebut = null; // Toutes les périodes
    }

    // Construire la condition de date
    let dateCondition = "";
    const params = [];
    if (dateDebut) {
      dateCondition = "AND c.date_commande >= ?";
      params.push(dateDebut);
    }

    // Statistiques des commandes
    const [commandesStats] = await pool.query(
      `SELECT 
      COUNT(*) as total,
      SUM(prix_menu + prix_livraison) as chiffre_affaires,
      AVG(prix_menu + prix_livraison) as panier_moyen,
      COUNT(CASE WHEN statut = 'terminée' THEN 1 END) as commandes_terminees,
      COUNT(CASE WHEN statut = 'annulée' THEN 1 END) as commandes_annulees
    FROM commande c
    WHERE 1=1 ${dateCondition}`,
      params
    );

    // Statistiques des menus les plus commandés
    const [menusPopulaires] = await pool.query(
      `SELECT 
      m.menu_id,
      m.titre,
      COUNT(cm.commande_id) as nombre_commandes,
      SUM(c.prix_menu) as revenus
    FROM menu m
    LEFT JOIN commande_menu cm ON m.menu_id = cm.menu_id
    LEFT JOIN commande c ON cm.commande_id = c.commande_id
    WHERE 1=1 ${dateCondition.replace("c.date_commande", "c.date_commande")}
    GROUP BY m.menu_id, m.titre
    ORDER BY nombre_commandes DESC
    LIMIT 10`,
      params
    );

    // Statistiques des avis
    const [avisStats] = await pool.query(
      `SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN statut = 'validée' THEN 1 END) as valides,
      COUNT(CASE WHEN statut = 'non validée' THEN 1 END) as en_attente,
      AVG(CAST(note AS INTEGER)) as note_moyenne
    FROM avis`
    );

    const statistiques = {
      periode: periode || "toutes",
      commandes: {
        total: commandesStats[0].total,
        chiffre_affaires: commandesStats[0].chiffre_affaires || 0,
        panier_moyen: commandesStats[0].panier_moyen || 0,
        terminees: commandesStats[0].commandes_terminees,
        annulees: commandesStats[0].commandes_annulees,
      },
      menus_populaires: menusPopulaires,
      avis: {
        total: avisStats[0].total,
        valides: avisStats[0].valides,
        en_attente: avisStats[0].en_attente,
        note_moyenne: avisStats[0].note_moyenne || 0,
      },
    };

    res.status(200).json(statistiques);
    console.log("Statistiques récupérées avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques",
      error: error.message,
    });
    console.error("Erreur lors de la récupération des statistiques :", error);
  }
}

// Liste de tous les avis (tous statuts) pour l'espace employé / modération
const getAllAvisEmploye = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        a.avis_id,
        a.note,
        a.description,
        a.statut,
        a.user_id,
        u.nom as user_nom,
        u.prenom as user_prenom,
        u.email as user_email
      FROM avis a
      LEFT JOIN user u ON a.user_id = u.user_id
      ORDER BY a.avis_id DESC`
    );
    res.status(200).json(rows);
    console.log("Liste des avis (employé) récupérée avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des avis",
      error: error.message,
    });
    console.error("Erreur lors de la récupération des avis (employé) :", error);
  }
}

// ============================================
// Controller POUR LA GESTION DES AVIS (EMPLOYÉ)
// ============================================

// Controller pour valider un avis (employe uniquement)
const validateAvis = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Vérifier que l'avis existe
    const [avisRows] = await pool.query(
      "SELECT * FROM avis WHERE avis_id = ?",
      [id]
    );

    if (avisRows.length === 0) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }

    const avis = avisRows[0];

    // 2. Vérifier que l'avis n'est pas déjà validé
    if (avis.statut === "validée") {
      return res.status(400).json({
        message: "Cet avis est déjà validé",
      });
    }

    // 3. Mettre à jour le statut
    await pool.query("UPDATE avis SET statut = 'validée' WHERE avis_id = ?", [
      id,
    ]);

    // 4. Récupérer l'avis mis à jour
    const [updatedAvisRows] = await pool.query(
      `SELECT 
        a.avis_id,
        a.note,
        a.description,
        a.image,
        a.statut,
        a.user_id,
        u.nom as user_nom,
        u.prenom as user_prenom
      FROM avis a
      LEFT JOIN user u ON a.user_id = u.user_id
      WHERE a.avis_id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Avis validé avec succès",
      avis: updatedAvisRows[0],
    });

    console.log("Avis validé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la validation de l'avis",
      error: error.message,
    });
    console.error("Erreur lors de la validation de l'avis :", error);
  }
}

// Controller pour refuser un avis (employe uniquement )
const refuseAvis = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Vérifier que l'avis existe
    const [avisRows] = await pool.query(
      "SELECT * FROM avis WHERE avis_id = ?",
      [id]
    );

    if (avisRows.length === 0) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }

    const avis = avisRows[0];

    // 2. Vérifier que l'avis n'est pas déjà refusé
    if (avis.statut === "non validée") {
      return res.status(400).json({
        message: "Cet avis est déjà refusé",
      });
    }

    // 3. Mettre à jour le statut
    await pool.query(
      "UPDATE avis SET statut = 'non validée' WHERE avis_id = ?",
      [id]
    );

    // 4. Récupérer l'avis mis à jour
    const [updatedAvisRows] = await pool.query(
      `SELECT 
        a.avis_id,
        a.note,
        a.description,
        a.image,
        a.statut,
        a.user_id,
        u.nom as user_nom,
        u.prenom as user_prenom
      FROM avis a
      LEFT JOIN user u ON a.user_id = u.user_id
      WHERE a.avis_id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Avis refusé avec succès",
      avis: updatedAvisRows[0],
    });

    console.log("Avis refusé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du refus de l'avis",
      error: error.message,
    });
    console.error("Erreur lors du refus de l'avis :", error);
  }
}





module.exports = {
  getDashboardEmploye,
  getProfileEmploye,
  updateProfileEmploye,
  getCommandesEmploye,
  updateCommandeStatut,
  cancelCommande,
  getStatistiquesCommandesEmploye,
  getAllAvisEmploye,
  validateAvis,
  refuseAvis,
}