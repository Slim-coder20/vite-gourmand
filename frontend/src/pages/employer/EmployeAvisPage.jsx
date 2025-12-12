import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EmployeeHeader from "../../components/header/EmployeeHeader";
import AdminHeader from "../../components/header/AdminHeader";
import Footer from "../../components/footer/Footer";
import {
  getAvisEmploye,
  validerAvis,
  refuserAvis,
} from "../../services/employeService";
import styles from "../../styles/employe/EmployeAvisPage.module.css";

function EmployeAvisPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // états pour les données //
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // État pour le filtre par statut
  const [filterStatut, setFilterStatut] = useState("");

  // Vérifier l'authentification et le role au chargement //
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user?.role_id !== 3 && user?.role_id !== 2) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Charger les avis quand les filtres chnagent //
  useEffect(() => {
    if (isAuthenticated && (user?.role_id === 3 || user?.role_id === 2)) {
      loadAvis();
    }
  }, [isAuthenticated, user, filterStatut]);

  // Fonction pour charger les avis avec filtres //
  const loadAvis = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const statut = filterStatut || null;
      const data = await getAvisEmploye(statut);
      setAvis(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des avis");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour valider un vais
  const handleValiderAvis = async (avisId) => {
    // Demander Confirmation
    if (!window.confirm("Êtes-vous sûr de vouloir valider cet avis ? ")) {
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);

      await validerAvis(avisId);
      setSuccessMessage("Avis validé avec succès !");

      // Recharger les avis //
      await loadAvis();

      // Effacer le messge de succès au bout de trois secondes //
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de la validation de l'avis");
      console.error("Erreur:", err);
    }
  };

  // Fonction pour refuser un avis
  const handleRefuserAvis = async (avisId) => {
    // Demande Confirmation  //
    if (!window.confirm("Êtes-vous sûr de vouloir refuser cet avis ?")) {
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);

      await refuserAvis(avisId);
      setSuccessMessage("Avis refusé avec succès !");

      // Recharger les avis //
      await loadAvis();

      // Effacer le message de succès //
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message || "Erreur lors du refus de l'avis");
      console.error("Erreur:", err);
    }
  };

  // Fonction pour gérer le changement de filtre
  const handleFilterChange = (value) => {
    setFilterStatut(value);
  };

  // Fonction pour afficher les étoiles selon la note
  const renderStars = (note) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= note ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      );
    }
    return stars;
  };
  // Liste des statuts possibles
  const statutsPossibles = [
    { value: "", label: "Tous les statuts" },
    { value: "non validée", label: "Non validée" },
    { value: "validée", label: "Validée" },
    { value: "refusée", label: "Refusée" },
  ];

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
          <h1 className={styles.title}>Gestion des Avis</h1>

          {loading && <p className={styles.loading}>Chargement...</p>}
          {error && <div className={styles.error}>Erreur : {error}</div>}
          {successMessage && (
            <div className={styles.success}>{successMessage}</div>
          )}

          {/* Section des filtres */}
          <section className={styles.filtersSection}>
            <h2 className={styles.sectionTitle}>Filtres</h2>
            <div className={styles.filtersGrid}>
              {/* Filtre par statut */}
              <div className={styles.filterGroup}>
                <label htmlFor="statut">Statut :</label>
                <select
                  id="statut"
                  value={filterStatut}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className={styles.filterInput}
                >
                  {statutsPossibles.map((statut) => (
                    <option key={statut.value} value={statut.value}>
                      {statut.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bouton pour réinitialiser le filtre */}
              <button
                onClick={() => handleFilterChange("")}
                className={`btn-outline ${styles.resetButton}`}
              >
                Réinitialiser les filtres
              </button>
            </div>
          </section>

          {/* Section des avis */}
          <section className={styles.avisSection}>
            <h2 className={styles.sectionTitle}>Avis ({avis.length})</h2>

            {avis.length === 0 ? (
              <p className={styles.emptyMessage}>
                Aucun avis trouvé avec ces filtres
              </p>
            ) : (
              <div className={styles.avisGrid}>
                {avis.map((avisItem) => (
                  <div key={avisItem.avis_id} className={styles.avisCard}>
                    {/* Header de la carte avec statut */}
                    <div className={styles.avisHeader}>
                      <div className={styles.avisInfo}>
                        <h3>
                          Avis #{avisItem.avis_id} - {avisItem.user_nom}{" "}
                          {avisItem.user_prenom}
                        </h3>
                        <span
                          className={`${styles.statutBadge} ${
                            styles[
                              `statut-${avisItem.statut.replace(/\s+/g, "-")}`
                            ]
                          }`}
                        >
                          {avisItem.statut}
                        </span>
                      </div>
                    </div>

                    {/* Note avec étoiles */}
                    <div className={styles.noteSection}>
                      <p className={styles.noteLabel}>Note :</p>
                      <div className={styles.starsContainer}>
                        {renderStars(avisItem.note)}
                        <span className={styles.noteValue}>
                          ({avisItem.note}/5)
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {avisItem.description && (
                      <div className={styles.descriptionSection}>
                        <p className={styles.descriptionLabel}>Commentaire :</p>
                        <p className={styles.descriptionText}>
                          {avisItem.description}
                        </p>
                      </div>
                    )}

                    {/* Image si présente */}
                    {avisItem.image && (
                      <div className={styles.imageSection}>
                        <img
                          src={avisItem.image}
                          alt="Avis"
                          className={styles.avisImage}
                        />
                      </div>
                    )}

                    {/* Informations client */}
                    <div className={styles.clientInfo}>
                      <p>
                        <strong>Client :</strong> {avisItem.user_nom}{" "}
                        {avisItem.user_prenom}
                      </p>
                      {avisItem.user_email && (
                        <p>
                          <strong>Email :</strong> {avisItem.user_email}
                        </p>
                      )}
                    </div>

                    {/* Actions - Boutons Valider/Refuser */}
                    {avisItem.statut === "non validée" && (
                      <div className={styles.avisActions}>
                        <button
                          onClick={() => handleValiderAvis(avisItem.avis_id)}
                          className={`btn-primary ${styles.validateButton}`}
                        >
                          ✓ Valider
                        </button>
                        <button
                          onClick={() => handleRefuserAvis(avisItem.avis_id)}
                          className={`btn-outline ${styles.refuseButton}`}
                        >
                          ✗ Refuser
                        </button>
                      </div>
                    )}

                    {/* Message si déjà traité */}
                    {avisItem.statut !== "non validée" && (
                      <div className={styles.processedMessage}>
                        <p>
                          Cet avis a été{" "}
                          {avisItem.statut === "validée" ? "validé" : "refusé"}
                        </p>
                      </div>
                    )}
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

export default EmployeAvisPage;
