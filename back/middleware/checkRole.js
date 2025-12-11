/**
 * Ce middleware va nous permettre de vérfier si l'utiilisateur est un employe
 */

const pool = require("../config/database");

const checkEmployeeRole = async (req, res, next) => {
  try {
    // Vérifier si l'utilisateur est authentifié
    if (!req.user || !req.user.userId) {
      return res.status(400).json({
        message: "Authentification requise",
      });
    }
    // Récupérer le role user depuis la base de donnée
    const [roleRows] = await pool.query(
      `SELECT r.libele
      FROM user u
      JOIN role r ON u.role_id = r.role_id
      WHERE u.user_id = ?`,
      [req.user.userId]
    );

    // Vérifier que user existe bien dans la base

    if (roleRows.length === 0) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
      });
    }
    const userRole = roleRows[0].libele;

    // Vérifier que l'utilisateur est un employé ou un admin
    if (userRole !== "employe" && userRole !== "admin") {
      return res.status(403).json({
        message:
          "Accès refusé. Seuls les employés et administrateurs peuvent accéder à cette ressource.",
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
    console.error("Erreur dans checkEmployeeRole :", error);
  }
};

module.exports = checkEmployeeRole;
