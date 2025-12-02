import "../../index.css";
import styles from "./Hero.module.css";

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Bienvenue sur Vite & Gourmand</h1>
        <p className={styles.heroText}>
          Vite & Gourmand vous livre de la cuisine française et internationnale
          à domicile ou que vous soyez dans la région ...
        </p>
        <button className={styles.heroButton}>Commander votre menu</button>
      </div>
      <div className={styles.heroImage}>
        <img src="/images/hero1.jpg" alt="Hero" />
      </div>
    </div>
  );
}

export default Hero;
