import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEmployes,
  createEmploye,
  desactiverEmploye,
} from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";
import AdminHeader from "../../components/header/AdminHeader";
import styles from "../../styles/admin/AdminEmployesPage.module.css";

function AdminEmployesPage() {
  // Hooks
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Les états
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [showDesactivateModal, setShowDesactivateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
  });

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

  // Chargement des données
  useEffect(() => {
    if (isAuthenticated && user?.role_id === 2) {
      loadEmployes();
    }
  }, [isAuthenticated, user]);

  // Charger la liste des employes
  const loadEmployes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmployes();
      if (response && response.data && Array.isArray(response.data)) {
        setEmployes(response.data);
      } else if (response && Array.isArray(response)) {
        setEmployes(response);
      }
    } catch (err) {
      setError("Erreur lors du chargement des employés");
      console.error("Erreur lors du chargement des employes :", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer un employé
  const handleCreateEmploye = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      if (!email || !password) {
        setError("Veuillez remplir tous les champs requis");
        return;
      }

      const response = await createEmploye({ email, password });

      if (response && response.data) {
        setSuccessMessage("Employé créé avec succès");
        setCreateForm({
          email: "",
          password: "",
        });
        await loadEmployes();
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError("Erreur lors de la création de l'employé");
      }
    } catch (error) {
      setError(error.message || "Erreur lors de la création de l'employé");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour désactiver un employé
  const handleDesactivateEmploye = async (employeId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await desactiverEmploye(employeId);

      if (response && response.data) {
        setSuccessMessage("Employé désactivé avec succès");
        await loadEmployes();
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError("Erreur lors de la désactivation de l'employé");
      }
    } catch (error) {
      setError(error.message || "Erreur lors de la désactivation de l'employé");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ouvrir le modal de création
  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setCreateForm({
      email: "",
      password: "",
    });
    setError(null);
  };

  // Fonction pour fermer le modal de création
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm({
      email: "",
      password: "",
    });
    setError(null);
  };

  // Fonction pour soumettre le formulaire de création
  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    try {
      if (!createForm.email || !createForm.password) {
        setError("Veuillez remplir tous les champs requis");
        return;
      }
      await handleCreateEmploye(createForm.email, createForm.password);
      handleCloseCreateModal();
    } catch (error) {
      setError(error.message || "Erreur lors de la création de l'employé");
    }
  };

  // Fonction pour ouvrir le modal de désactivation
  const handleOpenDesactivateModal = (employe) => {
    setSelectedEmploye(employe);
    setShowDesactivateModal(true);
    setError(null);
  };

  // Fonction pour fermer le modal de désactivation
  const handleCloseDesactivateModal = () => {
    setShowDesactivateModal(false);
    setSelectedEmploye(null);
    setError(null);
  };

  // Fonction pour soumettre le formulaire de désactivation
  const handleSubmitDesactivate = async () => {
    try {
      if (!selectedEmploye) {
        setError("Veuillez sélectionner un employé");
        return;
      }
      await handleDesactivateEmploye(selectedEmploye.user_id);
      handleCloseDesactivateModal();
    } catch (error) {
      setError(error.message || "Erreur lors de la désactivation de l'employé");
      console.error("Erreur:", error);
    }
  };

  // Vérifications de sécurité avant le rendu
  if (!isAuthenticated || user?.role_id !== 2) {
    return null;
  }

  return (
    <div className={styles.adminEmployesPage}>
      <AdminHeader />
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Gestion des Employés</h1>

          {/* Messages de succès et d'erreur */}
          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Bouton pour créer un employé */}
          <button
            onClick={handleOpenCreateModal}
            className={styles.createButton}
          >
            + Créer un employé
          </button>

          {/* Liste des employés */}
          {loading ? (
            <p className={styles.loading}>Chargement...</p>
          ) : (
            <div className={styles.employesList}>
              {employes.length === 0 ? (
                <p className={styles.emptyMessage}>Aucun employé trouvé</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Téléphone</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employes.map((employe) => (
                      <tr key={employe.user_id}>
                        <td>{employe.email}</td>
                        <td>{employe.nom || "-"}</td>
                        <td>{employe.prenom || "-"}</td>
                        <td>{employe.telephone || "-"}</td>
                        <td>
                          <span
                            className={
                              employe.actif
                                ? styles.statusActive
                                : styles.statusInactive
                            }
                          >
                            {employe.actif ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td>
                          {employe.actif && (
                            <button
                              onClick={() =>
                                handleOpenDesactivateModal(employe)
                              }
                              className={styles.desactivateButton}
                            >
                              Désactiver
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

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
                <h2>Créer un employé</h2>
                <form onSubmit={handleSubmitCreate}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      value={createForm.email}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">Mot de passe *</label>
                    <input
                      type="password"
                      id="password"
                      value={createForm.password}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          password: e.target.value,
                        })
                      }
                      required
                      minLength={10}
                    />
                  </div>
                  <div className={styles.modalButtons}>
                    <button type="submit" className={styles.submitButton}>
                      Créer
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseCreateModal}
                      className={styles.cancelButton}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de désactivation */}
          {showDesactivateModal && selectedEmploye && (
            <div
              className={styles.modalOverlay}
              onClick={handleCloseDesactivateModal}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Désactiver un employé</h2>
                <p>
                  Êtes-vous sûr de vouloir désactiver l'employé{" "}
                  <strong>{selectedEmploye.email}</strong> ?
                </p>
                <div className={styles.modalButtons}>
                  <button
                    onClick={handleSubmitDesactivate}
                    className={styles.submitButton}
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={handleCloseDesactivateModal}
                    className={styles.cancelButton}
                  >
                    Annuler
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

export default AdminEmployesPage;
