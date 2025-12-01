// les imports nécessaires pour le module auth //
const express = require("express");
const pool = require("../../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticateToken = require("../../middleware/auth");
// Création du router Express //
const router = express.Router();

// Création de la route Post/register //
// Cette route permet de créer un nouvel utilisateur dans la base de données //
router.post("/register", async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      password,
      adresse_postals,
      telephone,
      ville,
      pays,
    } = req.body;
    // Vérification que tous les champs requis sont présents //
    if (
      !nom ||
      !prenom ||
      !email ||
      !password ||
      !adresse_postals ||
      !telephone
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Validation du format de l'email //
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "L'email n'est pas valide (doit contenir un @ et un .)",
      });
    }

    // Vérification si l'email existe déjà dans la base de données //
    const [existingUser] = await pool.query(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: "L'email existe déjà dans la base de données" });
    }

    // Vérification du format du mot de passe (10 caractères minimum, majuscule, minuscule, chiffre, caractère spécial) //
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

    // hashage du mot de passs //
    const hashedPassword = await bcrypt.hash(password, 10);

    // Récupérer le role_id du rôle "utilisateur" //
    const [roleRows] = await pool.query(
      "SELECT role_id FROM role WHERE libele = 'utilisateur'"
    );
    if (roleRows.length === 0) {
      return res.status(500).json({
        message: "Le rôle 'utilisateur' n'existe pas dans la base de données",
      });
    }
    const roleId = roleRows[0].role_id;
    // insertion de l'utilisateur dans la base de données //
    const [result] = await pool.query(
      "INSERT INTO user (nom, prenom, email, password, adresse_postals, telephone, ville, pays, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nom,
        prenom,
        email,
        hashedPassword,
        adresse_postals,
        telephone,
        ville,
        pays,
        roleId,
      ]
    );
    // récupération de l'utilisateur créé //
    const [rows] = await pool.query("SELECT * FROM user WHERE user_id = ?", [
      result.insertId,
    ]);
    if (rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Erreur lors de la création de l'utilisateur" });
    }
    // création du token JWT //
    const jwtSecret = process.env.JWT_SECRET || "secret_par_defaut_dev_only";
    if (!process.env.JWT_SECRET) {
      console.warn(
        "⚠️  JWT_SECRET non défini, utilisation d'une clé par défaut (développement uniquement)"
      );
    }
    const token = jwt.sign(
      { userId: rows[0].user_id, role: roleId },
      jwtSecret,
      { expiresIn: "24h" }
    );

    // retour de la réponse (sans le mot de passe) //
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token: token,
      user: {
        user_id: rows[0].user_id,
        nom: rows[0].nom,
        prenom: rows[0].prenom,
        email: rows[0].email,
        telephone: rows[0].telephone,
        adresse_postals: rows[0].adresse_postals,
        ville: rows[0].ville,
        pays: rows[0].pays,
        role_id: rows[0].role_id,
      },
    });
    console.log("Utilisateur créé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message,
    });
    console.error("Erreur lors de la création de l'utilisateur :", error);
  }
});

// la route Post/login //
// Cette route va nous permettre de connecter un user à son compte en utilisant son email et mot et en cas de mot de passe oublié il
// rénitialisé avec un lien qui lui sera envoyé par mail //

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification que tous les champs sont présents //
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont requis (email, password)" });
    }

    // Chercher l'utilisateur par son email //
    const [userRows] = await pool.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);

    // Vérifier si l'utilisateur existe //
    if (userRows.length === 0) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérification du mot de passe //
    const isPasswordValid = await bcrypt.compare(
      password,
      userRows[0].password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Création du token JWT //
    const jwtSecret = process.env.JWT_SECRET || "secret_par_defaut_dev_only";
    const token = jwt.sign(
      { userId: userRows[0].user_id, role: userRows[0].role_id },
      jwtSecret,
      { expiresIn: "24h" }
    );

    // Retour de la réponse (sans le mot de passe) //
    res.status(200).json({
      message: "Connexion réussie",
      token: token,
      user: {
        user_id: userRows[0].user_id,
        nom: userRows[0].nom,
        prenom: userRows[0].prenom,
        email: userRows[0].email,
        telephone: userRows[0].telephone,
        adresse_postals: userRows[0].adresse_postals,
        ville: userRows[0].ville,
        pays: userRows[0].pays,
        role_id: userRows[0].role_id,
      },
    });
    console.log("Connexion réussie");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la connexion de l'utilisateur",
      error: error.message,
    });
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
  }
});

// La route Post/logout //
// Cette route permet de déconnecter un utilisateur en vérifiant la validité de son token //
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // Le token est vérifié par le middleware authenticateToken
    // req.user contient les infos de l'utilisateur authentifié
    // On ne fait rien ici, le token est supprimé du frontend par le middleware authenticateToken
    // Retour de la réponse (sans message)
    res.status(200).json({});
    console.log(`Déconnexion réussie pour l'utilisateur : ${req.user.userId} (${req.user.email})`);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la déconnexion de l'utilisateur",
      error: error.message,
    });
    console.error("Erreur lors de la déconnexion de l'utilisateur :", error);
  }
});

module.exports = router;
