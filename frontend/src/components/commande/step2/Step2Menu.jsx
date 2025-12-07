import { useState, useEffect } from "react"; 
import { getPublicMenus } from "../../../services/menusService.js";
import styles from "./Step2Menu.module.css"; 

/**
 * Composant pour l'étape 2 : Sélection du menu
 *
 * @param {Object} formData - Contient menu_id et menu
 * @param {Function} setFormData - Pour mettre à jour le menu sélectionné
 * @param {Function} onMenuSelect - Callback appelé quand un menu est sélectionné
 */

function Step2Menu ({ formData, setFormData, onMenuSelect}){

  const [menus , setMenus ] = useState([]); 
  const [isLoading, setIsLoading ] = useState(false); 


    // Sinon, charger la liste des menus disponibles
    useEffect(() => {
      // Si un menu est déjà sélectionné, ne rien faire
      if (formData.menu) {
        return;
      }
  
      // Sinon, charger la liste des menus disponibles
      const loadMenus = async () => {
        try {
          setIsLoading(true);
          const menusList = await getPublicMenus();
          setMenus(menusList);
        } catch (error) {
          console.error("Erreur lors du chargement des menus :", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      loadMenus();
    }, [formData.menu]); 

    // Si un menu est déjà selectionné on affiche ces détails // 
    if (formData.menu) {
      return (
        <div className={styles.menuSelected}>
          <h2 className={styles.stepTitle}>Étape 2 : Menu sélectionné</h2>
  
          <div className={styles.menuCard}>
            <h3 className={styles.menuTitle}>{formData.menu.titre}</h3>
  
            {formData.menu.galerie_images &&
              formData.menu.galerie_images.length > 0 && (
                <img
                  src={formData.menu.galerie_images[0]}
                  alt={formData.menu.titre}
                  className={styles.menuImage}
                />
              )}
  
            <p className={styles.menuDescription}>{formData.menu.description}</p>
  
            <div className={styles.menuInfo}>
              <p className={styles.menuPrice}>
                <strong>Prix :</strong> {formData.menu.prix_par_personne}
                €/personne
              </p>
              <p className={styles.menuMin}>
                <strong>Minimum :</strong> {formData.menu.nombre_personne_minimum}{" "}
                personne(s)
              </p>
              <p className={styles.menuTotal}>
                <strong>Prix minimum :</strong> {formData.menu.prix_total_minimum}€
              </p>
            </div>
  
            <button
              type="button"
              onClick={() => {
                // Permettre de changer de menu
                setFormData((prev) => ({
                  ...prev,
                  menu: null,
                  menu_id: null,
                }));
              }}
              className={styles.changeButton}
            >
              Changer de menu
            </button>
          </div>
        </div>
      );
    }
  
    // Si aucun menu n'est sélectionné, afficher la liste
    if (isLoading) {
      return (
        <div className={styles.loading}>
          <p>Chargement des menus...</p>
        </div>
      );
    }
    return (
      <div className={styles.stepContainer}>
        <h2 className={styles.stepTitle}>Étape 2 : Sélectionnez un menu</h2>
  
        <div className={styles.menusList}>
          {menus.length === 0 ? (
            <p className={styles.noMenus}>Aucun menu disponible</p>
          ) : (
            menus.map((menu) => (
              <div
                key={menu.menu_id}
                className={styles.menuCard}
                onClick={() => onMenuSelect(menu)} // Appelle la fonction callback
              >
                {menu.galerie_images && menu.galerie_images.length > 0 && (
                  <img
                    src={menu.galerie_images[0]}
                    alt={menu.titre}
                    className={styles.menuImage}
                  />
                )}
  
                <div className={styles.menuContent}>
                  <h3 className={styles.menuTitle}>{menu.titre}</h3>
                  <p className={styles.menuDescription}>{menu.description}</p>
  
                  <div className={styles.menuInfo}>
                    <span className={styles.menuPrice}>
                      {menu.prix_par_personne}€/personne
                    </span>
                    <span className={styles.menuMin}>
                      Min. {menu.nombre_personne_minimum} pers.
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  
export default Step2Menu;