import { getToken } from "./authService.js";

/**
 * Service pour gérer les apppels API liés au dashboard de l'utilisateur 
 * Récupérer les informations de l'utilisateur connecté 
 * Récupérer les commandes de l'utilisateur connecté 
 * Modifier les infromations de l'utilisateur connecté 
 * Annulation de commande : tant que la commande n'est pas passé par l'employé en statut "Accepté "
 * La modification de la commande sauf le choix du menu 
 * Accèes au suivis de sa commande : le suivis émunère tous les états de la commande suivi de la date et l'huere de modification 
 * quand le statut passe a terminer le client est notifé par mail qu’il peut se connecter à son compte pour donner son avis depuis la commande.
Il doit pouvoir donner entre note entre 1 et 5, suivi d’un commentaire.
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Récupérer les informations de l'utilisateur connecté
 */
export const getUserDashboard = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/dashboard/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors de la récupération des informations du dashboard"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message ||
        "Erreur lors de la récupération des informations du dashboard"
    );
  }
};

/**
 * Récupérer les commandes de l'utilisateur connecté
 */

export const getUserCommands = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/commandes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des commandes"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Erreur lors de la récupération des commandes"
    );
  }
};

/**
 * Modifier les informations du dashboard de l'utilisateur connecté
 */
export const updateUserDashboard = async (userData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/dashboard/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors de la modification des informations du dashboard"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message ||
        "Erreur lors de la modification des informations du dashboard"
    );
  }
};

/**
 * Récupérer l'historique des statuts d'une commande
 */
export const getCommandHistory = async (commandeId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/commandes/${commandeId}/history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors de la récupération de l'historique des commandes"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message ||
        "Erreur lors de la récupération de l'historique des commandes"
    );
  }
};

/**
 * Modifier une commande (si le statut est "en attente")
 * La modification de la commande sauf le choix du menu
 */
export const updateCommand = async (commandeId, commandeData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/commandes/${commandeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commandeData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la modification de la commande"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Erreur lors de la modification de la commande"
    );
  }
};

/**
 * Annuler une commande (si le statut est "en attente")
 * Annulation possible tant qu'un employé n'a pas passé la commande en "accepté"
 */
export const cancelCommand = async (commandeId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/commandes/${commandeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de l'annulation de la commande"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Erreur lors de l'annulation de la commande"
    );
  }
};
