import "../../index.css";
import styles from "./cardMenu.module.css";
import { useNavigate } from "react-router-dom";

function CardMenu({ menu }) {
  // Hook pour la navigation
  const navigate = useNavigate();

  // Fonction pour gérer le clic sur le bouton "En savoir plus"
  const handleClick = () => {
    // Rediriger vers la page de détail du menu avec son ID
    navigate(`/menu/${menu.menu_id}`);
  };

  return (
    <div className={styles.cardMenu}>
      {menu.image_principale && (
        <img
          src={menu.image_principale}
          alt={menu.titre}
          className={styles.cardImage}
          onError={(e) => {
            // Si l'image ne charge pas, afficher une image par défaut
            e.target.src = "/images/placeholder.jpg";
          }}
        />
      )}
      <div className={styles.cardContent}>
        <h2>{menu.titre}</h2>
        <p className={styles.price}>{menu.prix_par_personne}€/personne</p>
        {menu.description && (
          <p className={styles.description}>{menu.description}</p>
        )}
        <button className={styles.buttonCardMenu} onClick={handleClick}>
          En Savoir plus
        </button>
      </div>
    </div>
  );
}

export default CardMenu;
