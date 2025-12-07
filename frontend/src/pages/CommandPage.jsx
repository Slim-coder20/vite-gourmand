import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import styles from "../styles/command/commandPage.module.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createCommand } from "../services/commandService";
import { getMenuById } from "../services/menusService";
import Step1Informations from "../components/commande/step1/Step1Informations";
import Step2Menu from "../components/commande/step2/Step2Menu";
import Step3Recap from "../components/commande/step3/Step3Recap";

function CommandPage() {
  // Gestion des états pour la commande //
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Toutes les données du formulaire //
    // Étape 1 //
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse_prestation: "",
    date_prestation: "",
    heure_livraison: "",
    lieu_livraison: "",

    // Etape 2 //
    menu_id: null,
    menu: null,

    // Etape 3 //
    nombre_personne: null,
    // Calculs //
    prix_menu: 0,
    prix_livraison: 0,
    prix_total: 0,
    reduction_appliquee: false,
  });

  // Les états de chargement et les erreurs //
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({
    step1: null,
    step2: null,
    step3: null,
  });

  // Les Hooks nécessaires //
  const { menu_id: menuIdFromUrl } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();


  // useEffect 1 : Vérification authentification et pré-remplissage
 
  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated || !user) {
      navigate("/login", {
        state: {
          from: `/commande${menuIdFromUrl ? `/${menuIdFromUrl}` : ""}`,
        },
      });
      return;
    }

    // Pré-remplir les données utilisateur
    setFormData((prev) => ({
      ...prev,
      nom: user.nom || "",
      prenom: user.prenom || "",
      email: user.email || "",
      telephone: user.telephone || "",
      adresse_prestation: user.adresse_postals || "", // Adresse par défaut
    }));
  }, [isAuthenticated, user, navigate, menuIdFromUrl]);

  // ============================================
  // useEffect 2 : Charger le menu si ID dans l'URL
  // ============================================
  useEffect(() => {
    const loadMenu = async () => {
      if (menuIdFromUrl) {
        try {
          setIsLoading(true);
          const menu = await getMenuById(menuIdFromUrl);
          setFormData((prev) => ({
            ...prev,
            menu_id: menu.menu_id,
            menu: menu,
            // Initialiser le nombre de personnes au minimum
            nombre_personne: menu.nombre_personne_minimum,
          }));
          // Passer automatiquement à l'étape 3 si le menu est pré-sélectionné
          setCurrentStep(3);
          // Recalculer les prix après chargement du menu
          if (menu && menu.nombre_personne_minimum) {
            calculateAllPrices(menu.nombre_personne_minimum);
          }
        } catch (error) {
          setError("Menu introuvable");
          console.error("Erreur lors du chargement du menu :", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isAuthenticated && user) {
      loadMenu();
    }
  }, [menuIdFromUrl, isAuthenticated, user]);

  // ============================================
  // FONCTIONS DE CALCUL DES PRIX
  // ============================================

  /**
   * Calcule le prix du menu avec application de la réduction si applicable
   */
  const calculatePrixMenu = (nombrePersonnes, menu) => {
    if (!menu || !nombrePersonnes || !menu.prix_par_personne) {
      return { prixMenu: 0, reductionAppliquee: false };
    }

    let prixMenu = menu.prix_par_personne * nombrePersonnes;
    let reductionAppliquee = false;

    // Vérifier si la réduction de 10% s'applique
    if (nombrePersonnes >= menu.nombre_personne_minimum + 5) {
      prixMenu = prixMenu * 0.9; // Réduction de 10%
      reductionAppliquee = true;
    }

    return { prixMenu, reductionAppliquee };
  };

  /**
   * Calcule le prix de livraison selon l'adresse
   */
  const calculatePrixLivraison = (adressePrestation, user) => {
    if (!adressePrestation || !user) {
      return 0;
    }

    // Vérifier si livraison hors Bordeaux
    const isHorsBordeaux =
      user.ville !== "Bordeaux" || adressePrestation !== user.adresse_postals;

    if (isHorsBordeaux) {
      return 5.0; // 5€ de base si hors Bordeaux
    }

    return 0; // Livraison gratuite à Bordeaux
  };

  /**
   * Calcule tous les prix et met à jour formData
   */
  const calculateAllPrices = (nombrePersonnes = null) => {
    const nombre = nombrePersonnes || formData.nombre_personne;
    const { menu, adresse_prestation } = formData;

    // Vérifier que les données nécessaires sont présentes
    if (!menu || !nombre) {
      return;
    }

    // Calcul prix menu
    const { prixMenu, reductionAppliquee } = calculatePrixMenu(nombre, menu);

    // Calcul prix livraison
    const prixLivraison = calculatePrixLivraison(adresse_prestation, user);

    // Calcul total
    const prixTotal = prixMenu + prixLivraison;

    // Mettre à jour formData avec les nouveaux prix
    setFormData((prev) => ({
      ...prev,
      nombre_personne: nombre,
      prix_menu: prixMenu,
      prix_livraison: prixLivraison,
      prix_total: prixTotal,
      reduction_appliquee: reductionAppliquee,
    }));
  };

  // ============================================
  // FONCTION : nextStep() - Passer à l'étape suivante
  // ============================================
  const nextStep = () => {
    // Réinitialiser les erreurs
    setErrors({
      step1: null,
      step2: null,
      step3: null,
    });

    // VALIDATION DE L'ÉTAPE 1 : Informations de prestation
    if (currentStep === 1) {
      // Vérifier que tous les champs requis sont remplis
      if (
        !formData.nom ||
        !formData.prenom ||
        !formData.email ||
        !formData.telephone ||
        !formData.adresse_prestation ||
        !formData.date_prestation ||
        !formData.heure_livraison
      ) {
        setErrors((prev) => ({
          ...prev,
          step1: "Veuillez remplir tous les champs obligatoires",
        }));
        return; // ⚠️ Bloquer la navigation si validation échoue
      }

      // Vérifier que la date de prestation est dans le futur
      const datePrestation = new Date(formData.date_prestation);
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0); // Remettre l'heure à 00:00:00

      if (datePrestation <= aujourdhui) {
        setErrors((prev) => ({
          ...prev,
          step1: "La date de prestation doit être dans le futur",
        }));
        return; // Bloquer si la date est invalide
      }

      // Recalculer les prix si l'adresse a changé
      if (formData.menu && formData.nombre_personne) {
        calculateAllPrices();
      }
    }

    // VALIDATION DE L'ÉTAPE 2 : Sélection du menu
    if (currentStep === 2) {
      // Vérifier qu'un menu a été sélectionné
      if (!formData.menu_id || !formData.menu) {
        setErrors((prev) => ({
          ...prev,
          step2: "Veuillez sélectionner un menu",
        }));
        return; // Bloquer si aucun menu n'est sélectionné
      }

      // Initialiser le nombre de personnes au minimum si pas encore défini
      if (!formData.nombre_personne && formData.menu.nombre_personne_minimum) {
        setFormData((prev) => ({
          ...prev,
          nombre_personne: formData.menu.nombre_personne_minimum,
        }));
        // Recalculer les prix
        calculateAllPrices(formData.menu.nombre_personne_minimum);
      }
    }

    // VALIDATION DE L'ÉTAPE 3 : Nombre de personnes
    if (currentStep === 3) {
      // Vérifier que le nombre de personnes est renseigné
      if (!formData.nombre_personne) {
        setErrors((prev) => ({
          ...prev,
          step3: "Veuillez indiquer le nombre de personnes",
        }));
        return;
      }

      // Vérifier que le nombre de personnes respecte le minimum du menu
      if (formData.nombre_personne < formData.menu.nombre_personne_minimum) {
        setErrors((prev) => ({
          ...prev,
          step3: `Le nombre minimum de personnes est ${formData.menu.nombre_personne_minimum}`,
        }));
        return; // Bloquer si le minimum n'est pas respecté
      }
    }

    // Si toutes les validations sont passées, passer à l'étape suivante
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // ============================================
  // FONCTION : prevStep() - Revenir à l'étape précédente
  // ============================================
  const prevStep = () => {
    // Réinitialiser les erreurs quand on revient en arrière
    setErrors({
      step1: null,
      step2: null,
      step3: null,
    });

    // Vérifier qu'on n'est pas déjà à la première étape
    if (currentStep > 1) {
      // Revenir à l'étape précédente
      setCurrentStep(currentStep - 1);
    }
  };

  // ============================================
  // FONCTION : handleSubmit() - Soumettre la commande
  // ============================================
  const handleSubmit = async () => {
    // Réinitialiser les erreurs
    setError(null);
    setErrors({
      step1: null,
      step2: null,
      step3: null,
    });

    // VALIDATION FINALE AVANT SOUMISSION
    // Vérifier étape 1
    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.email ||
      !formData.telephone ||
      !formData.adresse_prestation ||
      !formData.date_prestation ||
      !formData.heure_livraison
    ) {
      setError("Veuillez remplir tous les champs obligatoires de l'étape 1");
      setCurrentStep(1); // Retourner à l'étape 1
      return;
    }

    // Vérifier étape 2
    if (!formData.menu_id || !formData.menu) {
      setError("Veuillez sélectionner un menu");
      setCurrentStep(2); // Retourner à l'étape 2
      return;
    }

    // Vérifier étape 3
    if (!formData.nombre_personne) {
      setError("Veuillez indiquer le nombre de personnes");
      setCurrentStep(3); // Rester à l'étape 3
      return;
    }

    if (formData.nombre_personne < formData.menu.nombre_personne_minimum) {
      setError(
        `Le nombre minimum de personnes est ${formData.menu.nombre_personne_minimum}`
      );
      setCurrentStep(3);
      return;
    }

    // Si toutes les validations sont passées, soumettre la commande
    setIsLoading(true);

    try {
      // Préparer les données pour le backend
      const commandData = {
        menu_id: formData.menu_id,
        date_prestation: formData.date_prestation, // Format: "YYYY-MM-DD"
        heure_livraison: formData.heure_livraison, // Format: "HH:MM"
        nombre_personne: formData.nombre_personne,
        adresse_prestation: formData.adresse_prestation,
        pret_materiel: false, // À modifier si vous ajoutez cette option
        restitution_materiel: false, // À modifier si vous ajoutez cette option
      };

      // Appeler le service pour créer la commande
      const response = await createCommand(commandData);

      // Succès : rediriger vers la page d'accueil avec message
      navigate("/", {
        state: {
          message: "Commande créée avec succès !",
          commande: response.commande,
        },
      });
    } catch (error) {
      // Gérer les erreurs
      setError(error.message || "Erreur lors de la création de la commande");
      console.error("Erreur lors de la création de la commande :", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // Gestion du callback pour la sélection de menu
  // ============================================
  const handleMenuSelect = (menu) => {
    setFormData((prev) => ({
      ...prev,
      menu_id: menu.menu_id,
      menu: menu,
      // Initialiser le nombre de personnes au minimum
      nombre_personne: menu.nombre_personne_minimum,
    }));
    // Passer à l'étape 3
    setCurrentStep(3);
    // Recalculer les prix
    calculateAllPrices(menu.nombre_personne_minimum);
  };

  // ============================================
  // RENDU JSX
  // ============================================
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className={styles.commandeContainer}>
          {/* Indicateur de progression */}
          <div className={styles.progressIndicator}>
            <div
              className={`${styles.step} ${
                currentStep >= 1 ? styles.active : ""
              }`}
            >
              <span>1</span>
              <label>Informations</label>
            </div>
            <div
              className={`${styles.step} ${
                currentStep >= 2 ? styles.active : ""
              }`}
            >
              <span>2</span>
              <label>Menu</label>
            </div>
            <div
              className={`${styles.step} ${
                currentStep >= 3 ? styles.active : ""
              }`}
            >
              <span>3</span>
              <label>Récapitulatif</label>
            </div>
          </div>

          {/* Affichage conditionnel selon l'étape */}
          {currentStep === 1 && (
            <Step1Informations
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              user={user}
            />
          )}

          {currentStep === 2 && (
            <Step2Menu
              formData={formData}
              setFormData={setFormData}
              onMenuSelect={handleMenuSelect}
            />
          )}

          {currentStep === 3 && (
            <Step3Recap
              formData={formData}
              setFormData={setFormData}
              onCalculatePrice={calculateAllPrices}
              errors={errors}
            />
          )}

          {/* Boutons de navigation */}
          <div className={styles.navigationButtons}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className={styles.buttonPrev}
              >
                ← Précédent
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className={styles.buttonNext}
              >
                Suivant →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={styles.buttonSubmit}
              >
                {isLoading ? "Traitement..." : "Valider la commande"}
              </button>
            )}
          </div>

          {/* Affichage des erreurs globales */}
          {error && (
            <div className={styles.errorGlobal}>
              <strong>⚠️ Erreur :</strong> {error}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CommandPage;
