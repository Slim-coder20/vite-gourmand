import "../../index.css";
import styles from "./AdminHeader.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminHeader() {
  // State pour le menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Récupérer les valeurs du contexte d'authentification
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/"); // Rediriger vers la page d'accueil publique
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
            <Link to="/admin/dashboard" className={styles.logoLink}>
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
            <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
              <h2>Accueil</h2>
            </Link>
            <Link to="/employee/commandes" onClick={() => setIsMenuOpen(false)}>
              Commandes
            </Link>
            <Link to="/employee/avis" onClick={() => setIsMenuOpen(false)}>
              Avis
            </Link>
            <Link to="/employee/menus" onClick={() => setIsMenuOpen(false)}>
              Menus
            </Link>
            <Link to="/employee/plats" onClick={() => setIsMenuOpen(false)}>
              Plats
            </Link>
            <Link to="/employee/horaires" onClick={() => setIsMenuOpen(false)}>
              Horaires
            </Link>
            <Link to="/admin/employes" onClick={() => setIsMenuOpen(false)}>
              Employés
            </Link>
            <Link
              to="/admin/statistiques"
              onClick={() => setIsMenuOpen(false)}
            >
              Statistiques
            </Link>
          </div>

            {/* Boutons à droite */}
            <div className={styles.navRight}>
              <div className={styles.userSection}>
                <span className={styles.userName}>
                  {user?.prenom} {user?.nom}
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
            </div>
          </div>

          {/* Menu desktop - visible uniquement sur desktop */}
          <div className={styles.desktopMenu}>
          {/* Navigation à gauche */}
          <div className={styles.navLeft}>
            <Link to="/admin/dashboard">Accueil</Link>
            <Link to="/employee/commandes">Commandes</Link>
            <Link to="/employee/avis">Avis</Link>
            <Link to="/employee/menus">Menus</Link>
            <Link to="/employee/plats">Plats</Link>
            <Link to="/employee/horaires">Horaires</Link>
            <Link to="/admin/employes">Employés</Link>
            <Link to="/admin/statistiques">Statistiques</Link>
          </div>

            {/* Boutons à droite */}
            <div className={styles.navRight}>
              <div className={styles.userSection}>
                <span className={styles.userName}>
                  {user?.prenom} {user?.nom}
                </span>
                <button
                  className="btn-outline"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? "Déconnexion..." : "Déconnexion"}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default AdminHeader;
