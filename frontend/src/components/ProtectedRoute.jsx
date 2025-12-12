import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Composant pour protéger les routes nécessitant une authentification
 * @param {Object} props
 * @param {React.ReactElement} props.children - Le composant à afficher si autorisé
 * @param {number|number[]} props.requiredRoleId - Le role_id requis ou un tableau de role_id (optionnel). Si non spécifié, seule l'authentification est requise
 * @returns {React.ReactElement|null}
 */
function ProtectedRoute({ children, requiredRoleId = null }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Fonction pour vérifier si le rôle de l'utilisateur est autorisé
  const isRoleAuthorized = (userRoleId) => {
    if (requiredRoleId === null) {
      return true; // Pas de restriction de rôle
    }

    // Si c'est un tableau de rôles
    if (Array.isArray(requiredRoleId)) {
      return requiredRoleId.includes(userRoleId);
    }

    // Si c'est un seul rôle
    return userRoleId === requiredRoleId;
  };

  useEffect(() => {
    // Ne pas rediriger pendant le chargement
    if (isLoading) {
      return;
    }

    // Si non authentifié, rediriger vers login
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // Si un rôle spécifique est requis
    if (requiredRoleId !== null && user) {
      if (!isRoleAuthorized(user.role_id)) {
        // Si ce n'est pas le bon rôle, rediriger vers la page d'accueil
        navigate("/");
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRoleId, navigate]);

  // Pendant le chargement, ne rien afficher
  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Chargement...</p>
      </div>
    );
  }

  // Si non authentifié ou rôle incorrect, ne rien afficher (la redirection est gérée par useEffect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Vérifier le rôle si requis
  if (requiredRoleId !== null && !isRoleAuthorized(user.role_id)) {
    return null;
  }

  // Afficher le contenu protégé
  return children;
}

export default ProtectedRoute;
