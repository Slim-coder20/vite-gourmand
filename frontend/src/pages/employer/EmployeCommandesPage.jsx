import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EmployeeHeader from "../../components/header/EmployeeHeader";
import AdminHeader from "../../components/header/AdminHeader";
import Footer from "../../components/footer/Footer";
import {
  getCommandesEmploye,
  updateCommandeStatut,
  annulerCommandeEmploye,
} from "../../services/employeService";
import styles from "../../styles/employe/EmployeCommandes.module.css";

function EmployeCommandesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // États pour les données
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // États pour les filtres
  const [filters, setFilters] = useState({
    statut: "",
    user_id: "",
    date_debut: "",
    date_fin: "",
  });

  // États pour les modals/formulaires
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelForm, setCancelForm] = useState({
    motif_annulation: "",
    mode_contact: "email",
  });

  // Vérifier l'authentification et le rôle au chargement
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

  // Charger les commandes quand les filtres changent
  useEffect(() => {
    if (isAuthenticated && (user?.role_id === 3 || user?.role_id === 2)) {
      loadCommandes();
    }
  }, [isAuthenticated, user, filters]);

  // Fonction pour charger les commandes avec filtres
  const loadCommandes = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const data = await getCommandesEmploye(filters);
      setCommandes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des commandes");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour le statut d'une commande
  const handleUpdateStatut = async (commandeId, nouveauStatut) => {
    try {
      setError(null);
      setSuccessMessage(null);

      await updateCommandeStatut(commandeId, nouveauStatut);
      setSuccessMessage(`Statut de la commande mis à jour avec succès !`);

      // Recharger les commandes
      await loadCommandes();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du statut");
      console.error("Erreur:", err);
    }
  };

  // Fonction pour ouvrir le modal d'annulation
  const handleOpenCancelModal = (commande) => {
    setSelectedCommande(commande);
    setShowCancelModal(true);
    setCancelForm({
      motif_annulation: "",
      mode_contact: "email",
    });
  };

  // Fonction pour fermer le modal d'annulation
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSelectedCommande(null);
    setCancelForm({
      motif_annulation: "",
      mode_contact: "email",
    });
  };

  // Fonction pour annuler une commande
  const handleAnnulerCommande = async () => {
    if (!selectedCommande) return;

    if (!cancelForm.motif_annulation.trim()) {
      setError("Veuillez saisir un motif d'annulation");
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);

      await annulerCommandeEmploye(
        selectedCommande.commande_id,
        cancelForm.motif_annulation,
        cancelForm.mode_contact
      );

      setSuccessMessage("Commande annulée avec succès !");
      handleCloseCancelModal();

      // Recharger les commandes
      await loadCommandes();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de l'annulation de la commande");
      console.error("Erreur:", err);
    }
  };

  // Fonction pour gérer les changements de filtres
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fonction pour réinitialiser les filtres
  const handleResetFilters = () => {
    setFilters({
      statut: "",
      user_id: "",
      date_debut: "",
      date_fin: "",
    });
  };

  // Liste des statuts possibles
  const statutsPossibles = [
    "en attente",
    "accepté",
    "en préparation",
    "en cours de livraison",
    "livré",
    "en attente du retour de matériel",
    "terminée",
    "annulée",
  ];

  if (!isAuthenticated || (user?.role_id !== 3 && user?.role_id !== 2)) {
    return null;
  }

  // Choisir le header selon le rôle
  const Header = user?.role_id === 2 ? AdminHeader : EmployeeHeader;

  return (
    <div className="app-container">
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Gestion des Commandes</h1>

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
                  value={filters.statut}
                  onChange={(e) => handleFilterChange("statut", e.target.value)}
                  className={styles.filterInput}
                >
                  <option value="">Tous les statuts</option>
                  {statutsPossibles.map((statut) => (
                    <option key={statut} value={statut}>
                      {statut.charAt(0).toUpperCase() + statut.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre par ID client */}
              <div className={styles.filterGroup}>
                <label htmlFor="user_id">ID Client :</label>
                <input
                  type="text"
                  id="user_id"
                  value={filters.user_id}
                  onChange={(e) =>
                    handleFilterChange("user_id", e.target.value)
                  }
                  placeholder="Rechercher par ID client"
                  className={styles.filterInput}
                />
              </div>

              {/* Filtre par date de début */}
              <div className={styles.filterGroup}>
                <label htmlFor="date_debut">Date de début :</label>
                <input
                  type="date"
                  id="date_debut"
                  value={filters.date_debut}
                  onChange={(e) =>
                    handleFilterChange("date_debut", e.target.value)
                  }
                  className={styles.filterInput}
                />
              </div>

              {/* Filtre par date de fin */}
              <div className={styles.filterGroup}>
                <label htmlFor="date_fin">Date de fin :</label>
                <input
                  type="date"
                  id="date_fin"
                  value={filters.date_fin}
                  onChange={(e) =>
                    handleFilterChange("date_fin", e.target.value)
                  }
                  className={styles.filterInput}
                />
              </div>
            </div>

            {/* Bouton pour réinitialiser les filtres */}
            <button
              onClick={handleResetFilters}
              className={`btn-outline ${styles.resetButton}`}
            >
              Réinitialiser les filtres
            </button>
          </section>

          {/* Section des commandes */}
          <section className={styles.commandesSection}>
            <h2 className={styles.sectionTitle}>
              Commandes ({commandes.length})
            </h2>

            {commandes.length === 0 ? (
              <p className={styles.emptyMessage}>
                Aucune commande trouvée avec ces filtres
              </p>
            ) : (
              <div className={styles.commandesGrid}>
                {commandes.map((commande) => (
                  <div
                    key={commande.commande_id}
                    className={styles.commandeCard}
                  >
                    <div className={styles.commandeHeader}>
                      <h3>Commande {commande.numero_commande}</h3>
                      <span
                        className={`${styles.statutBadge} ${
                          styles[
                            `statut-${commande.statut.replace(/\s+/g, "-")}`
                          ]
                        }`}
                      >
                        {commande.statut}
                      </span>
                    </div>

                    <div className={styles.commandeInfo}>
                      <p>
                        <strong>Client :</strong> {commande.user_nom}{" "}
                        {commande.user_prenom}
                      </p>
                      <p>
                        <strong>Email :</strong> {commande.user_email}
                      </p>
                      {commande.date_commande && (
                        <p>
                          <strong>Date :</strong>{" "}
                          {new Date(commande.date_commande).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      )}
                      {commande.date_prestation && (
                        <p>
                          <strong>Date de prestation :</strong>{" "}
                          {new Date(
                            commande.date_prestation
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                      {commande.prix_total && (
                        <p>
                          <strong>Prix total :</strong> {commande.prix_total}€
                        </p>
                      )}
                    </div>

                    <div className={styles.commandeActions}>
                      {/* Sélecteur de statut */}
                      <div className={styles.statutSelect}>
                        <label htmlFor={`statut-${commande.commande_id}`}>
                          Modifier le statut :
                        </label>
                        <select
                          id={`statut-${commande.commande_id}`}
                          value={commande.statut}
                          onChange={(e) =>
                            handleUpdateStatut(
                              commande.commande_id,
                              e.target.value
                            )
                          }
                          className={styles.selectInput}
                          disabled={
                            commande.statut === "terminée" ||
                            commande.statut === "annulée"
                          }
                        >
                          {statutsPossibles.map((statut) => (
                            <option key={statut} value={statut}>
                              {statut.charAt(0).toUpperCase() + statut.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Bouton d'annulation */}
                      {commande.statut !== "terminée" &&
                        commande.statut !== "annulée" && (
                          <button
                            onClick={() => handleOpenCancelModal(commande)}
                            className={`btn-outline ${styles.cancelButton}`}
                          >
                            Annuler la commande
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Modal d'annulation */}
          {showCancelModal && selectedCommande && (
            <div
              className={styles.modalOverlay}
              onClick={handleCloseCancelModal}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Annuler la commande {selectedCommande.numero_commande}</h2>
                <p>
                  Client : {selectedCommande.user_nom}{" "}
                  {selectedCommande.user_prenom}
                </p>

                <div className={styles.modalForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="motif">
                      Motif d'annulation{" "}
                      <span className={styles.required}>*</span>:
                    </label>
                    <textarea
                      id="motif"
                      value={cancelForm.motif_annulation}
                      onChange={(e) =>
                        setCancelForm({
                          ...cancelForm,
                          motif_annulation: e.target.value,
                        })
                      }
                      placeholder="Saisissez le motif d'annulation..."
                      rows={4}
                      className={styles.textarea}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="mode_contact">Mode de contact :</label>
                    <select
                      id="mode_contact"
                      value={cancelForm.mode_contact}
                      onChange={(e) =>
                        setCancelForm({
                          ...cancelForm,
                          mode_contact: e.target.value,
                        })
                      }
                      className={styles.selectInput}
                    >
                      <option value="email">Email</option>
                      <option value="GSM">GSM</option>
                    </select>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    onClick={handleCloseCancelModal}
                    className="btn-outline"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAnnulerCommande}
                    className="btn-primary"
                  >
                    Confirmer l'annulation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EmployeCommandesPage;
