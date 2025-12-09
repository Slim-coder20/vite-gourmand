/**
 * Service pour gérer les appels API lié aux commandes
 */

import { getToken } from "./authService.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
/**
 * Récupérer une commande spécifique par son ID
 */
export const getCommandById = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/commandes/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération de la commande"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Erreur lors de la récupération de la commande"
    );
  }
};

/**
 * Créer une nouvelle commande POST /commandes
 */
export const createCommand = async (commandData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/commandes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commandData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la création de la commande"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Erreur lors de la création de la commande"
    );
  }
};
