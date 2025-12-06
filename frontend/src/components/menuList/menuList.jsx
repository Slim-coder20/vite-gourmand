import { useState, useEffect } from "react";
import styles from "./menuList.module.css";
import CardMenu from "../cardMenu/cardMenu";
import { getPublicMenus } from "../../services/menusService";

function MenuList() {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        // Utiliser le service pour récupérer les menus
        const data = await getPublicMenus();

        // S'assurer que data est un tableau (validation de sécurité)
        if (Array.isArray(data)) {
          setMenus(data);
        } else {
          throw new Error("Les données reçues ne sont pas un tableau");
        }
      } catch (error) {
        setError(error.message);
        setMenus([]); // S'assurer que menus reste un tableau vide en cas d'erreur
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenus();
  }, []);
  return (
    <>
      {/* Afficher un message de chargement si les données sont en cours de chargement */}
      {/* Afficher un message d'erreur si une erreur survient */}
      {/* Afficher la liste des menus */}
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className={styles.menuListContainer}>
          <div className={styles.menuListContent}>
            <h2 className={styles.menuListTitle}>Nos menus</h2>
            <div className={styles.menuList}>
              {menus.map((menu) => (
                <CardMenu key={menu.menu_id} menu={menu} />
              ))}
            </div>
           
          </div>
        </div>
      )}
    </>
  );
}

export default MenuList;
