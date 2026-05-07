const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/auth");
const checkEmployeeRole = require("../../middleware/checkRole");
const {
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
} = require("../../controllers/employeeController");


// ============================================
// ROUTES POUR Le Dashboard Employe
// ============================================

// Route GET pour récupérer les informations du dashboard Employe //
router.get(
  "/dashboard",
  authenticateToken,
  checkEmployeeRole,
  getDashboardEmploye,
);

// Route GET pour récuprérer les information de l'employe connecté //
router.get("/profile", authenticateToken, checkEmployeeRole, getProfileEmploye);

// Route PUT pour mettre à jour le profile Employe //
router.put(
  "/profile",
  authenticateToken,
  checkEmployeeRole,
  updateProfileEmploye,
);

// ROUTE GET : Récupérer toutes les commandes avec filtres (employé uniquement)

router.get(
  "/commandes",
  authenticateToken,
  checkEmployeeRole,
  getCommandesEmploye,
);

// ROUTE PUT : Mettre à jour le statut d'une commande (employé uniquement)
// Cette route permet de mettre à jour le statut d'une commande selon le workflow :
// - "accepté" : commande validée par l'équipe
// - "en préparation" : commande en cours de préparation par l'équipe cuisine
// - "en cours de livraison" : commande en cours de livraison par l'équipe logistique
// - "livré" : commande livrée au client
// - "en attente du retour de matériel" : matériel prêté, en attente de retour (envoie email automatique)
// - "terminée" : commande terminée (livrée sans matériel ou matériel restitué)
router.put(
  "/commandes/:id/statut",
  authenticateToken,
  checkEmployeeRole,
  updateCommandeStatut,
);

// ============================================
// ROUTE DELETE : Annuler une commande (employé uniquement)
// ============================================
// Nécessite un motif d'annulation avec mode de contact
router.delete(
  "/commandes/:id",
  authenticateToken,
  checkEmployeeRole,
  cancelCommande,
);

// Route GET pour récupérer les statistiques détaillées //
router.get(
  "/statistiques",
  authenticateToken,
  checkEmployeeRole,
  getStatistiquesCommandesEmploye,
);

// ============================================
// ROUTES POUR LA GESTION DES AVIS (EMPLOYÉ)
// ============================================

// Route GET pour récupérer tous les avis (y compris non validés) - employé uniquement
router.get("/avis", authenticateToken, checkEmployeeRole, getAllAvisEmploye);

// Route PUT pour valider un avis (employé uniquement)
router.put(
  "/avis/:id/valider",
  authenticateToken,
  checkEmployeeRole,
  validateAvis,
);

// Route PUT pour refuser un avis (employé uniquement)
router.put(
  "/avis/:id/refuser",
  authenticateToken,
  checkEmployeeRole,
  refuseAvis,
);

module.exports = router;
