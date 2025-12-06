/**
 * Service pour gérer les appels API liés au menus
 */

// Fonction pour récupérer tous les menus (public sans authentification )
export const getPublicMenus = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/menus", {
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
