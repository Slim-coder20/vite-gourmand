import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEmployes,
  createEmploye,
  desactiverEmploye
} from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";
import AdminHeader from "../../components/header/AdminHeader";
import styles from "../../styles/admin/AdminEmployesPage.module.css"; 

function AdminEmployesPage () {
// Hooks //
  const navigate = useNavigate(); 
  const { user, isAuthenticated } = useAuth(); 

// les états // 
  const [employes, setEmployes ] = useState([]); 
  const [loading, setLoading ] = useState(false); 
  const [successMessage, setSuccessMessage ] = useState(null);  
  const [error, setError ] = useState(null); 
  const [selectedEmploye, setSelectedEmploye ] = useState(null); 
  const [showEditModal, setShowEditModal ] = useState(false); 
  const [showDesactivateModal, setShowDesactivateModal ] = useState(false); 
  const [showCreateModal, setShowCreateModal ] = useState(false); 
  const [createForm, setCreateForm ] = useState({
    email:"",
    password:"",
    
  }); 
 
// Vérifier l'authentification et le rôle au chargement
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

// Vérifier que l'utilisateur est bien un admin (role_id === 2)
    if (user?.role_id !== 2) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate]);

// Chargement des données //
  useEffect(() => {
    if (isAuthenticated && user?.role_id === 2) {
      loadEmployes();
    }
  }, [isAuthenticated, user]);

  // Charger la liste des employes pour le select
  const loadEmployes = async () => {
    try {
      const response = await getEmployes();
      if (response && Array.isArray(response)) {
        setEmployes(response);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des employes :", err);
    }
  };

// foction pour créer un employé // 
handleCreateEmploye = async (email, password) => {
  try {
    setError(null);
    setSuccessMessage(null); 
    if (!email || !password ) {
      setError("Veuilez remplir tous les champs requis");
    }
    const response = await createEmploye(email, password);
    if(response && response.data) {
      setSuccessMessage("Employé créé avec succès");
      setCreateForm({
        email:"",
        password:"",
      });
      await loadEmployes();
    } else {
      setError("Erreur lors de la création de l'employé");
    }
  } catch (error) {
    setError(error.message || "Erreur lors de la création de l'employé");
    console.error("Erreur:", error);
  } finally {
    setLoading(false);
  }
  setTimeout(() => {
    setSuccessMessage(null);
  }, 3000);

  // fonction pour ouvrir le modal de création // 
  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setCreateForm({
      email:"",
      password:"",
    });
  };

  // fonction pour fermer le modal de création // 
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm({
      email:"",
      password:"",
    });
  };

  // fonction pour soumettre le formulaire de création // 
  const handleSubmitCreate = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
    }
    if (!createForm.email || !createForm.password) {
      setError("Veuilez remplir tous les champs requis");
      return;
    }
    await handleCreateEmploye(createForm.email, createForm.password);
    handleCloseCreateModal();
  } catch (error) {
    setError(error.message || "Erreur lors de la création de l'employé");
  }
  setTimeout(() => {
    setSuccessMessage(null);
  }, 3000);

  // fonction pour ouvrir le modal de désactivation // 
  const handleOpenDesactivateModal = (employe) => {
    setSelectedEmploye(employe);
    setShowDesactivateModal(true);
  };
  
  // fonction pour fermer le modal de désactivation // 
  const handleCloseDesactivateModal = () => {
    setShowDesactivateModal(false);
    setSelectedEmploye(null);
  };

  // fonction pour soumettre le formulaire de désactivation // 
  const handleSubmitDesactivate = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      if (!selectedEmploye) {
        setError("Veuilez sélectionner un employé");
        return;
      }
      await handleDesactivateEmploye(selectedEmploye._id);
      handleCloseDesactivateModal();
    } catch (error) {
      setError(error.message || "Erreur lors de la désactivation de l'employé");
      console.error("Erreur:", error);
    }
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };  
}

  return(
      <div className={styles.adminEmployesPage}>
          <AdminHeader />
          <main className={styles.container}>
            <div className={styles.content}>
              <h1 className={styles.title}>Gestion des Employés</h1>
            </div>
          </main>
          <Footer />
      </div>
  ); 








}

export default AdminEmployesPage; 
