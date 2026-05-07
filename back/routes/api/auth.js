// les imports nécessaires pour le module auth //
const express = require("express"); 
const authenticateToken = require("../../middleware/auth");
const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
} = require("../../controllers/authController");

// Création du router Express //
const router = express.Router();

// Création de la route Post/register //
// Cette route permet de créer un nouvel utilisateur dans la base de données //
router.post("/register", register);

// la route Post/login //
// Cette route va nous permettre de connecter un user à son compte en utilisant son email et mot et en cas de mot de passe oublié il
// rénitialisé avec un lien qui lui sera envoyé par mail //

router.post("/login", login);

// Profil connecté (JWT) — utilisé au chargement de l'app pour restaurer role_id
router.get("/me", authenticateToken, getMe);

// La route Post/logout //
// Cette route permet de déconnecter un utilisateur en vérifiant la validité de son token //
router.post("/logout", authenticateToken,logout);

// Création de la route Post/forgot-password //
// Cette route permet de rénitilaiser le mot de passe d'un utilisateur en envoyant un lien qui lui servira à rénitialiser son mot de passe //
router.post("/forgot-password",forgotPassword);

// Création de la route Post/reset-password //
// Cette route permet de réinitialiser le mot de passe avec un token valide //
router.post("/reset-password",resetPassword);

module.exports = router;
