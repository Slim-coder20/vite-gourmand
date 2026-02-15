import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import styles from "../styles/confidentialite/Confidentialite.module.css";

function Confidentialite() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <header className={styles.pageHeader}>
            <h1>Politique de confidentialité</h1>
            <p>
              Vite &amp; Gourmand s’engage à protéger vos données personnelles.
              Cette politique décrit comment nous collectons, utilisons et
              protégeons vos informations conformément au RGPD.
            </p>
          </header>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Responsable du traitement</h2>
              <div className={styles.sectionContent}>
                <p>
                  Le responsable du traitement des données personnelles est
                  Vite &amp; Gourmand. Pour toute question relative à vos données,
                  vous pouvez nous contacter via notre{" "}
                  <Link to="/contact" className={styles.link}>
                    page contact
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Données collectées</h2>
              <div className={styles.sectionContent}>
                <p>
                  Nous sommes susceptibles de collecter les données suivantes
                  lorsque vous utilisez notre site ou nos services :
                </p>
                <p>
                  <strong>Données d’identification :</strong> nom, prénom, adresse
                  e-mail, mot de passe (stocké de manière sécurisée et chiffré),
                  adresse de livraison ou de facturation le cas échéant.
                </p>
                <p>
                  <strong>Données de navigation :</strong> adresse IP, type de
                  navigateur, pages visitées, date et heure de connexion, dans le
                  respect des cookies et traceurs utilisés (voir section Cookies).
                </p>
                <p>
                  <strong>Données liées aux commandes :</strong> contenu des
                  commandes, historique des commandes, préférences alimentaires
                  le cas échéant.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Finalités du traitement</h2>
              <div className={styles.sectionContent}>
                <p>Vos données sont utilisées pour :</p>
                <p>
                  la création et la gestion de votre compte client ; la prise en
                  charge et le suivi de vos commandes ; la réponse à vos demandes
                  envoyées via le formulaire de contact ; l’envoi, avec votre
                  accord, d’informations ou d’offres (newsletter) ; l’amélioration
                  de nos services et de l’ergonomie du site ; le respect de nos
                  obligations légales et réglementaires.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Base légale et durée de conservation</h2>
              <div className={styles.sectionContent}>
                <p>
                  Le traitement repose sur l’exécution du contrat (commandes),
                  votre consentement (newsletter, cookies non essentiels) ou notre
                  intérêt légitime (sécurité du site, amélioration du service).
                </p>
                <p>
                  Les données sont conservées pendant la durée nécessaire à ces
                  finalités : données de compte tant que le compte est actif,
                  données de commande pendant les délais légaux de conservation
                  comptable et fiscale, données de contact selon la nature de la
                  demande. Au-delà, les données sont supprimées ou anonymisées.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Vos droits (RGPD)</h2>
              <div className={styles.sectionContent}>
                <p>Conformément au Règlement général sur la protection des données (RGPD), vous disposez des droits suivants :</p>
                <p>
                  <strong>Droit d’accès</strong> : obtenir une copie de vos données
                  personnelles que nous détenons.
                </p>
                <p>
                  <strong>Droit de rectification</strong> : faire corriger des
                  données inexactes ou incomplètes.
                </p>
                <p>
                  <strong>Droit à l’effacement</strong> : demander la suppression
                  de vos données dans les limites prévues par la loi.
                </p>
                <p>
                  <strong>Droit à la limitation du traitement</strong> : demander
                  que le traitement soit limité dans certains cas.
                </p>
                <p>
                  <strong>Droit à la portabilité</strong> : recevoir vos données
                  dans un format structuré et couramment utilisé.
                </p>
                <p>
                  <strong>Droit d’opposition</strong> : vous opposer au
                  traitement de vos données pour des motifs légitimes (ex. prospection).
                </p>
                <p>
                  Pour exercer ces droits, contactez-nous via la{" "}
                  <Link to="/contact" className={styles.link}>
                    page contact
                  </Link>
                  . Vous avez également le droit d’introduire une réclamation
                  auprès de la CNIL (www.cnil.fr).
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Cookies</h2>
              <div className={styles.sectionContent}>
                <p>
                  Le site utilise des cookies pour le bon fonctionnement de
                  l’application (session utilisateur, préférences). Ces cookies
                  sont nécessaires au service. D’éventuels cookies de mesure
                  d’audience ou de personnalisation ne sont utilisés qu’avec
                  votre consentement. Vous pouvez gérer vos préférences via les
                  paramètres de votre navigateur.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Sécurité</h2>
              <div className={styles.sectionContent}>
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles
                  appropriées pour protéger vos données contre tout accès non
                  autorisé, perte, altération ou divulgation (sécurisation des
                  échanges, mots de passe hashés, accès restreint aux données).
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>8. Modifications</h2>
              <div className={styles.sectionContent}>
                <p>
                  Nous nous réservons le droit de modifier cette politique de
                  confidentialité. Toute mise à jour sera publiée sur cette page
                  avec une date de dernière mise à jour. Nous vous invitons à la
                  consulter régulièrement. Pour les changements importants, une
                  information pourra vous être communiquée par e-mail ou via le
                  site.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>9. Liens utiles</h2>
              <div className={styles.sectionContent}>
                <p>
                  Pour compléter vos informations, vous pouvez consulter nos{" "}
                  <Link to="/mentions-legales" className={styles.link}>
                    mentions légales
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

export default Confidentialite;
