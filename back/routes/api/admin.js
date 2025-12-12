// Les imports nécessaires pour la route admin
const express = require("express");
const pool = require("../../config/database");
const authenticateToken = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const { sendEmployeeAccountCreatedEmail } = require("../../config/email");
const checkAdminRole = require("../../middleware/checkAdminRole");
const StatistiqueCommande = require("../../models/StatistiqueCommande");

// Création du router Express //
const router = express.Router();

//=================================
// Routes pour l'esapce Adminitrateur
//=================================

// Route GET pour récupérer les informations du dashboard Admin
router.get(
  "/dashboard",
  authenticateToken,
  checkAdminRole,
  async (req, res) => {
    try {
      const userId = req.user.userId;

      // 1. Récupération des informations de l'admin connecté
      const [adminRows] = await pool.query(
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

      if (adminRows.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      const admin = adminRows[0];

      // 2. Récupérer le nombre total d'employés (role_id = 3)
      const [employesCount] = await pool.query(
        "SELECT COUNT(*) as total FROM user WHERE role_id = 3"
      );

      // 3. Récupérer le nombre d'employés actifs
      const totalEmployes = employesCount[0].total;

      // 4. Récupérer les statistiques des commandes par statut
      const [commandesStats] = await pool.query(
        `SELECT 
        statut,
        COUNT(*) as nombre
      FROM commande
      GROUP BY statut
      ORDER BY statut`
      );

      // 5. Récupérer le nombre total de commandes
      const [totalCommandes] = await pool.query(
        "SELECT COUNT(*) as total FROM commande"
      );

      // 6. Récupérer le chiffre d'affaires total depuis MySQL
      const [caTotal] = await pool.query(
        `SELECT 
        SUM(prix_menu + prix_livraison) as chiffre_affaires_total
      FROM commande`
      );

      // 7. Récupérer les statistiques de commandes par menu depuis MongoDB
      // Agrégation pour grouper par menu et calculer les totaux
      const statsParMenu = await StatistiqueCommande.aggregate([
        {
          $group: {
            _id: "$menu_id",
            menu_titre: { $first: "$menu_titre" },
            total_commandes: { $sum: "$nombre_commandes" },
            total_chiffre_affaires: { $sum: "$chiffre_affaires" },
          },
        },
        {
          $sort: { total_commandes: -1 },
        },
      ]);

      // 8. Récupérer les commandes récentes (dernières 24h)
      const [commandesRecent] = await pool.query(
        `SELECT 
        c.commande_id,
        c.numero_commande,
        c.date_commande,
        c.statut,
        c.prix_menu,
        c.prix_livraison,
        u.nom as client_nom,
        u.prenom as client_prenom,
        m.titre as menu_titre
      FROM commande c
      LEFT JOIN user u ON c.user_id = u.user_id
      LEFT JOIN commande_menu cm ON c.commande_id = cm.commande_id
      LEFT JOIN menu m ON cm.menu_id = m.menu_id
      WHERE c.date_commande >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      ORDER BY c.date_commande DESC
      LIMIT 10`
      );

      // 9. Récupérer les avis en attente de validation
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

      // 10. Construire la réponse avec toutes les informations
      const dashboardData = {
        admin: {
          user_id: admin.user_id,
          email: admin.email,
          nom: admin.nom,
          prenom: admin.prenom,
          telephone: admin.telephone,
          role: admin.role,
        },
        statistiques: {
          total_employes: totalEmployes,
          total_commandes: totalCommandes[0].total,
          chiffre_affaires_total: caTotal[0].chiffre_affaires_total || 0,
          commandes_par_statut: commandesStats,
          commandes_par_menu: statsParMenu, // Depuis MongoDB
        },
        commandes_recentes: commandesRecent,
        avis_en_attente: avisEnAttente,
      };

      // 11. Retourner la réponse
      res.status(200).json({
        message: "Dashboard admin récupéré avec succès",
        data: dashboardData,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération du dashboard admin",
        error: error.message,
      });
      console.error("Erreur dans la route dashboard admin :", error);
    }
  }
);

// ============================================
// Route GET /statistiques/commandes-par-menu
// Récupère les statistiques de commandes par menu depuis MongoDB
// Utilisé pour les graphiques de comparaison
// ============================================
router.get(
  "/statistiques/commandes-par-menu",
  authenticateToken,
  checkAdminRole,
  async (req, res) => {
    try {
      // 1. Récupérer les statistiques depuis MongoDB
      // Agrégation pour grouper par menu et calculer les totaux
      const statsParMenu = await StatistiqueCommande.aggregate([
        {
          $group: {
            _id: "$menu_id",
            menu_titre: { $first: "$menu_titre" },
            total_commandes: { $sum: "$nombre_commandes" },
            total_chiffre_affaires: { $sum: "$chiffre_affaires" },
          },
        },
        {
          $sort: { total_commandes: -1 }, // Trier par nombre de commandes décroissant
        },
        {
          $project: {
            _id: 0, // Exclure le _id par défaut
            menu_id: "$_id",
            menu_titre: 1,
            total_commandes: 1,
            total_chiffre_affaires: 1,
          },
        },
      ]);

      // 2. Retourner les données formatées pour les graphiques
      res.status(200).json({
        message: "Statistiques de commandes par menu récupérées avec succès",
        data: statsParMenu,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des statistiques",
        error: error.message,
      });
      console.error(
        "Erreur dans la route statistiques commandes-par-menu :",
        error
      );
    }
  }
);

// ============================================
// Route GET /statistiques/chiffre-affaires
// Récupère le chiffre d'affaires avec filtres optionnels
// Filtres possibles : menu_id, date_debut, date_fin
// ============================================
router.get(
  "/statistiques/chiffre-affaires",
  authenticateToken,
  checkAdminRole,
  async (req, res) => {
    try {
      // 1. Récupérer les paramètres de filtre depuis la query string
      const { menu_id, date_debut, date_fin } = req.query;

      // 2. Construire le pipeline d'agrégation MongoDB
      const pipeline = [];

      // 3. Étape de filtrage par date si fourni
      if (date_debut || date_fin) {
        const dateFilter = {};
        if (date_debut) {
          dateFilter.$gte = new Date(date_debut);
        }
        if (date_fin) {
          // Ajouter 23h59m59s pour inclure toute la journée
          const dateFinComplete = new Date(date_fin);
          dateFinComplete.setHours(23, 59, 59, 999);
          dateFilter.$lte = dateFinComplete;
        }
        pipeline.push({
          $match: {
            date: dateFilter,
          },
        });
      }

      // 4. Étape de filtrage par menu_id si fourni
      if (menu_id) {
        const menuIdFilter = { menu_id: parseInt(menu_id) };
        if (pipeline.length > 0 && pipeline[0].$match) {
          // Si un $match existe déjà, fusionner les conditions
          pipeline[0].$match = { ...pipeline[0].$match, ...menuIdFilter };
        } else {
          // Sinon, créer un nouveau $match
          pipeline.push({
            $match: menuIdFilter,
          });
        }
      }

      // 5. Étape de groupement par menu
      pipeline.push({
        $group: {
          _id: "$menu_id",
          menu_titre: { $first: "$menu_titre" },
          total_chiffre_affaires: { $sum: "$chiffre_affaires" },
          nombre_commandes: { $sum: "$nombre_commandes" },
        },
      });

      // 6. Étape de tri par chiffre d'affaires décroissant
      pipeline.push({
        $sort: { total_chiffre_affaires: -1 },
      });

      // 7. Étape de projection pour formater les résultats
      pipeline.push({
        $project: {
          _id: 0,
          menu_id: "$_id",
          menu_titre: 1,
          total_chiffre_affaires: 1,
          nombre_commandes: 1,
        },
      });

      // 8. Exécuter l'agrégation
      const resultats = await StatistiqueCommande.aggregate(pipeline);

      // 9. Calculer le total général si plusieurs menus
      const totalGeneral = resultats.reduce(
        (sum, item) => sum + item.total_chiffre_affaires,
        0
      );

      // 10. Retourner les résultats avec le total général
      res.status(200).json({
        message: "Chiffre d'affaires récupéré avec succès",
        data: {
          resultats: resultats,
          total_general: totalGeneral,
          filtres_appliques: {
            menu_id: menu_id || null,
            date_debut: date_debut || null,
            date_fin: date_fin || null,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération du chiffre d'affaires",
        error: error.message,
      });
      console.error(
        "Erreur dans la route statistiques chiffre-affaires :",
        error
      );
    }
  }
);

// ============================================
// Route POST /employes
// Permet à l'admin de créer un compte employé
// ============================================
router.post(
  "/employes",
  authenticateToken,
  checkAdminRole,
  async (req, res) => {
    try {
      // 1. Récupération des données depuis le body
      const { email, password } = req.body;

      // 2. Vérification que tous les champs requis sont présents
      if (!email || !password) {
        return res.status(400).json({
          message: "Les champs email et password sont requis",
        });
      }

      // 3. Validation du format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "L'email n'est pas valide (doit contenir un @ et un .)",
        });
      }

      // 4. Vérification si l'email existe déjà dans la base de données
      const [existingUser] = await pool.query(
        "SELECT * FROM user WHERE email = ?",
        [email]
      );
      if (existingUser.length > 0) {
        return res.status(409).json({
          message: "L'email existe déjà dans la base de données",
        });
      }

      // 5. Validation du format du mot de passe
      if (password.length < 10) {
        return res.status(400).json({
          message: "Le mot de passe doit contenir au moins 10 caractères",
        });
      }

      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);

      if (!hasSpecialChar || !hasUpperCase || !hasLowerCase || !hasNumber) {
        return res.status(400).json({
          message:
            "Le mot de passe doit contenir au moins un caractère spécial, une majuscule, une minuscule et un chiffre",
        });
      }

      // 6. Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // 7. Récupérer le role_id du rôle "employe" (role_id = 3)
      const [roleRows] = await pool.query(
        "SELECT role_id FROM role WHERE libele = 'employe'"
      );
      if (roleRows.length === 0) {
        return res.status(500).json({
          message: "Le rôle 'employe' n'existe pas dans la base de données",
        });
      }
      const roleId = roleRows[0].role_id; // Doit être 3

      // 8. Vérification importante : s'assurer qu'on ne crée pas un admin
      if (roleId !== 3) {
        return res.status(403).json({
          message: "Impossible de créer un compte avec ce rôle",
        });
      }

      // 9. Insertion de l'employé dans la base de données
      // On force role_id = 3 et on ne demande que email et password
      const [result] = await pool.query(
        "INSERT INTO user (email, password, role_id) VALUES (?, ?, ?)",
        [email, hashedPassword, roleId]
      );

      // 10. Récupérer l'employé créé
      const [employeRows] = await pool.query(
        "SELECT user_id, email, role_id FROM user WHERE user_id = ?",
        [result.insertId]
      );

      if (employeRows.length === 0) {
        return res.status(500).json({
          message: "Erreur lors de la création de l'employé",
        });
      }

      const employe = employeRows[0];

      // 11. Envoyer l'email de notification (sans le mot de passe)
      try {
        await sendEmployeeAccountCreatedEmail(email);
      } catch (emailError) {
        // Ne pas bloquer la création si l'email échoue
        console.error("Erreur lors de l'envoi de l'email :", emailError);
      }

      // 12. Retourner la réponse (sans le mot de passe)
      res.status(201).json({
        message: "Compte employé créé avec succès",
        data: {
          user_id: employe.user_id,
          email: employe.email,
          role_id: employe.role_id,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la création du compte employé",
        error: error.message,
      });
      console.error("Erreur dans la route POST /employes :", error);
    }
  }
);

// ============================================
// Route GET /employes
// Récupère la liste de tous les employés
// ============================================
router.get("/employes", authenticateToken, checkAdminRole, async (req, res) => {
  try {
    // Récupérer tous les employés (role_id = 3)
    const [employes] = await pool.query(
      `SELECT 
          u.user_id,
          u.email,
          u.nom,
          u.prenom,
          u.telephone,
          u.actif,
          r.libele as role
        FROM user u
        JOIN role r ON u.role_id = r.role_id
        WHERE u.role_id = 3
        ORDER BY u.user_id DESC`
    );

    res.status(200).json({
      message: "Liste des employés récupérée avec succès",
      data: employes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des employés",
      error: error.message,
    });
    console.error("Erreur dans la route GET /employes :", error);
  }
});

// ============================================
// Route PUT /employes/:id/desactiver
// Permet de désactiver un compte employé
// ============================================
router.put(
  "/employes/:id/desactiver",
  authenticateToken,
  checkAdminRole,
  async (req, res) => {
    try {
      const employeId = parseInt(req.params.id);

      // 1. Vérifier que l'ID est valide
      if (isNaN(employeId)) {
        return res.status(400).json({
          message: "ID employé invalide",
        });
      }

      // 2. Vérifier que l'employé existe et est bien un employé (pas admin)
      const [employeRows] = await pool.query(
        `SELECT 
          u.user_id,
          u.email,
          u.role_id,
          r.libele as role
        FROM user u
        JOIN role r ON u.role_id = r.role_id
        WHERE u.user_id = ?`,
        [employeId]
      );

      if (employeRows.length === 0) {
        return res.status(404).json({
          message: "Employé non trouvé",
        });
      }

      const employe = employeRows[0];

      // 3. Vérifier que c'est bien un employé (role_id = 3) et pas un admin
      if (employe.role_id !== 3) {
        return res.status(403).json({
          message:
            "Impossible de désactiver ce compte. Seuls les comptes employés peuvent être désactivés.",
        });
      }

      // 4. Vérifier si l'employé essaie de se désactiver lui-même (si c'est l'admin connecté)
      // Note: L'admin ne peut pas se désactiver car il a role_id = 2, donc cette vérification est optionnelle

      // 5. Vérifier si la colonne 'actif' existe, sinon on utilisera une autre méthode
      // Pour l'instant, on va créer un champ actif si nécessaire
      // Option 1: Si le champ existe, le mettre à false
      // Option 2: Si le champ n'existe pas, on peut mettre role_id à NULL ou créer une migration

      // Vérifier si le champ actif existe dans la table
      const [columns] = await pool.query("SHOW COLUMNS FROM user LIKE 'actif'");

      if (columns.length > 0) {
        // Le champ existe, on le met à false
        await pool.query("UPDATE user SET actif = false WHERE user_id = ?", [
          employeId,
        ]);
      } else {
        // Le champ n'existe pas, on peut soit:
        // - Créer une migration pour l'ajouter
        // - Utiliser une autre méthode (ex: mettre role_id à NULL temporairement)
        // Pour l'instant, on va créer le champ à la volée (non recommandé en production)
        try {
          await pool.query(
            "ALTER TABLE user ADD COLUMN actif BOOLEAN DEFAULT true"
          );
          await pool.query("UPDATE user SET actif = false WHERE user_id = ?", [
            employeId,
          ]);
        } catch (alterError) {
          // Si l'ajout échoue (peut-être que le champ existe déjà), on continue
          console.error("Erreur lors de l'ajout du champ actif :", alterError);
          return res.status(500).json({
            message:
              "Erreur lors de la désactivation. Veuillez créer une migration pour ajouter le champ 'actif' à la table user.",
          });
        }
      }

      // 6. Récupérer l'employé mis à jour
      const [updatedEmploye] = await pool.query(
        `SELECT 
          u.user_id,
          u.email,
          u.nom,
          u.prenom,
          u.actif,
          r.libele as role
        FROM user u
        JOIN role r ON u.role_id = r.role_id
        WHERE u.user_id = ?`,
        [employeId]
      );

      // 7. Retourner la réponse
      res.status(200).json({
        message: "Compte employé désactivé avec succès",
        data: updatedEmploye[0],
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la désactivation du compte employé",
        error: error.message,
      });
      console.error(
        "Erreur dans la route PUT /employes/:id/desactiver :",
        error
      );
    }
  }
);

module.exports = router;
