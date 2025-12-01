import "../../index.css";
import styles from "./Header.module.css";
import { useState } from "react";

function Header() {
  // State pour le menu mobile //
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <h1>Vite & Gourmand</h1>
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
              <a href="#menu" onClick={() => setIsMenuOpen(false)}>
                Au menu
              </a>
              <a href="#equipe" onClick={() => setIsMenuOpen(false)}>
                L'équipe
              </a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)}>
                Contact
              </a>
            </div>

            {/* Boutons à droite */}
            <div className={styles.navRight}>
              <button
                className="btn-outline"
                onClick={() => setIsMenuOpen(false)}
              >
                Se connecter
              </button>
              <button
                className="btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Commencer
              </button>
            </div>
          </div>

          {/* Menu desktop - visible uniquement sur desktop */}
          <div className={styles.desktopMenu}>
            {/* Navigation à gauche */}
            <div className={styles.navLeft}>
              <a href="#menu">Au menu</a>
              <a href="#equipe">L'équipe</a>
              <a href="#contact">Contact</a>
            </div>

            {/* Boutons à droite */}
            <div className={styles.navRight}>
              <button className="btn-outline">Se connecter</button>
              <button className="btn-primary">Commencer</button>
            </div>
          </div>
        </nav>
      </div>
      
    </header>
  );
}

export default Header;
