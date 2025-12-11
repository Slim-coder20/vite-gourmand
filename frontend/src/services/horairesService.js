// Fonction publique pour récupérer les horaires (sans authentification)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getPublicHoraires = async () => {
  try {
    const response = await fetch(`${API_URL}/horaires`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des horaires"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Erreur lors de la récupération des horaires"
    );
  }
};
