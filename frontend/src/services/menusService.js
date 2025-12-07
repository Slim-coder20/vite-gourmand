/**
 * Service pour gérer les appels API liés au menus
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Fonction pour récupérer tous les menus avec filtres optionnels (public sans authentification)
export const getPublicMenus = async (filters = {}) => {
  try {
    // Construire les paramètres de requête depuis l'objet filters
    const queryParams = new URLSearchParams();

    if (filters.prix_max) {
      queryParams.append("prix_max", filters.prix_max);
    }
    if (filters.prix_min) {
      queryParams.append("prix_min", filters.prix_min);
    }
    if (filters.theme_id) {
      queryParams.append("theme_id", filters.theme_id);
    }
    if (filters.regime_id) {
      queryParams.append("regime_id", filters.regime_id);
    }
    if (filters.min_personnes) {
      queryParams.append("min_personnes", filters.min_personnes);
    }

    // Construire l'URL avec les paramètres de requête
    const url = `${API_URL}/menus${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des menus"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Erreur lors de la récupération des menus"
    );
  }
};

// Fonction pour récupérer un menu par son ID (public sans authentification )
export const getMenuById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/menus/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération du menu"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Erreur lors de la récupération du menu");
  }
};
