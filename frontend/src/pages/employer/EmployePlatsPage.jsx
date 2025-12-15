import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EmployeeHeader from "../../components/header/EmployeeHeader";
import AdminHeader from "../../components/header/AdminHeader";
import Footer from "../../components/footer/Footer";
import {
  getPlat,
  getPlats,
  createPlat,
  updatePlat,
  deletePlat,
} from "../../services/employeService";
import styles from "../../styles/employe/EmployePlatsPage.module.css";

function EmployePlatsPage() {
  // Hooks //
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Ėtats pour les données //
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Etats pour le plat en cours d'édition //
  const [selectedPlat, setSelectedPlat] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    titre_plat: "",
    photo: "",
    allergenes: [],
  });

  // Etats pour la création d'un nouveau plat //
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    titre_plat: "",
    photo: "",
    allergenes: [],
  });

  // Vérfication de l'authentification et du role au chargement //
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

  // Charger les plats au montage //
  useEffect(() => {
    if (isAuthenticated && (user?.role_id === 3 || user?.role_id === 2)) {
      loadPlats();
    }
  }, [isAuthenticated, user]);

  // Fonction pour charger les plats //
  const loadPlats = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const data = await getPlats();
      setPlats(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message || "Erreur lors du chargement des plats");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };
  // Fonction pour mettte a jour un plat //
  const handleUpdatePlat = async (platId, nouveauPlat) => {
    try {
      setError(null);
      setSuccessMessage(null);
      await updatePlat(platId, nouveauPlat);
      setSuccessMessage("Le plat a été modifié avec succès !");

      // Recharger les plats //
      loadPlats();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError(error.message || "Erreur lors de la mise à jour du plat");
      console.error("Erreur:", error);
    }
  };

  // Fonction pour ouvrir la modal //
  const handleOpenEditModal = (plat) => {
    setSelectedPlat(plat);
    setEditForm({
      titre_plat: plat.titre_plat || "",
      photo: plat.photo || "",
      allergenes: plat.allergenes || [],
    });
    setShowEditModal(true);
  };

  // Fonction pour récupérer un plat via son Id //
  const handleGetPlat = async (platId) => {
    try {
      setError(null);
      setSuccessMessage(null);
      const plat = await getPlat(platId);
      setSelectedPlat(plat);
      setSuccessMessage("Le plat a été bien récupéré avec succès !");

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError(error.message || "Erreur lors de la récupération du plat");
      console.error("Erreur:", error);
    }
  };

  // Fonction pour fermer la modal d'édition //
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPlat(null);
    setEditForm({
      titre_plat: "",
      photo: "",
      allergenes: [],
    });
  };

  // Fonction pour soumettre la mise à jour //
  const handleSubmitUpdate = async () => {
    if (!selectedPlat) return;

    try {
      setError(null);
      setSuccessMessage(null);

      // Préparer les données à envoyer (seulement les champs modifiés)
      const platData = {};
      if (editForm.titre_plat) platData.titre_plat = editForm.titre_plat;
      if (editForm.photo) platData.photo = editForm.photo;
      if (editForm.allergenes) platData.allergenes = editForm.allergenes;

      await handleUpdatePlat(selectedPlat.plat_id, platData);
      handleCloseEditModal();
    } catch (error) {
      setError(error.message || "Erreur lors de la mise à jour du plat");
      console.error("Erreur:", error);
    }
  };

  // Fonction pour supprimer un plat //
  const handleDeletePlat = async (platId) => {
    // Demander confirmation avant suppression
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce plat ? Cette action est irréversible."
      )
    ) {
      return;
    }
    try {
      setError(null);
      setSuccessMessage(null);
      await deletePlat(platId);
      setSuccessMessage("Le plat a été supprimé avec succès !");

      // Recharger les plats pour mettre à jour la liste
      await loadPlats();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError(error.message || "Erreur lors de la suppression du plat");
      console.error("Erreur:", error);
    }
  };

  // Fonction pour ouvrir la modal de création //
  const handleOpenCreateModal = () => {
    setCreateForm({
      titre_plat: "",
      photo: "",
      allergenes: [],
    });
    setShowCreateModal(true);
  };

  // Fonction pour fermer la modal de création //
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm({
      titre_plat: "",
      photo: "",
      allergenes: [],
    });
  };

  // Fonction pour créer un nouveau plat //
  const handleCreatePlat = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      // Validation : titre_plat est obligatoire
      if (!createForm.titre_plat.trim()) {
        setError("Le titre du plat est obligatoire");
        return;
      }

      // Préparer les données à envoyer
      const platData = {
        titre_plat: createForm.titre_plat.trim(),
        photo: createForm.photo.trim() || undefined,
        allergenes:
          createForm.allergenes.length > 0 ? createForm.allergenes : undefined,
      };

      await createPlat(platData);
      setSuccessMessage("Le plat a été créé avec succès !");

      // Recharger les plats
      await loadPlats();

      // Fermer la modal
      handleCloseCreateModal();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError(error.message || "Erreur lors de la création du plat");
      console.error("Erreur:", error);
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
          <h1 className={styles.title}>Gestion des Plats</h1>

          {loading && <p className={styles.loading}>Chargement...</p>}
          {error && <div className={styles.error}>Erreur : {error}</div>}
          {successMessage && (
            <div className={styles.success}>{successMessage}</div>
          )}

          {/* Section des plats */}
          <section className={styles.menusSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Plats ({plats.length})</h2>
              <button
                onClick={handleOpenCreateModal}
                className={`btn-primary ${styles.addButton}`}
              >
                + Ajouter un plat
              </button>
            </div>

            {plats.length === 0 ? (
              <p className={styles.emptyMessage}>
                Aucun plat disponible pour le moment
              </p>
            ) : (
              <div className={styles.menusGrid}>
                {plats.map((plat) => (
                  <div key={plat.plat_id} className={styles.platCard}>
                    {/* Image du plat */}
                    {plat.photo && (
                      <div className={styles.menuImage}>
                        <img
                          src={plat.photo}
                          alt={plat.titre_plat}
                          className={styles.image}
                        />
                      </div>
                    )}

                    {/* Informations du plat */}
                    <div className={styles.menuInfo}>
                      <h3 className={styles.menuTitle}>{plat.titre_plat}</h3>

                      {plat.allergenes && plat.allergenes.length > 0 && (
                        <div className={styles.menuDetails}>
                          <p>
                            <strong>Allergènes :</strong>{" "}
                            {Array.isArray(plat.allergenes)
                              ? plat.allergenes.join(", ")
                              : plat.allergenes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className={styles.menuActions}>
                      <button
                        onClick={() => handleOpenEditModal(plat)}
                        className={`btn-primary ${styles.editButton}`}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeletePlat(plat.plat_id)}
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
                <h2>Ajouter un nouveau plat</h2>

                <div className={styles.modalForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="create_titre_plat">Titre du plat * :</label>
                    <input
                      type="text"
                      id="create_titre_plat"
                      value={createForm.titre_plat}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          titre_plat: e.target.value,
                        })
                      }
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="create_photo">URL de la photo :</label>
                    <input
                      type="text"
                      id="create_photo"
                      value={createForm.photo}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, photo: e.target.value })
                      }
                      className={styles.formInput}
                    />
                  </div>

                  {createForm.photo && (
                    <div className={styles.formGroup}>
                      <label>Aperçu :</label>
                      <img
                        src={createForm.photo}
                        alt={createForm.titre_plat || "Aperçu"}
                        className={styles.imagePreview}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label htmlFor="create_allergenes">
                      Allergènes (séparés par des virgules) :
                    </label>
                    <input
                      type="text"
                      id="create_allergenes"
                      value={
                        Array.isArray(createForm.allergenes)
                          ? createForm.allergenes.join(", ")
                          : createForm.allergenes || ""
                      }
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          allergenes: e.target.value
                            .split(",")
                            .map((a) => a.trim())
                            .filter((a) => a !== ""),
                        })
                      }
                      placeholder="Ex: Gluten, Lactose, Arachides"
                      className={styles.formInput}
                    />
                    {Array.isArray(createForm.allergenes) &&
                      createForm.allergenes.length > 0 && (
                        <div className={styles.allergenesList}>
                          {createForm.allergenes.map((allergene, index) => (
                            <span key={index} className={styles.allergeneTag}>
                              {allergene}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    onClick={handleCloseCreateModal}
                    className="btn-outline"
                  >
                    Annuler
                  </button>
                  <button onClick={handleCreatePlat} className="btn-primary">
                    Créer le plat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal d'édition */}
          {showEditModal && selectedPlat && (
            <div className={styles.modalOverlay} onClick={handleCloseEditModal}>
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Modifier le plat : {selectedPlat.titre_plat}</h2>

                <div className={styles.modalForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="titre_plat">Titre du plat :</label>
                    <input
                      type="text"
                      id="titre_plat"
                      value={editForm.titre_plat}
                      onChange={(e) =>
                        setEditForm({ ...editForm, titre_plat: e.target.value })
                      }
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="photo">URL de la photo :</label>
                    <input
                      type="text"
                      id="photo"
                      value={editForm.photo}
                      onChange={(e) =>
                        setEditForm({ ...editForm, photo: e.target.value })
                      }
                      className={styles.formInput}
                    />
                  </div>

                  {editForm.photo && (
                    <div className={styles.formGroup}>
                      <label>Aperçu :</label>
                      <img
                        src={editForm.photo}
                        alt={editForm.titre_plat}
                        className={styles.imagePreview}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label htmlFor="allergenes">
                      Allergènes (séparés par des virgules) :
                    </label>
                    <input
                      type="text"
                      id="allergenes"
                      value={
                        Array.isArray(editForm.allergenes)
                          ? editForm.allergenes.join(", ")
                          : editForm.allergenes || ""
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          allergenes: e.target.value
                            .split(",")
                            .map((a) => a.trim())
                            .filter((a) => a !== ""),
                        })
                      }
                      placeholder="Ex: Gluten, Lactose, Arachides"
                      className={styles.formInput}
                    />
                    {Array.isArray(editForm.allergenes) &&
                      editForm.allergenes.length > 0 && (
                        <div className={styles.allergenesList}>
                          {editForm.allergenes.map((allergene, index) => (
                            <span key={index} className={styles.allergeneTag}>
                              {allergene}
                            </span>
                          ))}
                        </div>
                      )}
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

export default EmployePlatsPage;
