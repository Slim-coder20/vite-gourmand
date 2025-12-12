import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EmployeeHeader from "../../components/header/EmployeeHeader";
import AdminHeader from "../../components/header/AdminHeader";
import Footer from "../../components/footer/Footer";
import {
  getCommandesEmploye,
  getAvisEmploye,
} from "../../services/employeService";
import styles from "../../styles/employe/EmployeeHomePage.module.css";

function EmployeeHomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Statistiques
  const [stats, setStats] = useState({
    commandesEnAttente: 0,
    commandesEnPreparation: 0,
    avisEnAttente: 0,
    totalCommandes: 0,
  });

  // Vérifier l'authentification et le rôle au chargement
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Vérifier que l'utilisateur est bien un employé (role_id === 3) ou admin (role_id === 2)
    if (user?.role_id !== 3 && user?.role_id !== 2) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Charger les données au montage
  useEffect(() => {
    if (isAuthenticated && (user?.role_id === 3 || user?.role_id === 2)) {
      loadData();
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les commandes et avis en parallèle
      const [commandesData, avisData] = await Promise.all([
        getCommandesEmploye(),
        getAvisEmploye(),
      ]);

      setCommandes(Array.isArray(commandesData) ? commandesData : []);
      setAvis(Array.isArray(avisData) ? avisData : []);

      // Calculer les statistiques
      const enAttente = commandesData.filter(
        (c) => c.statut === "en attente"
      ).length;
      const enPreparation = commandesData.filter(
        (c) => c.statut === "en préparation"
      ).length;
      const avisNonValides = avisData.filter(
        (a) => a.statut === "non validée"
      ).length;

      setStats({
        commandesEnAttente: enAttente,
        commandesEnPreparation: enPreparation,
        avisEnAttente: avisNonValides,
        totalCommandes: commandesData.length,
      });
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des données");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || (user?.role_id !== 3 && user?.role_id !== 2)) {
    return null; // La redirection est gérée par useEffect
  }

  // Choisir le header selon le rôle
  const Header = user?.role_id === 2 ? AdminHeader : EmployeeHeader;

  return (
    <div className="app-container">
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Espace Employé - Tableau de bord</h1>

          {loading && <p className={styles.loading}>Chargement...</p>}
          {error && <div className={styles.error}>Erreur : {error}</div>}

          {/* Statistiques */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Commandes en attente</h3>
              <p className={`${styles.statValue} ${styles.pending}`}>
                {stats.commandesEnAttente}
              </p>
            </div>
            <div className={styles.statCard}>
              <h3>En préparation</h3>
              <p className={`${styles.statValue} ${styles.preparing}`}>
                {stats.commandesEnPreparation}
              </p>
            </div>
            <div className={styles.statCard}>
              <h3>Avis en attente</h3>
              <p className={`${styles.statValue} ${styles.reviews}`}>
                {stats.avisEnAttente}
              </p>
            </div>
            <div className={styles.statCard}>
              <h3>Total commandes</h3>
              <p className={`${styles.statValue} ${styles.total}`}>
                {stats.totalCommandes}
              </p>
            </div>
          </div>

          {/* Commandes récentes */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Commandes récentes</h2>
            {commandes.length === 0 ? (
              <p className={styles.emptyMessage}>
                Aucune commande pour le moment
              </p>
            ) : (
              <div className={styles.commandesGrid}>
                {commandes.slice(0, 5).map((commande) => (
                  <div
                    key={commande.commande_id}
                    className={styles.commandeCard}
                  >
                    <div className={styles.commandeInfo}>
                      <strong>Commande {commande.numero_commande}</strong>
                      <p>
                        Client : {commande.user_nom} {commande.user_prenom}
                      </p>
                      <p>Statut : {commande.statut}</p>
                    </div>
                    <button
                      onClick={() => navigate("/employee/commandes")}
                      className={`btn-primary ${styles.commandeButton}`}
                    >
                      Voir détails
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Avis en attente */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Avis en attente de validation
            </h2>
            {avis.filter((a) => a.statut === "non validée").length === 0 ? (
              <p className={styles.emptyMessage}>Aucun avis en attente</p>
            ) : (
              <div className={styles.avisGrid}>
                {avis
                  .filter((a) => a.statut === "non validée")
                  .slice(0, 3)
                  .map((avisItem) => (
                    <div key={avisItem.avis_id} className={styles.avisCard}>
                      <p>
                        <strong>Note :</strong> {avisItem.note}/5
                      </p>
                      <p>
                        <strong>Commentaire :</strong> {avisItem.description}
                      </p>
                      <p>
                        Par : {avisItem.user_nom} {avisItem.user_prenom}
                      </p>
                      <button
                        onClick={() => navigate("/employee/avis")}
                        className={`btn-primary ${styles.avisButton}`}
                      >
                        Gérer les avis
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EmployeeHomePage;
