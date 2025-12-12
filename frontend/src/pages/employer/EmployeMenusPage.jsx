import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EmployeeHeader from "../../components/header/EmployeeHeader";
import AdminHeader from "../../components/header/AdminHeader";
import Footer from "../../components/footer/Footer";
import {
  getMenus,
  updateMenu,
  deleteMenu,
} from "../../services/employeService";
import styles from "../../styles/employe/EmployeMenusPage.module.css";

function EmployeMenusPage() {
  // Hooks //
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // États pour les données
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // État pour le menu en cours d'édition
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    titre: "",
    description: "",
    nombre_personne_minimum: "",
    prix_par_personne: "",
    quantite_restante: "",
  });

  // Vérification de l'authentification et du rôle au chargement
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

  // Charger les menus au montage
  useEffect(() => {
    if (isAuthenticated && (user?.role_id === 3 || user?.role_id === 2)) {
      loadMenus();
    }
  }, [isAuthenticated, user]);

  // Fonction pour charger les menus
  const loadMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const data = await getMenus(); // getMenus() ne prend pas de paramètres
      setMenus(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des menus");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour un menu
  const handleUpdateMenu = async (menuId, menuData) => {
    try {
      setError(null);
      setSuccessMessage(null);

      await updateMenu(menuId, menuData); // Utilise updateMenu importé
      setSuccessMessage("Le menu a été modifié avec succès !");

      // Recharger les menus
      await loadMenus();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du menu");
      console.error("Erreur:", err);
    }
  };

  // Fonction pour ouvrir le modal d'édition
  const handleOpenEditModal = (menu) => {
    setSelectedMenu(menu);
    setEditForm({
      titre: menu.titre || "",
      description: menu.description || "",
      nombre_personne_minimum: menu.nombre_personne_minimum || "",
      prix_par_personne: menu.prix_par_personne || "",
      quantite_restante: menu.quantite_restante || "",
    });
    setShowEditModal(true);
  };

  // Fonction pour fermer le modal d'édition
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMenu(null);
    setEditForm({
      titre: "",
      description: "",
      nombre_personne_minimum: "",
      prix_par_personne: "",
      quantite_restante: "",
    });
  };

  // Fonction pour mettre à jour un menu (appelée depuis le modal)
  const handleSubmitUpdate = async () => {
    if (!selectedMenu) return;

    try {
      setError(null);
      setSuccessMessage(null);

      // Préparer les données à envoyer (seulement les champs modifiés)
      const menuData = {};
      if (editForm.titre) menuData.titre = editForm.titre;
      if (editForm.description) menuData.description = editForm.description;
      if (editForm.nombre_personne_minimum)
        menuData.nombre_personne_minimum = parseInt(
          editForm.nombre_personne_minimum
        );
      if (editForm.prix_par_personne)
        menuData.prix_par_personne = parseFloat(editForm.prix_par_personne);
      if (editForm.quantite_restante)
        menuData.quantite_restante = parseInt(editForm.quantite_restante);

      await handleUpdateMenu(selectedMenu.menu_id, menuData);
      handleCloseEditModal();
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du menu");
      console.error("Erreur:", err);
    }
  };

  // Fonction pour supprimer un menu
  const handleDeleteMenu = async (menuId) => {
    // Demander confirmation avant suppression
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce menu ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);

      await deleteMenu(menuId); // Utilise deleteMenu importé depuis employeService
      setSuccessMessage("Le menu a été supprimé avec succès !");

      // Recharger les menus pour mettre à jour la liste
      await loadMenus();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression du menu");
      console.error("Erreur:", err);
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
          <h1 className={styles.title}>Gestion des Menus</h1>

          {loading && <p className={styles.loading}>Chargement...</p>}
          {error && <div className={styles.error}>Erreur : {error}</div>}
          {successMessage && (
            <div className={styles.success}>{successMessage}</div>
          )}

          {/* Section des menus */}
          <section className={styles.menusSection}>
            <h2 className={styles.sectionTitle}>Menus ({menus.length})</h2>

            {menus.length === 0 ? (
              <p className={styles.emptyMessage}>
                Aucun menu disponible pour le moment
              </p>
            ) : (
              <div className={styles.menusGrid}>
                {menus.map((menu) => (
                  <div key={menu.menu_id} className={styles.menuCard}>
                    {/* Image du menu */}
                    {menu.image_principale && (
                      <div className={styles.menuImage}>
                        <img
                          src={menu.image_principale}
                          alt={menu.titre}
                          className={styles.image}
                        />
                      </div>
                    )}

                    {/* Informations du menu */}
                    <div className={styles.menuInfo}>
                      <h3 className={styles.menuTitle}>{menu.titre}</h3>

                      {menu.description && (
                        <p className={styles.menuDescription}>
                          {menu.description}
                        </p>
                      )}

                      <div className={styles.menuDetails}>
                        <p>
                          <strong>Prix par personne :</strong>{" "}
                          {menu.prix_par_personne}€
                        </p>
                        {menu.nombre_personne_minimum && (
                          <p>
                            <strong>Nombre de personnes minimum :</strong>{" "}
                            {menu.nombre_personne_minimum}
                          </p>
                        )}
                        {menu.prix_total_minimum && (
                          <p>
                            <strong>Prix total minimum :</strong>{" "}
                            {menu.prix_total_minimum.toFixed(2)}€
                          </p>
                        )}
                        {menu.quantite_restante !== undefined && (
                          <p>
                            <strong>Quantité restante :</strong>{" "}
                            {menu.quantite_restante}
                          </p>
                        )}
                        {menu.regime && (
                          <p>
                            <strong>Régime :</strong> {menu.regime.libelle}
                          </p>
                        )}
                        {menu.theme && (
                          <p>
                            <strong>Thème :</strong> {menu.theme.libelle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={styles.menuActions}>
                      <button
                        onClick={() => handleOpenEditModal(menu)}
                        className={`btn-primary ${styles.editButton}`}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(menu.menu_id)}
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

          {/* Modal d'édition */}
          {showEditModal && selectedMenu && (
            <div className={styles.modalOverlay} onClick={handleCloseEditModal}>
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Modifier le menu : {selectedMenu.titre}</h2>

                <div className={styles.modalForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="titre">Titre :</label>
                    <input
                      type="text"
                      id="titre"
                      value={editForm.titre}
                      onChange={(e) =>
                        setEditForm({ ...editForm, titre: e.target.value })
                      }
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="description">Description :</label>
                    <textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className={styles.formTextarea}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="prix_par_personne">
                        Prix par personne (€) :
                      </label>
                      <input
                        type="number"
                        id="prix_par_personne"
                        value={editForm.prix_par_personne}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            prix_par_personne: e.target.value,
                          })
                        }
                        step="0.01"
                        min="0"
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="nombre_personne_minimum">
                        Nombre de personnes minimum :
                      </label>
                      <input
                        type="number"
                        id="nombre_personne_minimum"
                        value={editForm.nombre_personne_minimum}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            nombre_personne_minimum: e.target.value,
                          })
                        }
                        min="1"
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="quantite_restante">
                      Quantité restante :
                    </label>
                    <input
                      type="number"
                      id="quantite_restante"
                      value={editForm.quantite_restante}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          quantite_restante: e.target.value,
                        })
                      }
                      min="0"
                      className={styles.formInput}
                    />
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

export default EmployeMenusPage;
