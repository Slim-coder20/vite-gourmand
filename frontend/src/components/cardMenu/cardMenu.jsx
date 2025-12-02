import "../../index.css";
import styles from "./cardMenu.module.css";

function CardMenu({ menu }) {
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
      </div>
    </div>
  );
}

export default CardMenu;
