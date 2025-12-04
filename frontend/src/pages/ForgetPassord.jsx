import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import * as authService from "../services/authService";
import styles from "../styles/auth/Login.module.css";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validation
    if (!email) {
      setError("Veuillez entrer votre adresse email");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer un email valide");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.forgotPassword(email);
      setSuccess(response.message);

      // En développement, afficher aussi le lien
      if (response.resetLink) {
        setSuccess(
          `${response.message}\n\nLien de réinitialisation (développement) :\n${response.resetLink}`
        );
      }

      setEmail("");
    } catch (error) {
      setError(
        error.message || "Erreur lors de la demande de réinitialisation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className={styles.loginContainer}>
        <h2>Mot de passe oublié</h2>
        <p style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
          Entrez votre adresse email et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && (
            <div
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                padding: "var(--spacing-md)",
                borderRadius: "8px",
                marginBottom: "var(--spacing-md)",
                whiteSpace: "pre-line",
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading
              ? "Envoi en cours..."
              : "Envoyer le lien de réinitialisation"}
          </button>

          <div className={styles.loginLinks}>
            <p>
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link to="/login">Se connecter</Link>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ForgetPassword;