// Les imports nécessaires pour la route admin
const express = require("express"); 
const authenticateToken = require("../../middleware/auth");
const checkAdminRole = require("../../middleware/checkAdminRole"); 
const {
  getDashboard,
  getStatistiquesCommandesParMenu,
  getStatistiquesChiffreAffaires,
  createEmploye,
  getEmployes,
  desactiverEmploye,
} = require("../../controllers/adminController");

// Création du router Express // 
const router = express.Router(); 

//=================================
// Routes pour l'esapce Adminitrateur 
//=================================

// Route GET pour récupérer les informations du dashboard Admin
router.get("/dashboard", authenticateToken, checkAdminRole, getDashboard);

// ============================================
// Route GET /statistiques/commandes-par-menu
// Récupère les statistiques de commandes par menu depuis MongoDB
// Utilisé pour les graphiques de comparaison
// ============================================
router.get(
  "/statistiques/commandes-par-menu",
  authenticateToken,
  checkAdminRole,
  getStatistiquesCommandesParMenu,
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
  getStatistiquesChiffreAffaires,
);

// ============================================
// Route POST /employes
// Permet à l'admin de créer un compte employé
// ============================================
router.post("/employes", authenticateToken, checkAdminRole, createEmploye);

// ============================================
// Route GET /employes
// Récupère la liste de tous les employés
// ============================================
router.get("/employes", authenticateToken, checkAdminRole, getEmployes);

// ============================================
// Route PUT /employes/:id/desactiver
// Permet de désactiver un compte employé
// ============================================
router.put(
  "/employes/:id/desactiver",
  authenticateToken,
  checkAdminRole,
  desactiverEmploye,
);

module.exports = router;
