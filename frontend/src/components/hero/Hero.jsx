import "../../index.css";
import styles from "./Hero.module.css";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleCommander = () => {
    // Si on n'est pas sur la page d'accueil, y rediriger d'abord
    if (window.location.pathname !== "/") {
      navigate("/");
      // Attendre que la page se charge avant de scroller
      setTimeout(() => {
        scrollToMenus();
      }, 100);
    } else {
      // Si on est déjà sur la page d'accueil, scroller directement
      scrollToMenus();
    }
  };

  const scrollToMenus = () => {
    const menusSection = document.getElementById("menus-section");
    if (menusSection) {
      menusSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Bienvenue sur Vite & Gourmand</h1>
        <p className={styles.heroText}>
          Vite & Gourmand vous livre de la cuisine française et internationnale
          à domicile ou que vous soyez dans la région ...
        </p>
        <button className={styles.heroButton} onClick={handleCommander}>
          Commander votre menu
        </button>
      </div>
      <div className={styles.heroImage}>
        <img src="/images/hero1.jpg" alt="Hero" />
      </div>
    </div>
  );
}

export default Hero;
