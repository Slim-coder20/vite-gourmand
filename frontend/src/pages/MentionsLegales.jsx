import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import styles from "../styles/mentionsLegales/MentionsLegales.module.css";

function MentionsLegales() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <header className={styles.pageHeader}>
            <h1>Mentions légales</h1>
            <p>
              Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2026
              pour la confiance dans l’économie numérique, voici les informations
              légales concernant le site Vite &amp; Gourmand.
            </p>
          </header>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Éditeur du site</h2>
              <div className={styles.sectionContent}>
                <p>
                  Le site <strong>Vite &amp; Gourmand</strong> est édité par :
                </p>
                <p>
                  Vite &amp; Gourmand<br />
                  Rue de la Paix, 75000 Paris<br />
                  75000 Paris<br />
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Directeur de la publication</h2>
              <div className={styles.sectionContent}>
                <p>
                  Le directeur de la publication du site est José SENE,
                  en qualité de directeur de la publication.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Hébergement</h2>
              <div className={styles.sectionContent}>
                <p>
                  Le site est hébergé par :<br />
                 Vercel<br />
                  Rue de la Paix, 75000 Paris<br />
                  75000 Paris<br />
                  Contact: contact@vitegourmand.com<br />
                  Phone: +33 6 12 34 56 78<br />
                  Email: contact@vitegourmand.com<br />
                  Website: https://vite-gourmand.vercel.app<br />
                  Company: Vite Gourmand<br />
                  Address: Rue de la Paix, 75000 Paris<br />
                  75000 Paris<br />
                  Country: France<br />
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Propriété intellectuelle</h2>
              <div className={styles.sectionContent}>
                <p>
                  L’ensemble du contenu de ce site (textes, images, graphismes, logo,
                  icônes, etc.) est protégé par le droit d’auteur et le droit des
                  marques. Toute reproduction, représentation ou diffusion, totale
                  ou partielle, sans autorisation préalable de l’éditeur, est interdite
                  et constitue une contrefaçon.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Données personnelles</h2>
              <div className={styles.sectionContent}>
                <p>
                  Les informations recueillies via le site sont enregistrées dans un
                  fichier informatisé pour la gestion des commandes, des comptes
                  clients et de la relation commerciale. Pour en savoir plus sur la
                  collecte et le traitement de vos données, consultez notre{" "}
                  <Link to="/confidentialite" className={styles.link}>
                    politique de confidentialité
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Cookies</h2>
              <div className={styles.sectionContent}>
                <p>
                  Le site peut être amené à utiliser des cookies pour le bon
                  fonctionnement de l’application (session, préférences). En naviguant
                  sur ce site, vous acceptez l’utilisation de ces cookies conformément
                  à notre politique de confidentialité.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Droit applicable</h2>
              <div className={styles.sectionContent}>
                <p>
                  Les présentes mentions légales sont régies par le droit français.
                  En cas de litige, les tribunaux français seront seuls compétents.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>8. Contact</h2>
              <div className={styles.sectionContent}>
                <p>
                  Pour toute question relative aux mentions légales ou au site,
                  vous pouvez nous contacter via notre{" "}
                  <Link to="/contact" className={styles.link}>
                    page contact
                  </Link>
                  .
                </p>
              </div>
            </section>

            <p className={styles.lastUpdate}>
              Dernière mise à jour : février 2026
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MentionsLegales;
