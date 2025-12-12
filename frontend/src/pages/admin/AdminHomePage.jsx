import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";
import AdminHeader from "../../components/header/AdminHeader";
import styles from "../../styles/admin/AdminHomePage.module.css";

function AdminHomePage() {
  // Hooks //
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // gestion des états //
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vérifier l'authentification et le rôle au chargement
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Vérifier que l'utilisateur est bien un admin (role_id === 2)
    if (user?.role_id !== 2) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Charger les données //
  useEffect(() => {
    if (isAuthenticated && user?.role_id === 2) {
      loadData();
    }
  }, [isAuthenticated, user]);

  // Charger les données du dashboard admin
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Un seul appel API qui retourne toutes les données
      const response = await getAdminDashboard();

      // Le backend retourne { message, data: { admin, statistiques, commandes_recentes, avis_en_attente } }
      if (response && response.data) {
        setDashboardData(response.data);
      } else {
        setError("Format de données invalide");
      }
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des données");
      console.error("Erreur lors du chargement du dashboard admin :", err);
    } finally {
      setLoading(false);
    }
  };

  // Vérification avant le rendu
  if (!isAuthenticated || user?.role_id !== 2) {
    return null;
  }

  return (
    <div className="app-container">
      <AdminHeader />
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Espace Administrateur - Tableau de bord
          </h1>
          {dashboardData.admin && (
            <p className={styles.welcome}>
              Bonjour {dashboardData.admin.prenom} {dashboardData.admin.nom}
            </p>
          )}

          {loading && <p className={styles.loading}>Chargement...</p>}
          {error && <div className={styles.error}>Erreur : {error}</div>}

          {/* Cartes de statistiques */}
          {dashboardData.statistiques && (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Total employés</h3>
                <p className={`${styles.statValue} ${styles.employees}`}>
                  {dashboardData.statistiques.total_employes || 0}
                </p>
              </div>
              <div className={styles.statCard}>
                <h3>Total commandes</h3>
                <p className={`${styles.statValue} ${styles.total}`}>
                  {dashboardData.statistiques.total_commandes || 0}
                </p>
              </div>
              <div className={styles.statCard}>
                <h3>Chiffre d'affaires</h3>
                <p className={`${styles.statValue} ${styles.revenue}`}>
                  {dashboardData.statistiques.chiffre_affaires_total
                    ? `${parseFloat(
                        dashboardData.statistiques.chiffre_affaires_total
                      ).toFixed(2)}€`
                    : "0€"}
                </p>
              </div>
              <div className={styles.statCard}>
                <h3>Avis en attente</h3>
                <p className={`${styles.statValue} ${styles.reviews}`}>
                  {dashboardData.avis_en_attente?.length || 0}
                </p>
              </div>
            </div>
          )}

          {/* Statistiques par statut */}
          {dashboardData.statistiques?.commandes_par_statut &&
            dashboardData.statistiques.commandes_par_statut.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Commandes par statut</h2>
                <div className={styles.statusGrid}>
                  {dashboardData.statistiques.commandes_par_statut.map(
                    (stat, index) => (
                      <div key={index} className={styles.statusCard}>
                        <strong>{stat.statut}</strong>
                        <span>{stat.nombre} commande(s)</span>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

          {/* Aperçu commandes par menu (MongoDB) */}
          {dashboardData.statistiques?.commandes_par_menu &&
            dashboardData.statistiques.commandes_par_menu.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  Statistiques par menu (MongoDB)
                </h2>
                <div className={styles.menuStatsGrid}>
                  {dashboardData.statistiques.commandes_par_menu
                    .slice(0, 5)
                    .map((menu, index) => (
                      <div
                        key={menu.menu_id || index}
                        className={styles.menuStatCard}
                      >
                        <h4>{menu.menu_titre || "Menu"}</h4>
                        <p>
                          <strong>Commandes :</strong>{" "}
                          {menu.total_commandes || 0}
                        </p>
                        <p>
                          <strong>CA :</strong>{" "}
                          {menu.total_chiffre_affaires
                            ? `${parseFloat(
                                menu.total_chiffre_affaires
                              ).toFixed(2)}€`
                            : "0€"}
                        </p>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => navigate("/admin/statistiques")}
                  className={`btn-primary ${styles.statsButton}`}
                >
                  Voir toutes les statistiques
                </button>
              </section>
            )}

          {/* Commandes récentes */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Commandes récentes (24h)</h2>
            {!dashboardData.commandes_recentes ||
            dashboardData.commandes_recentes.length === 0 ? (
              <p className={styles.emptyMessage}>Aucune commande récente</p>
            ) : (
              <div className={styles.commandesGrid}>
                {dashboardData.commandes_recentes
                  .slice(0, 5)
                  .map((commande) => (
                    <div
                      key={commande.commande_id}
                      className={styles.commandeCard}
                    >
                      <div className={styles.commandeInfo}>
                        <strong>Commande {commande.numero_commande}</strong>
                        <p>
                          Client : {commande.client_nom}{" "}
                          {commande.client_prenom}
                        </p>
                        <p>Menu : {commande.menu_titre || "N/A"}</p>
                        <p>Statut : {commande.statut}</p>
                        <p>
                          Total :{" "}
                          {commande.prix_menu && commande.prix_livraison
                            ? `${(
                                parseFloat(commande.prix_menu) +
                                parseFloat(commande.prix_livraison)
                              ).toFixed(2)}€`
                            : "N/A"}
                        </p>
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
            {!dashboardData.avis_en_attente ||
            dashboardData.avis_en_attente.length === 0 ? (
              <p className={styles.emptyMessage}>Aucun avis en attente</p>
            ) : (
              <div className={styles.avisGrid}>
                {dashboardData.avis_en_attente.slice(0, 3).map((avis) => (
                  <div key={avis.avis_id} className={styles.avisCard}>
                    <p>
                      <strong>Note :</strong> {avis.note}/5
                    </p>
                    <p>
                      <strong>Commentaire :</strong>{" "}
                      {avis.description && avis.description.length > 100
                        ? `${avis.description.substring(0, 100)}...`
                        : avis.description || "Aucun commentaire"}
                    </p>
                    <p>
                      Par : {avis.user_nom} {avis.user_prenom}
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

export default AdminHomePage;
