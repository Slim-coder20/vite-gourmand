import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import styles from "../styles/auth/Register.module.css";

function RegisterPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adresse_postals, setAdresse_postals] = useState("");
  const [telephone, setTelephone] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si déjà connecté, rediriger vers la page d'accueil
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // fonction de validation du formulaire
    const validateForm = () => {
      const errors = {};

      // Validation des champs requis
      if (!nom.trim()) errors.nom = "Le nom est requis";
      if (!prenom.trim()) errors.prenom = "Le prénom est requis";
      if (!email.trim()) errors.email = "L'email est requis";
      if (!password) errors.password = "Le mot de passe est requis";
      if (!adresse_postals.trim())
        errors.adresse_postals = "L'adresse est requise";
      if (!telephone.trim()) errors.telephone = "Le téléphone est requis";

      // Validation du format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        errors.email = "L'email n'est pas valide";
      }

      // Validation du mot de passe
      if (password) {
        if (password.length < 10) {
          errors.password =
            "Le mot de passe doit contenir au moins 10 caractères";
        } else {
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          const hasUpperCase = /[A-Z]/.test(password);
          const hasLowerCase = /[a-z]/.test(password);
          const hasNumber = /[0-9]/.test(password);

          if (!hasSpecialChar || !hasUpperCase || !hasLowerCase || !hasNumber) {
            errors.password =
              "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial";
          }
        }
      }

      // Validation de la confirmation du mot de passe
      if (password !== confirmPassword) {
        errors.confirmPassword = "Les mots de passe ne correspondent pas";
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };

    // Valider le formulaire avant l'envoi
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Préparer les données pour l'API
      const userData = {
        nom,
        prenom,
        email,
        password,
        adresse_postals,
        telephone,
        ville: ville || null,
        pays: pays || null,
      };

      // Appeler la fonction register du contexte
      await register(userData);

      // Si succès, rediriger vers la page d'accueil
      navigate("/");

      // Réinitialiser le formulaire
      setNom("");
      setPrenom("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAdresse_postals("");
      setTelephone("");
      setVille("");
      setPays("");
    } catch (error) {
      // Gérer les erreurs du backend
      if (error.message.includes("existe déjà")) {
        setError("Cet email est déjà utilisé. Veuillez vous connecter.");
      } else {
        setError(error.message || "Erreur lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className={styles.registerContainer}>
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          {/* Nom */}
          <div className={styles.formGroup}>
            <label htmlFor="nom">Nom *</label>
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              disabled={isLoading}
              className={
                validationErrors.nom ? styles.inputError : styles.input
              }
            />
            {validationErrors.nom && (
              <span className={styles.errorText}>{validationErrors.nom}</span>
            )}
          </div>

          {/* Prénom */}
          <div className={styles.formGroup}>
            <label htmlFor="prenom">Prénom *</label>
            <input
              type="text"
              id="prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              disabled={isLoading}
              className={
                validationErrors.prenom ? styles.inputError : styles.input
              }
            />
            {validationErrors.prenom && (
              <span className={styles.errorText}>
                {validationErrors.prenom}
              </span>
            )}
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={
                validationErrors.email ? styles.inputError : styles.input
              }
            />
            {validationErrors.email && (
              <span className={styles.errorText}>{validationErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Mot de passe *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={
                validationErrors.password ? styles.inputError : styles.input
              }
            />
            {validationErrors.password && (
              <span className={styles.errorText}>
                {validationErrors.password}
              </span>
            )}
            <small className={styles.helpText}>
              Le mot de passe doit contenir au moins 10 caractères, une
              majuscule, une minuscule, un chiffre et un caractère spécial
            </small>
          </div>

          {/* Confirm Password */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className={
                validationErrors.confirmPassword
                  ? styles.inputError
                  : styles.input
              }
            />
            {validationErrors.confirmPassword && (
              <span className={styles.errorText}>
                {validationErrors.confirmPassword}
              </span>
            )}
          </div>

          {/* Adresse */}
          <div className={styles.formGroup}>
            <label htmlFor="adresse_postals">Adresse postale *</label>
            <input
              type="text"
              id="adresse_postals"
              value={adresse_postals}
              onChange={(e) => setAdresse_postals(e.target.value)}
              required
              disabled={isLoading}
              className={
                validationErrors.adresse_postals
                  ? styles.inputError
                  : styles.input
              }
            />
            {validationErrors.adresse_postals && (
              <span className={styles.errorText}>
                {validationErrors.adresse_postals}
              </span>
            )}
          </div>

          {/* Téléphone */}
          <div className={styles.formGroup}>
            <label htmlFor="telephone">Téléphone *</label>
            <input
              type="tel"
              id="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
              disabled={isLoading}
              className={
                validationErrors.telephone ? styles.inputError : styles.input
              }
            />
            {validationErrors.telephone && (
              <span className={styles.errorText}>
                {validationErrors.telephone}
              </span>
            )}
          </div>

          {/* Ville (optionnel) */}
          <div className={styles.formGroup}>
            <label htmlFor="ville">Ville</label>
            <input
              type="text"
              id="ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          {/* Pays (optionnel) */}
          <div className={styles.formGroup}>
            <label htmlFor="pays">Pays</label>
            <input
              type="text"
              id="pays"
              value={pays}
              onChange={(e) => setPays(e.target.value)}
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          {/* Affichage des erreurs générales */}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterPage;
