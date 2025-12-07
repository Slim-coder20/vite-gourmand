import "../../index.css";
import styles from "./Header.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  // State pour le menu mobile //
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Récupérer les valeurs du contexte d'authentification
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false); // Fermer le menu mobile après déconnexion
      navigate("/"); // Rediriger vers la page d'accueil
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };



  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          {/* Bouton burger - visible uniquement sur mobile */}
          <button
            className={`${styles.burgerButton} ${
              isMenuOpen ? styles.burgerOpen : ""
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
          </button>

          {/* Logo */}
          <div className={styles.navCenter}>
            <Link to="/" className={styles.logoLink}>
              <h1>Vite & Gourmand</h1>
            </Link>
          </div>

          {/* Menu mobile - visible quand isMenuOpen est true */}
          <div
            className={`${styles.mobileMenu} ${
              isMenuOpen ? styles.mobileMenuOpen : ""
            }`}
          >
            {/* Bouton de fermeture */}
            <button
              className={styles.closeButton}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              ✕
            </button>

            {/* Navigation à gauche */}
            <div className={styles.navLeft}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <h2>Vite & Gourmand</h2>
              </Link>
              <a href="/team" onClick={() => setIsMenuOpen(false)}>
                L'équipe
              </a>
              <a href="/contact" onClick={() => setIsMenuOpen(false)}>
                Contact
              </a>
            </div>

            {/* Boutons à droite */}
            <div className={styles.navRight}>
              {isAuthenticated ? (
                // Si l'utilisateur est connecté
                <div className={styles.userSection}>
                  <span className={styles.userName}>
                    Bonjour, {user?.prenom} {user?.nom}
                  </span>
                  <button
                    className="btn-outline"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Déconnexion..." : "Déconnexion"}
                  </button>
                </div>
              ) : (
                // Si l'utilisateur n'est pas connecté
                <>
                  <Link
                    to="/login"
                    className="btn-outline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Menu desktop - visible uniquement sur desktop */}
          <div className={styles.desktopMenu}>
            {/* Navigation à gauche */}
            <div className={styles.navLeft}>
              <a href="/team">L'équipe</a>
              <a href="/contact">Contact</a>
            </div>

            {/* Boutons à droite */}
            <div className={styles.navRight}>
              {isAuthenticated ? (
                // Si l'utilisateur est connecté
                <div className={styles.userSection}>
                  <span className={styles.userName}>
                    Bonjour, {user?.prenom} {user?.nom}
                  </span>
                  <button
                    className="btn-outline"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? "Déconnexion..." : "Déconnexion"}
                  </button>
                </div>
              ) : (
                // Si l'utilisateur n'est pas connecté
                <>
                  <Link to="/login" className="btn-outline">
                    Se connecter
                  </Link>
                  <Link to="/register" className="btn-primary">
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
