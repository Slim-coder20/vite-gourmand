import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import styles from "../styles/dashboard/dashboardPage.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getUserDashboard,
  getUserCommands,
  updateUserDashboard,
  getCommandHistory,
  updateCommand,
  cancelCommand,
} from "../services/dashboardUserService";
import EditCommandForm from "../components/dashboard/EditCommandForm";

function DashboardPage() {
  const [userDashboard, setUserDashboard] = useState(null);
  const [userCommands, setUserCommands] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [selectedCommandId, setSelectedCommandId] = useState(null);
  const [editingCommandId, setEditingCommandId] = useState(null);
  const [commandToCancelId, setCommandToCancelId] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // useEffect 1 : Vérification authentification //
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // useEffect 2 : Pour charger les informations du user connecté //
  useEffect(() => {
    if (!isAuthenticated) return; // Ne pas charger si non authentifié

    const loadUserDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserDashboard();
        setUserDashboard(data.user);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserDashboard();
  }, [isAuthenticated]);

  // useEffect 3 : Pour charger les commandes de l'utilisateur connecté //
  useEffect(() => {
    if (!isAuthenticated) return; // Ne pas charger si non authentifié

    const loadUserCommands = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserCommands();
        // La route retourne directement un tableau
        setUserCommands(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserCommands();
  }, [isAuthenticated]);

  // useEffect 4 : Pour charger l'historique des statuts d'une commande //
  useEffect(() => {
    if (!selectedCommandId) {
      setCommandHistory([]);
      return;
    }

    const loadCommandHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCommandHistory(selectedCommandId);
        // La route retourne directement un tableau, pas un objet avec "history"
        setCommandHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
        setCommandHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCommandHistory();
  }, [selectedCommandId]);

  // Fonctions pour les actions utilisateur  //

  // Fonction pour modifier les informations utilisateur
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!userDashboard) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      const data = await updateUserDashboard(userDashboard);
      setUserDashboard(data.user);
      setSuccessMessage("Vos informations ont été modifiées avec succès !");
      // Faire disparaître le message après 5 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      setError(error.message);
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour modifier une commande
  const handleUpdateCommand = async (commandeId, commandeData) => {
    try {
      setIsLoading(true);
      setError(null);
      await updateCommand(commandeId, commandeData);
      // Recharger les commandes après modification
      const commandsData = await getUserCommands();
      setUserCommands(Array.isArray(commandsData) ? commandsData : []);
      setEditingCommandId(null); // Fermer le formulaire d'édition
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour annuler une commande (depuis formulaire)
  const handleCancelCommandSubmit = async (e) => {
    e.preventDefault();
    if (!commandToCancelId) {
      setError("Veuillez entrer un ID de commande");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await cancelCommand(parseInt(commandToCancelId));
      // Recharger les commandes après annulation
      const commandsData = await getUserCommands();
      setUserCommands(Array.isArray(commandsData) ? commandsData : []);
      setCommandToCancelId(""); // Réinitialiser le champ
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour annuler une commande directement (depuis la liste)
  const handleCancelCommandDirect = async (commandeId) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir annuler la commande #${commandeId} ?`
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await cancelCommand(commandeId);
      // Recharger les commandes après annulation
      const commandsData = await getUserCommands();
      setUserCommands(Array.isArray(commandsData) ? commandsData : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Si non authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Trouver la commande à éditer
  const commandToEdit = editingCommandId
    ? userCommands.find((cmd) => cmd.commande_id === editingCommandId)
    : null;

  return (
    <div className={styles.dashboardPage}>
      <Header />
      <main className={styles.dashboardContainer}>
        <h1>
          Bienvenue {userDashboard?.prenom || user?.prenom || ""}{" "}
          {userDashboard?.nom || user?.nom || ""} dans votre espace client
        </h1>
        {isLoading && <p>Chargement...</p>}
        {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
        {/* Le contenu du dashboard sera ajouté ici */}
        <div className={styles.dashboardContent}>
          <h2>Mes commandes</h2>
          {userCommands.length === 0 ? (
            <p>Aucune commande pour le moment</p>
          ) : (
            <ul>
              {userCommands.map((command) => (
                <li key={command.commande_id}>
                  <strong>Commande #{command.commande_id}</strong> -{" "}
                  {command.menu_titre || "Menu"} - Statut: {command.statut} -{" "}
                  Date: {new Date(command.date_commande).toLocaleDateString()}
                  {command.statut === "en attente" && (
                    <>
                      <button
                        onClick={() => setEditingCommandId(command.commande_id)}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() =>
                          handleCancelCommandDirect(command.commande_id)
                        }
                      >
                        Annuler
                      </button>
                    </>
                  )}
                  {(command.statut === "accepté" ||
                    command.statut === "en préparation" ||
                    command.statut === "terminée") && (
                    <button
                      onClick={() => setSelectedCommandId(command.commande_id)}
                    >
                      Voir le suivi
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedCommandId && (
          <div className={styles.dashboardContent}>
            <h2>Historique des statuts de commande #{selectedCommandId}</h2>
            {commandHistory.length === 0 ? (
              <p>Aucun historique disponible</p>
            ) : (
              <ul>
                {commandHistory.map((status) => (
                  <li key={status.history_id}>
                    {status.ancien_statut || "Création"} →{" "}
                    {status.nouveau_statut} -{" "}
                    {new Date(status.date_modification).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setSelectedCommandId(null)}>Fermer</button>
          </div>
        )}
        <div className={styles.dashboardContent}>
          <h2>Modifier mes informations</h2>
          {successMessage && (
            <p className={styles.successMessage}>✓ {successMessage}</p>
          )}
          <form onSubmit={handleUpdateUser}>
            <div>
              <label htmlFor="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={userDashboard?.prenom || ""}
                onChange={(e) =>
                  setUserDashboard(
                    userDashboard
                      ? { ...userDashboard, prenom: e.target.value }
                      : { prenom: e.target.value }
                  )
                }
              />
            </div>
            <div>
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={userDashboard?.nom || ""}
                onChange={(e) =>
                  setUserDashboard(
                    userDashboard
                      ? { ...userDashboard, nom: e.target.value }
                      : { nom: e.target.value }
                  )
                }
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userDashboard?.email || ""}
                onChange={(e) =>
                  setUserDashboard(
                    userDashboard
                      ? { ...userDashboard, email: e.target.value }
                      : { email: e.target.value }
                  )
                }
              />
            </div>
            <div>
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={userDashboard?.telephone || ""}
                onChange={(e) =>
                  setUserDashboard(
                    userDashboard
                      ? { ...userDashboard, telephone: e.target.value }
                      : { telephone: e.target.value }
                  )
                }
              />
            </div>
            <div>
              <label htmlFor="adresse_postals">Adresse postale</label>
              <input
                type="text"
                id="adresse_postals"
                name="adresse_postals"
                value={userDashboard?.adresse_postals || ""}
                onChange={(e) =>
                  setUserDashboard(
                    userDashboard
                      ? { ...userDashboard, adresse_postals: e.target.value }
                      : { adresse_postals: e.target.value }
                  )
                }
              />
            </div>
            <div>
              <label htmlFor="ville">Ville</label>
              <input
                type="text"
                id="ville"
                name="ville"
                value={userDashboard?.ville || ""}
                onChange={(e) =>
                  setUserDashboard(
                    userDashboard
                      ? { ...userDashboard, ville: e.target.value }
                      : { ville: e.target.value }
                  )
                }
              />
            </div>
            <div>
              <label htmlFor="pays">Pays</label>
              <input
                type="text"
                id="pays"
                name="pays"
                value={userDashboard?.pays || ""}
                onChange={(e) =>
                  setUserDashboard(
                    userDashboard
                      ? { ...userDashboard, pays: e.target.value }
                      : { pays: e.target.value }
                  )
                }
              />
            </div>
            <button type="submit">Modifier</button>
          </form>
          {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
          {isLoading && <p>Modification en cours...</p>}
        </div>
        {editingCommandId && commandToEdit && (
          <EditCommandForm
            commandeId={editingCommandId}
            commandeData={commandToEdit}
            onSubmit={handleUpdateCommand}
            onCancel={() => setEditingCommandId(null)}
            isLoading={isLoading}
            error={error}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default DashboardPage;
