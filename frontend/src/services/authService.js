// Ce fichier contient les fonctions pour interagir avec l'API d'authentification depuis le backend//

// Récupère le token depuis localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Stocke le token dans localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Supprime le token de localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
};

/**
 * Fonction utilitaire pour faire des requêtes HTTP authentifiées
 * Encapsule la logique répétitive : récupération du token, ajout des headers,
 * gestion des erreurs et parsing JSON
 *
 * @param {string} url - L'URL de l'API
 * @param {object} options - Les options de fetch (method, body, headers, etc.)
 * @returns {Promise<any>} Les données parsées depuis la réponse JSON
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la requête");
  }

  return response.json();
};

// Fonction pour enregistrer un nouvel utilisateur //
export const register = async (userData) => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        password: userData.password,
        adresse_postals: userData.adresse_postals,
        telephone: userData.telephone,
        ville: userData.ville,
        pays: userData.pays,
      }),
    });

    // Parser la réponse JSON
    const data = await response.json();

    // Vérifier si la réponse est OK AVANT de retourner les données
    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'inscription");
    }

    // Retourne un token JWT et les informations de l'utilisateur //
    return data;
  } catch (error) {
    throw new Error(error.message || "Erreur lors de l'inscription");
  }
};

// Fonction pour se connecter à un compte utilisateur //
export const login = async (userData) => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    // Parser la réponse JSON
    const data = await response.json();

    // Vérifier si la réponse est OK AVANT de retourner les données
    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la connexion");
    }

    // Retourne un token JWT et les informations de l'utilisateur //
    return data;
  } catch (error) {
    throw new Error(error.message || "Erreur lors de la connexion");
  }
};

// Fonction pour déconnecter un utilisateur //
export const logout = async () => {
  try {
    const data = await authenticatedFetch(
      "http://localhost:3000/api/auth/logout",
      {
        method: "POST",
      }
    );

    // Supprimer le token du localStorage après déconnexion réussie
    removeToken();

    return data;
  } catch (error) {
    // Même en cas d'erreur, supprimer le token localement
    removeToken();
    throw new Error(error.message || "Erreur lors de la déconnexion");
  }
};

//Fonction pour demander une rénitialisation du mot-de-passe
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la renitialisation du mot de passe"
      );
    }
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Erreur lors de la demande de réinitialisation"
    );
  }
};

// Fonction pour rénitialiser le mot de passe //
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la réinitialisation du mot de passe"
      );
    }
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Erreur lors de la réinitialisation du mot de passe"
    );
  }
};
