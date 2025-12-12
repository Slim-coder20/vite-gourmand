import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import styles from "../styles/auth/Login.module.css";
import { Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Si déjà connecté, rediriger selon le rôle
  // Utiliser useEffect pour éviter d'appeler navigate() pendant le rendu
  useEffect(() => {
    // Attendre que l'authentification et l'utilisateur soient bien définis
    if (isAuthenticated && user && user.role_id) {
      // Si l'utilisateur est un admin (role_id === 2), rediriger vers l'espace admin
      if (user.role_id === 2) {
        navigate("/admin/dashboard");
      } else if (user.role_id === 3) {
        // Si l'utilisateur est un employé (role_id === 3), rediriger vers l'espace employé
        navigate("/employee/dashboard");
      } else {
        // Sinon, rediriger vers la page d'accueil client
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation côté client
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer un email valide");
      setIsLoading(false);
      return;
    }

    try {
      // Appeler la fonction login du contexte
      const response = await login(email, password);

      // Réinitialiser le formulaire
      setEmail("");
      setPassword("");

      // Rediriger immédiatement selon le rôle de la réponse
      // pour éviter les problèmes de timing avec le useEffect
      const userRole = response?.user?.role_id;
      if (userRole === 2) {
        // Admin : rediriger vers l'espace admin
        navigate("/admin/dashboard");
      } else if (userRole === 3) {
        // Employé : rediriger vers l'espace employé
        navigate("/employee/dashboard");
      } else {
        // Client : rediriger vers la page d'accueil
        navigate("/");
      }
    } catch (error) {
      setError(error.message || "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className={styles.loginContainer}>
        <h2>Connexion</h2>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {/* Champ Email */}
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

          {/* Champ Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          {/* Affichage des erreurs */}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
          <div className={styles.loginLinks}>
            <p>
              Vous n'avez pas de compte ?{" "}
              <a href="/register">Créer un compte</a>
            </p>
            <p className={styles.forgotPassword}>
              Mot de passe oublié ?{" "}
              <Link to="/forgot-password">Réinitialiser le mot de passe</Link>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
