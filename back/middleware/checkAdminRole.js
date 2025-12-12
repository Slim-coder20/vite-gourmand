/**
 * Ce middleware va nous permettre de vérifier si l'utilisateur est un administrateur
 */

const pool = require("../config/database");

const checkAdminRole = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user || !req.user.userId) {
      return res.status(400).json({
        message: "Authentification requise",
      });
    }
    // Récupérer le role user depuis la base de données
    const [roleRows] = await pool.query(
      `SELECT r.libele
      FROM user u
      JOIN role r ON u.role_id = r.role_id
      WHERE u.user_id = ?`,
      [req.user.userId]
    );
    // Vérifier que l'utilisateur existe dans la base
    if (roleRows.length === 0) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
      });
    }
    const userRole = roleRows[0].libele;
    // Vérifier que l'utilisateur est STRICTEMENT un admin (pas employé)
    if (userRole !== "admin") {
      return res.status(403).json({
        message:
          "Accès refusé. Seuls les administrateurs peuvent accéder à cette ressource.",
      });
    }
    // Ajouter le rôle à req.user pour utilisation ultérieure
    req.user.role = userRole;
    // Passer au middleware suivant
    next();
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la vérification du rôle",
      error: error.message,
    });
    console.error("Erreur dans checkAdminRole :", error);
  }
};

module.exports = checkAdminRole;
