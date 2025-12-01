const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const authenticateToken = async (req, res, next) => {
  try {
    // 1. Récupérer le header Authorization
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
      return res.status(401).json({ message: "Token d'authentification manquant" });
    }
    
    // 2. Extraire le token
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Format du token invalide" });
    }
    
    // 3. Vérifier le token
    const jwtSecret = process.env.JWT_SECRET || "secret_par_defaut_dev_only";
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (jwtError) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
    
    // 4. Vérifier que l'utilisateur existe toujours
    const [userRows] = await pool.query("SELECT * FROM user WHERE user_id = ?", [
      decoded.userId,
    ]);
    
    if (userRows.length === 0) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }
    
    // 5. Ajouter les infos utilisateur à req
    req.user = {
      userId: userRows[0].user_id,
      roleId: userRows[0].role_id,
      email: userRows[0].email,
    };
    
    // 6. Passer au suivant
    next();
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'authentification",
      error: error.message,
    });
    console.error("Erreur dans le middleware d'authentification :", error);
  }
};

module.exports = authenticateToken;