import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EmployeeHeader from "../../components/header/EmployeeHeader";
import Footer from "../../components/footer/Footer";
import {
  getHoraires,
  createHoraire,
  updateHoraire,
  deleteHoraire,
} from "../../services/employeService";
import styles from "../../styles/employe/EmployeHorairesPage.module.css";

function EmployeHorairesPage() {
  // Hooks //
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // États pour les données
  const [horaires, setHoraires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // État pour l'horaire en cours d'édition
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    horaire_id: "",
    jour: "",
    heure_ouverture: "",
    heure_fermeture: "",
  });
  const [selectedHoraire, setSelectedHoraire] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    jour: "",
    heure_ouverture: "",
    heure_fermeture: "",
  });

  // Vérification de l'authentification et du rôle au chargement
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user?.role_id !== 3) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Charger les horaires au montage
  useEffect(() => {
    if (isAuthenticated && user?.role_id === 3) {
      loadHoraires();
    }
  }, [isAuthenticated, user]);

  // Fonction pour charger les horaires //
  const loadHoraires = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      const data = await getHoraires(); // getHoraires() ne prend pas de paramètres
      setHoraires(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message || "Erreur lors du chargement des horaires");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // fonction pour mettre à jour l'horaire //
  const handleUpdateHoraire = async (horaireId, horaireData) => {
    try {
      setError(null);
      setSuccessMessage(null);
      await updateHoraire(horaireId, horaireData);
      setSuccessMessage("L'horaire a été modifié avec succès !");

      // Recharger les horaires
      await loadHoraires();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError(error.message || "Erreur lors de la mise à jour de l'horaire");
      console.error("Erreur:", error);
    }
  };

  // Fonction pour ouvrir le modal d'édition
  const handleOpenEditModal = (horaire) => {
    setSelectedHoraire(horaire);
    setEditForm({
      jour: horaire.jour || "",
      heure_ouverture: horaire.heure_ouverture || "",
      heure_fermeture: horaire.heure_fermeture || "",
    });
    setShowEditModal(true);
  };

  // Fonction pour fermer le modal d'édition
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedHoraire(null);
    setEditForm({
      jour: "",
      heure_ouverture: "",
      heure_fermeture: "",
    });
  };

  // Fonction pour valider la mise à jour horaire //
  const handleSubmitUpdate = async () => {
    if (!selectedHoraire) return;
    try {
      setError(null);
      setSuccessMessage(null);
      // Préparer les données à envoyer (seulement les champs modifiés)
      const horaireData = {};
      if (editForm.jour) horaireData.jour = editForm.jour;
      if (editForm.heure_ouverture)
        horaireData.heure_ouverture = editForm.heure_ouverture;
      if (editForm.heure_fermeture)
        horaireData.heure_fermeture = editForm.heure_fermeture;

      await handleUpdateHoraire(selectedHoraire._id, horaireData);
      handleCloseEditModal();
    } catch (error) {
      setError(error.message || "Erreur lors de la mise à jour de l'horaire");
      console.error("Erreur:", error);
    }
  };

  // Fonction pour supprimer un horaire //
  const handleDeleteHoraire = async (horaireId) => {
    // Demander confirmation avant suppression
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet horaire ? Cette action est irréversible."
      )
    ) {
      return;
    }
    try {
      setError(null);
      setSuccessMessage(null);

      await deleteHoraire(horaireId);
      setSuccessMessage("L'horaire a été supprimé avec succès !");

      // Recharger les horaires pour mettre à jour la liste
      await loadHoraires();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError(error.message || "Erreur lors de la suppression de l'horaire");
      console.error("Erreur:", error);
    }
  };

  // Fonction pour ouvrir le modal de création
  const handleOpenCreateModal = () => {
    setCreateForm({
      horaire_id: "",
      jour: "",
      heure_ouverture: "",
      heure_fermeture: "",
    });
    setShowCreateModal(true);
  };

  // Fonction pour fermer le modal de création
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm({
      horaire_id: "",
      jour: "",
      heure_ouverture: "",
      heure_fermeture: "",
    });
  };

  // Fonction pour créer un horaire
  const handleCreateHoraire = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      // Vérifier que tous les champs sont remplis
      if (
        !createForm.horaire_id ||
        !createForm.jour ||
        !createForm.heure_ouverture ||
        !createForm.heure_fermeture
      ) {
        setError("Tous les champs sont requis");
        return;
      }

      await createHoraire(createForm);
      setSuccessMessage("L'horaire a été créé avec succès !");

      // Recharger les horaires
      await loadHoraires();

      // Fermer le modal
      handleCloseCreateModal();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError(error.message || "Erreur lors de la création de l'horaire");
      console.error("Erreur:", error);
    }
  };

  if (!isAuthenticated || user?.role_id !== 3) {
    return null; // La redirection est gérée par useEffect
  }

  return (
    <div className="app-container">
      <EmployeeHeader />
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Gestion des Horaires</h1>

          {loading && <p className={styles.loading}>Chargement...</p>}
          {error && <div className={styles.error}>Erreur : {error}</div>}
          {successMessage && (
            <div className={styles.success}>{successMessage}</div>
          )}

          {/* Section des horaires */}
          <section className={styles.horairesSection}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 className={styles.sectionTitle}>
                Horaires ({horaires.length})
              </h2>
              <button
                onClick={handleOpenCreateModal}
                className="btn-primary"
                style={{ padding: "0.75rem 1.5rem" }}
              >
                + Ajouter un horaire
              </button>
            </div>

            {horaires.length === 0 ? (
              <p className={styles.emptyMessage}>
                Aucun horaire disponible pour le moment
              </p>
            ) : (
              <div className={styles.horairesGrid}>
                {horaires.map((horaire) => (
                  <div key={horaire._id} className={styles.horaireCard}>
                    {/* Informations de l'horaire */}
                    <div className={styles.horaireInfo}>
                      <h3 className={styles.horaireJour}>{horaire.jour}</h3>

                      <div className={styles.horaireDetails}>
                        <p>
                          <strong>Ouverture :</strong> {horaire.heure_ouverture}
                        </p>
                        <p>
                          <strong>Fermeture :</strong> {horaire.heure_fermeture}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={styles.horaireActions}>
                      <button
                        onClick={() => handleOpenEditModal(horaire)}
                        className={`btn-primary ${styles.editButton}`}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteHoraire(horaire._id)}
                        className={`btn-outline ${styles.deleteButton}`}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Modal de création */}
          {showCreateModal && (
            <div
              className={styles.modalOverlay}
              onClick={handleCloseCreateModal}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Créer un nouvel horaire</h2>

                <div className={styles.modalForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="create_horaire_id">ID Horaire :</label>
                    <input
                      type="number"
                      id="create_horaire_id"
                      value={createForm.horaire_id}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          horaire_id: e.target.value,
                        })
                      }
                      className={styles.formInput}
                      placeholder="Ex: 1, 2, 3..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="create_jour">Jour :</label>
                    <input
                      type="text"
                      id="create_jour"
                      value={createForm.jour}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, jour: e.target.value })
                      }
                      className={styles.formInput}
                      placeholder="Ex: Lundi, Mardi, etc."
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="create_heure_ouverture">
                        Heure d'ouverture :
                      </label>
                      <input
                        type="time"
                        id="create_heure_ouverture"
                        value={createForm.heure_ouverture}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            heure_ouverture: e.target.value,
                          })
                        }
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="create_heure_fermeture">
                        Heure de fermeture :
                      </label>
                      <input
                        type="time"
                        id="create_heure_fermeture"
                        value={createForm.heure_fermeture}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            heure_fermeture: e.target.value,
                          })
                        }
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    onClick={handleCloseCreateModal}
                    className="btn-outline"
                  >
                    Annuler
                  </button>
                  <button onClick={handleCreateHoraire} className="btn-primary">
                    Créer l'horaire
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal d'édition */}
          {showEditModal && selectedHoraire && (
            <div className={styles.modalOverlay} onClick={handleCloseEditModal}>
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Modifier l'horaire : {selectedHoraire.jour}</h2>

                <div className={styles.modalForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="jour">Jour :</label>
                    <input
                      type="text"
                      id="jour"
                      value={editForm.jour}
                      onChange={(e) =>
                        setEditForm({ ...editForm, jour: e.target.value })
                      }
                      className={styles.formInput}
                      placeholder="Ex: Lundi, Mardi, etc."
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="heure_ouverture">
                        Heure d'ouverture :
                      </label>
                      <input
                        type="time"
                        id="heure_ouverture"
                        value={editForm.heure_ouverture}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            heure_ouverture: e.target.value,
                          })
                        }
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="heure_fermeture">
                        Heure de fermeture :
                      </label>
                      <input
                        type="time"
                        id="heure_fermeture"
                        value={editForm.heure_fermeture}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            heure_fermeture: e.target.value,
                          })
                        }
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    onClick={handleCloseEditModal}
                    className="btn-outline"
                  >
                    Annuler
                  </button>
                  <button onClick={handleSubmitUpdate} className="btn-primary">
                    Enregistrer les modifications
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

export default EmployeHorairesPage;
