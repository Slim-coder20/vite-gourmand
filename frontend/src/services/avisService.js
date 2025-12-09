import { getToken } from "./authService.js";

// Ce fichier contient les fonctions popur intéragir avec lAPI des avis deouis le frontend //

// Fonction pour récupérer tous les avis publics //
export const getPublicAvis = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/avis/public", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération des avis"
      );
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Erreur lors de la récupération des avis");
  }
};

// Fonction pour ajouter un avis depuis une commande //
export const createAvisfromCommande = async (
  commandeId,
  { note, description }
) => {
  try {
    const token = getToken();
    const response = await fetch(
      `http://localhost:3000/api/avis/commande/${commandeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note, description }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la création de l'avis"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Erreur lors de la création de l'avis");
  }
};
