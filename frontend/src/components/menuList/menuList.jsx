import { useState, useEffect, useMemo } from "react";
import styles from "./menuList.module.css";
import CardMenu from "../cardMenu/cardMenu";
import { getPublicMenus } from "../../services/menusService";

function MenuList() {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allMenus, setAllMenus] = useState([]); // Tous les menus pour extraire les options

  // États pour les filtres
  const [filters, setFilters] = useState({
    prix_max: "",
    prix_min: "",
    theme_id: "",
    regime_id: "",
    min_personnes: "",
  });

  // Charger tous les menus une fois au début pour extraire les options
  useEffect(() => {
    const fetchAllMenus = async () => {
      try {
        const data = await getPublicMenus({});
        if (Array.isArray(data)) {
          setAllMenus(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement initial des menus:", error);
      }
    };
    fetchAllMenus();
  }, []);

  // Charger les menus avec filtres
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Construire l'objet de filtres (enlever les valeurs vides)
        const activeFilters = {};
        if (filters.prix_max) activeFilters.prix_max = filters.prix_max;
        if (filters.prix_min) activeFilters.prix_min = filters.prix_min;
        if (filters.theme_id) activeFilters.theme_id = filters.theme_id;
        if (filters.regime_id) activeFilters.regime_id = filters.regime_id;
        if (filters.min_personnes)
          activeFilters.min_personnes = filters.min_personnes;

        // Utiliser le service pour récupérer les menus avec filtres
        const data = await getPublicMenus(activeFilters);

        // S'assurer que data est un tableau (validation de sécurité)
        if (Array.isArray(data)) {
          setMenus(data);
        } else {
          throw new Error("Les données reçues ne sont pas un tableau");
        }
      } catch (error) {
        setError(error.message);
        setMenus([]); // S'assurer que menus reste un tableau vide en cas d'erreur
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenus();
  }, [filters]);

  // Extraire les options uniques pour les thèmes et régimes depuis tous les menus
  const { themes, regimes } = useMemo(() => {
    const themesMap = new Map();
    const regimesMap = new Map();

    allMenus.forEach((menu) => {
      if (menu.theme && menu.theme.theme_id) {
        themesMap.set(menu.theme.theme_id, menu.theme.libelle);
      }
      if (menu.regime && menu.regime.regime_id) {
        regimesMap.set(menu.regime.regime_id, menu.regime.libelle);
      }
    });

    return {
      themes: Array.from(themesMap.entries())
        .map(([id, libelle]) => ({
          id: parseInt(id),
          libelle,
        }))
        .sort((a, b) => a.libelle.localeCompare(b.libelle)),
      regimes: Array.from(regimesMap.entries())
        .map(([id, libelle]) => ({
          id: parseInt(id),
          libelle,
        }))
        .sort((a, b) => a.libelle.localeCompare(b.libelle)),
    };
  }, [allMenus]);

  // Gestionnaire pour mettre à jour les filtres
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Réinitialiser tous les filtres
  const handleResetFilters = () => {
    setFilters({
      prix_max: "",
      prix_min: "",
      theme_id: "",
      regime_id: "",
      min_personnes: "",
    });
  };

  return (
    <>
      <div id="menus-section" className={styles.menuListContainer}>
        <div className={styles.menuListContent}>
          <h2 className={styles.menuListTitle}>Nos menus</h2>

          {/* Section des filtres */}
          <div className={styles.filtersContainer}>
            <h3 className={styles.filtersTitle}>Filtrer les menus</h3>
            <div className={styles.filtersGrid}>
              {/* Filtre Prix Minimum */}
              <div className={styles.filterGroup}>
                <label htmlFor="prix_min" className={styles.filterLabel}>
                  Prix minimum (€)
                </label>
                <input
                  type="number"
                  id="prix_min"
                  min="0"
                  step="0.01"
                  value={filters.prix_min}
                  onChange={(e) =>
                    handleFilterChange("prix_min", e.target.value)
                  }
                  className={styles.filterInput}
                  placeholder="0.00"
                />
              </div>

              {/* Filtre Prix Maximum */}
              <div className={styles.filterGroup}>
                <label htmlFor="prix_max" className={styles.filterLabel}>
                  Prix maximum (€)
                </label>
                <input
                  type="number"
                  id="prix_max"
                  min="0"
                  step="0.01"
                  value={filters.prix_max}
                  onChange={(e) =>
                    handleFilterChange("prix_max", e.target.value)
                  }
                  className={styles.filterInput}
                  placeholder="Aucun maximum"
                />
              </div>

              {/* Filtre Thème */}
              <div className={styles.filterGroup}>
                <label htmlFor="theme_id" className={styles.filterLabel}>
                  Thème
                </label>
                <select
                  id="theme_id"
                  value={filters.theme_id}
                  onChange={(e) =>
                    handleFilterChange("theme_id", e.target.value)
                  }
                  className={styles.filterSelect}
                >
                  <option value="">Tous les thèmes</option>
                  {themes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.libelle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre Régime */}
              <div className={styles.filterGroup}>
                <label htmlFor="regime_id" className={styles.filterLabel}>
                  Régime alimentaire
                </label>
                <select
                  id="regime_id"
                  value={filters.regime_id}
                  onChange={(e) =>
                    handleFilterChange("regime_id", e.target.value)
                  }
                  className={styles.filterSelect}
                >
                  <option value="">Tous les régimes</option>
                  {regimes.map((regime) => (
                    <option key={regime.id} value={regime.id}>
                      {regime.libelle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre Nombre de personnes minimum */}
              <div className={styles.filterGroup}>
                <label htmlFor="min_personnes" className={styles.filterLabel}>
                  Nombre de personnes minimum
                </label>
                <input
                  type="number"
                  id="min_personnes"
                  min="1"
                  value={filters.min_personnes}
                  onChange={(e) =>
                    handleFilterChange("min_personnes", e.target.value)
                  }
                  className={styles.filterInput}
                  placeholder="1"
                />
              </div>

              {/* Bouton Réinitialiser */}
              <div className={styles.filterGroup}>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={styles.resetButton}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Affichage des résultats */}
          {isLoading ? (
            <div className={styles.loadingMessage}>Chargement...</div>
          ) : error ? (
            <div className={styles.errorMessage}>Erreur : {error}</div>
          ) : menus.length === 0 ? (
            <div className={styles.noResultsMessage}>
              Aucun menu ne correspond à vos critères de recherche.
            </div>
          ) : (
            <div className={styles.menuList}>
              {menus.map((menu) => (
                <CardMenu key={menu.menu_id} menu={menu} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MenuList;
