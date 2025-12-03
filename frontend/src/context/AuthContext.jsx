import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService.js";
// Création du context de l'authentification //
const AuthContext = createContext();

// Création du provider de l'authentification //
export const AuthProvider = ({ children }) => {
  // Déclaration des States //
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour enregistrer un nouvel utilisateur //
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Appel du service authService.register //
      const response = await authService.register(userData);

      // Stocker le token dans le localStorage //
      authService.setToken(response.token);

      // Mettre à jour l'état //
      setUser(response.user);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      // Gérer l'erreur //
      setError(error.message);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour connecter un utilisateur //
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      // Appel du service authService.login avec un objet { email, password }
      const response = await authService.login({ email, password });

      // Stocker le token dans localStorage
      authService.setToken(response.token);
      // Mettre à jour l'état //
      setUser(response.user);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      setError(error.message);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour déconnecter un utilisateur //
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Appel du service authService.logout()
      // Le service gère déjà la suppression du token dans localStorage
      await authService.logout();

      // Nettoyer l'état local
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      setError(error.message);
      setUser(null);
      setIsAuthenticated(false);
      authService.removeToken(); // S'assurer que le token est supprimé
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour vérifier le Token dans le localStorage //
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      // Récupérer le token depuis localStorage
      const token = authService.getToken();
      if (!token) {
        // Pas de token = pas connecté
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }
      setIsAuthenticated(true);
    } catch {
      // En cas d'erreur, nettoyer
      authService.removeToken();
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier l'authentification au chargement de l'application
  useEffect(() => {
    checkAuth();
  }, []); // Tableau vide = s'exécute une seule fois au montage

  // Valeur à exposer via le contexte (ÉTAPE 9 du guide)
  const value = {
    // États
    user,
    isAuthenticated,
    isLoading,
    error,
    // Fonctions
    register,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export du contexte lui-même// 
export default AuthContext;
