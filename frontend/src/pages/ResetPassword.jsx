import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import * as authService from "../services/authService";
import styles from "../styles/auth/Login.module.css";

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Token de réinitialisation manquant");
    } else {
      // Décoder le token au cas où il serait encodé dans l'URL
      console.log("Token reçu depuis l'URL:", token);
    }
  }, [token]);

  const validateForm = () => {
    const errors = {};

    if (!newPassword) {
      errors.newPassword = "Le nouveau mot de passe est requis";
    } else {
      if (newPassword.length < 10) {
        errors.newPassword =
          "Le mot de passe doit contenir au moins 10 caractères";
      } else {
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);

        if (!hasSpecialChar || !hasUpperCase || !hasLowerCase || !hasNumber) {
          errors.newPassword =
            "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial";
        }
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = "La confirmation du mot de passe est requise";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setValidationErrors({});
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError("Token de réinitialisation manquant");
      setIsLoading(false);
      return;
    }

    try {
      // Décoder le token au cas où il serait encodé dans l'URL
      const decodedToken = decodeURIComponent(token);
      console.log("Token décodé:", decodedToken);
      await authService.resetPassword(decodedToken, newPassword);
      setSuccess("Votre mot de passe a été réinitialisé avec succès !");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
      setError(
        error.message || "Erreur lors de la réinitialisation du mot de passe"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="app-container">
        <Header />
        <div className={styles.loginContainer}>
          <h2>Erreur</h2>
          <p>Token de réinitialisation manquant.</p>
          <Link to="/forgot-password">Demander un nouveau lien</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <div className={styles.loginContainer}>
        <h2>Réinitialiser le mot de passe</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
              className={
                validationErrors.newPassword ? styles.inputError : styles.input
              }
            />
            {validationErrors.newPassword && (
              <span
                style={{
                  color: "var(--color-error)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                {validationErrors.newPassword}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
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
              <span
                style={{
                  color: "var(--color-error)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                {validationErrors.confirmPassword}
              </span>
            )}
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && (
            <div
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                padding: "var(--spacing-md)",
                borderRadius: "8px",
              }}
            >
              {success}
              <br />
              <small>Redirection vers la page de connexion...</small>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || success}
            className={styles.submitButton}
          >
            {isLoading
              ? "Réinitialisation..."
              : "Réinitialiser le mot de passe"}
          </button>

          <div className={styles.loginLinks}>
            <p>
              <Link to="/login">Retour à la connexion</Link>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ResetPassword;
