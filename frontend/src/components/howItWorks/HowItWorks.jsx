import "../../index.css";
import styles from "./HowItWorks.module.css";
import {
  SmartphoneIcon,
  ChefKnifeIcon,
  DeliveryBoxIcon,
  PlateIcon,
} from "./StepIllustrations";

function HowItWorks() {
  return (
    <div className={styles.howItWorks}>
      <div className={styles.container}>
        {/* Titre principal */}
        <div className={styles.titleSection}>
          <h1 className={styles.mainTitle}>COMMENT ÇA MARCHE</h1>
          <div className={styles.separator}></div>
          <p className={styles.subtitle}>Vite & Gourmand</p>
          <div className={styles.separator}></div>
        </div>

        {/* Grille des 4 étapes */}
        <div className={styles.stepsGrid}>
          {/* Étape 1 */}
          <div className={styles.step}>
            <div className={styles.stepIllustration}>
              <SmartphoneIcon className={styles.stepSvg} />
            </div>
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>CHOISISSEZ VOS PLATS</h2>
                <span className={styles.stepNumber}>01</span>
              </div>
              <div className={styles.stepSeparator}></div>
              <p className={styles.stepDescription}>
                Il y en a pour tous les goûts : Découverte, Festif Noël,
                Végétarien, Événement Premium, Pâques.
              </p>
            </div>
          </div>

          {/* Étape 2 */}
          <div className={styles.step}>
            <div className={styles.stepIllustration}>
              <ChefKnifeIcon className={styles.stepSvg} />
            </div>
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>NOS CHEFS CUISINENT</h2>
                <span className={styles.stepNumber}>02</span>
              </div>
              <div className={styles.stepSeparator}></div>
              <p className={styles.stepDescription}>
                A partir de produits frais et de saison cuits sous-vide à basse
                température.
              </p>
            </div>
          </div>

          {/* Étape 3 */}
          <div className={styles.step}>
            <div className={styles.stepIllustration}>
              <DeliveryBoxIcon className={styles.stepSvg} />
            </div>
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>FAITES-VOUS LIVRER</h2>
                <span className={styles.stepNumber}>03</span>
              </div>
              <div className={styles.stepSeparator}></div>
              <p className={styles.stepDescription}>
                A la maison ou au travail, partout en France ! En 3 minutes
                c'est prêt !
              </p>
            </div>
          </div>

          {/* Étape 4 */}
          <div className={styles.step}>
            <div className={styles.stepIllustration}>
              <PlateIcon className={styles.stepSvg} />
            </div>
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h2 className={styles.stepTitle}>DRESSEZ VOTRE ASSIETTE</h2>
                <span className={styles.stepNumber}>04</span>
              </div>
              <div className={styles.stepSeparator}></div>
              <p className={styles.stepDescription}>
                Tel un chef, suivez nos consignes pour que nos plats soient
                aussi beaux que bons !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
