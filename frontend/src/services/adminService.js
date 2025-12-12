// Service pour les routes API admin
import { authenticatedFetch } from "./authService.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Dashboard admin
export const getAdminDashboard = async () => {
  return authenticatedFetch(`${API_URL}/admin/dashboard`);
};

// Statistiques commandes par menu (MongoDB)
export const getStatistiquesCommandesParMenu = async () => {
  return authenticatedFetch(`${API_URL}/admin/statistiques/commandes-par-menu`);
};

// Chiffre d'affaires avec filtres
export const getChiffreAffaires = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.menu_id) queryParams.append("menu_id", filters.menu_id);
  if (filters.date_debut) queryParams.append("date_debut", filters.date_debut);
  if (filters.date_fin) queryParams.append("date_fin", filters.date_fin);

  const url = `${API_URL}/admin/statistiques/chiffre-affaires${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  return authenticatedFetch(url);
};

// Liste des employés
export const getEmployes = async () => {
  return authenticatedFetch(`${API_URL}/admin/employes`);
};

// Créer un compte employé
export const createEmploye = async (employeData) => {
  return authenticatedFetch(`${API_URL}/admin/employes`, {
    method: "POST",
    body: JSON.stringify(employeData),
  });
};

// Désactiver un compte employé
export const desactiverEmploye = async (employeId) => {
  return authenticatedFetch(
    `${API_URL}/admin/employes/${employeId}/desactiver`,
    {
      method: "PUT",
    }
  );
};
