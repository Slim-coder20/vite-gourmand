import { useState, useEffect } from "react";
import styles from "./menuList.module.css";
import CardMenu from "../cardMenu/cardMenu";

function MenuList() {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/menus");
        if (!response.ok) {
          throw new Error(
            `Erreur HTTP: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        // S'assurer que data est un tableau
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
