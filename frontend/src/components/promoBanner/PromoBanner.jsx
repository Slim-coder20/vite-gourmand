import "../../index.css";
import styles from "./PromoBanner.module.css";

function PromoBanner() {
  return (
    <div className={styles.promoBanner}>
      <p className={styles.promoText}>
        Bénificier d'une reduction de 10% pour tout commande en ligne de plus de
        5 personnes.
      </p>
    </div>
  );
}

export default PromoBanner;
