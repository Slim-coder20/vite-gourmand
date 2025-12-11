/**
 * Ce Fichier gère la communication avec les routes API Back pour l'employe
 * Dashboard
 * Gestion des commandes
 * Gestions des avis
 * Gestion des menus
 */
import { authenticatedFetch } from "./authService.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

//===Gestion des menus ====//
export const getMenus = async () => {
  return authenticatedFetch(`${API_URL}/menus`);
};

export const updateMenu = async (menuId, data) => {
  return authenticatedFetch(`${API_URL}/menus/${menuId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteMenu = async (menuId) => {
  return authenticatedFetch(`${API_URL}/menus/${menuId}`, {
    method: "DELETE",
  });
};

// ===== GESTION DES PLATS =====
export const getPlats = async () => {
  return authenticatedFetch(`${API_URL}/plats`);
};

export const getPlat = async (platId) => {
  return authenticatedFetch(`${API_URL}/plats/${platId}`);
};

export const updatePlat = async (platId, data) => {
  return authenticatedFetch(`${API_URL}/plats/${platId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deletePlat = async (platId) => {
  return authenticatedFetch(`${API_URL}/plats/${platId}`, {
    method: "DELETE",
  });
};

// ===== GESTION DES HORAIRES =====
export const getHoraires = async () => {
  return authenticatedFetch(`${API_URL}/horaires`);
};

export const createHoraire = async (horaireData) => {
  return authenticatedFetch(`${API_URL}/horaires`, {
    method: "POST",
    body: JSON.stringify(horaireData),
  });
};

export const updateHoraire = async (horaireId, data) => {
  return authenticatedFetch(`${API_URL}/horaires/${horaireId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteHoraire = async (horaireId) => {
  return authenticatedFetch(`${API_URL}/horaires/${horaireId}`, {
    method: "DELETE",
  });
};

// ===== GESTION DES COMMANDES =====
export const getCommandesEmploye = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.statut) queryParams.append("statut", filters.statut);
  if (filters.user_id) queryParams.append("user_id", filters.user_id);
  if (filters.date_debut) queryParams.append("date_debut", filters.date_debut);
  if (filters.date_fin) queryParams.append("date_fin", filters.date_fin);

  const url = `${API_URL}/employe/commandes${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  return authenticatedFetch(url);
};

export const updateCommandeStatut = async (commandeId, statut) => {
  return authenticatedFetch(
    `${API_URL}/employe/commandes/${commandeId}/statut`,
    {
      method: "PUT",
      body: JSON.stringify({ statut }),
    }
  );
};

export const annulerCommandeEmploye = async (
  commandeId,
  motifAnnulation,
  modeContact
) => {
  return authenticatedFetch(`${API_URL}/employe/commandes/${commandeId}`, {
    method: "DELETE",
    body: JSON.stringify({
      motif_annulation: motifAnnulation,
      mode_contact: modeContact,
    }),
  });
};

// ===== GESTION DES AVIS =====
export const getAvisEmploye = async (statut = null) => {
  const queryParams = new URLSearchParams();
  if (statut) queryParams.append("statut", statut);

  const url = `${API_URL}/employe/avis${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  return authenticatedFetch(url);
};

export const validerAvis = async (avisId) => {
  return authenticatedFetch(`${API_URL}/employe/avis/${avisId}/valider`, {
    method: "PUT",
  });
};

export const refuserAvis = async (avisId) => {
  return authenticatedFetch(`${API_URL}/employe/avis/${avisId}/refuser`, {
    method: "PUT",
  });
};
