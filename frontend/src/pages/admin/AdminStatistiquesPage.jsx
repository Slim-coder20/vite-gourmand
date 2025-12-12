import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStatistiquesCommandesParMenu,
  getChiffreAffaires,
} from "../../services/adminService";
import { getPublicMenus } from "../../services/menusService";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";
import AdminHeader from "../../components/header/AdminHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "../../styles/admin/AdminStatistiquesPage.module.css";

function AdminStatistiquesPage() {
  // Hooks //
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Les états //
  const [commandesParMenu, setCommandesParMenu] = useState([]);
  const [chiffreAffairesTotal, setChiffreAffairesTotal] = useState({
    resultats: [],
    total_general: 0,
  });
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    menu_id: "",
    date_debut: "",
    date_fin: "",
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

  // Chargement des données //
  useEffect(() => {
    if (isAuthenticated && user?.role_id === 2) {
      loadMenus();
      loadCommandesParMenu();
      loadChiffreAffaires();
    }
  }, [isAuthenticated, user]);

  // Charger la liste des menus pour le select
  const loadMenus = async () => {
    try {
      const response = await getPublicMenus();
      if (response && Array.isArray(response)) {
        setMenus(response);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des menus :", err);
    }
  };

  // Chrger les commandes par menu //
  const loadCommandesParMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      // Appel API getStatistiquesCommandesParMenu
      const response = await getStatistiquesCommandesParMenu();

      if (response && response.data) {
        setCommandesParMenu(response.data);
      } else {
        setError("Format de données invalide");
      }
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des données");
      console.error("Erreur lors du chargement des commandes par menu  :", err);
    } finally {
      setLoading(false);
    }
  };

  // Charger le chiffre d'affaires avec filtres optionnels
  const loadChiffreAffaires = async (filtersToApply = filters) => {
    try {
      setLoading(true);
      setError(null);

      // Préparer les filtres pour l'API (enlever les valeurs vides)
      const cleanFilters = {};
      if (filtersToApply.menu_id) {
        cleanFilters.menu_id = filtersToApply.menu_id;
      }
      if (filtersToApply.date_debut) {
        cleanFilters.date_debut = filtersToApply.date_debut;
      }
      if (filtersToApply.date_fin) {
        cleanFilters.date_fin = filtersToApply.date_fin;
      }

      const response = await getChiffreAffaires(cleanFilters);

      if (response && response.data) {
        setChiffreAffairesTotal(response.data);
      } else {
        setError("Format de données invalide pour le chiffre d'affaires");
      }
    } catch (err) {
      setError(
        err.message || "Erreur lors du chargement du chiffre d'affaires"
      );
      console.error("Erreur lors du chargement du chiffre d'affaires :", err);
    } finally {
      setLoading(false);
    }
  };

  // Gérer le changement des filtres
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Appliquer les filtres
  const handleApplyFilters = (e) => {
    e.preventDefault();
    loadChiffreAffaires(filters);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    const emptyFilters = {
      menu_id: "",
      date_debut: "",
      date_fin: "",
    };
    setFilters(emptyFilters);
    loadChiffreAffaires(emptyFilters);
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
          <h1 className={styles.title}>Statistiques</h1>

          {loading && <p className={styles.loading}>Chargement...</p>}
          {error && <div className={styles.error}>Erreur : {error}</div>}

          {/* Section Filtres */}
          <section className={styles.filtersSection}>
            <h2 className={styles.sectionTitle}>Filtres</h2>
            <form onSubmit={handleApplyFilters} className={styles.filterForm}>
              <div className={styles.filterGroup}>
                <label htmlFor="menu_id">Menu (optionnel)</label>
                <select
                  id="menu_id"
                  value={filters.menu_id}
                  onChange={(e) =>
                    handleFilterChange("menu_id", e.target.value)
                  }
                  className={styles.filterInput}
                >
                  <option value="">Tous les menus</option>
                  {menus.map((menu) => (
                    <option key={menu.menu_id} value={menu.menu_id}>
                      {menu.titre}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="date_debut">Date de début (optionnel)</label>
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

              <div className={styles.filterGroup}>
                <label htmlFor="date_fin">Date de fin (optionnel)</label>
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

              <div className={styles.filterButtons}>
                <button type="submit" className="btn-primary">
                  Appliquer les filtres
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn-outline"
                >
                  Réinitialiser
                </button>
              </div>
            </form>
          </section>

          {/* Graphique 1 : Commandes par menu */}
          <section className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>
              Nombre de commandes par menu
            </h2>
            {commandesParMenu.length === 0 ? (
              <p className={styles.emptyMessage}>
                Aucune donnée disponible pour les commandes
              </p>
            ) : (
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={commandesParMenu}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="menu_titre"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="total_commandes"
                      fill="#c41e3a"
                      name="Nombre de commandes"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Graphique 2 : Chiffre d'affaires par menu */}
          <section className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>Chiffre d'affaires par menu</h2>
            {!chiffreAffairesTotal ||
            !chiffreAffairesTotal.resultats ||
            chiffreAffairesTotal.resultats.length === 0 ? (
              <p className={styles.emptyMessage}>
                Aucune donnée disponible pour le chiffre d'affaires
              </p>
            ) : (
              <>
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chiffreAffairesTotal.resultats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="menu_titre"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          `${parseFloat(value).toFixed(2)}€`
                        }
                      />
                      <Legend />
                      <Bar
                        dataKey="total_chiffre_affaires"
                        fill="#f5a623"
                        name="Chiffre d'affaires (€)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className={styles.totalContainer}>
                  <p className={styles.totalLabel}>Total général :</p>
                  <p className={styles.totalValue}>
                    {parseFloat(
                      chiffreAffairesTotal.total_general || 0
                    ).toFixed(2)}
                    €
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminStatistiquesPage;
