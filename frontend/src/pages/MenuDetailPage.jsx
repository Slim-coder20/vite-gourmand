import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import styles from "../styles/menuDetail/menuDetailPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { getMenuById } from "../services/menusService";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function MenuDetailPage() {
  // Récupération de l'id du menu selectionné //
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Gestion des états pour le menu //
  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // fonction pour récupérer le menu par son id //
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenuById(id);
        setMenu(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="app-container">
        <Header />
        <main className="main-content">
          <div>Error: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="app-container">
        <Header />
        <main className="main-content">
          <div>Menu non trouvé</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fonction pour gérer le clic sur le bouton "Commander"
  const handleCommander = () => {
    if (isAuthenticated) {
      // Si authentifié, rediriger vers la page de commande avec l'ID du menu
      navigate(`/commande/${menu.menu_id}`);
    } else {
      // Si non authentifié, rediriger vers la page de connexion
      navigate("/login", { state: { from: `/menu/${menu.menu_id}` } });
    }
  };

  return (
    <div className="app-container">
      <Header />
      {/* Affichage des détails du menu */}
      <main className="main-content">
        <div className={styles.menuDetailContainer}>
          <h1>{menu.titre}</h1>

          {/* Image du menu */}
          {menu.galerie_images && menu.galerie_images.length > 0 && (
            <div className={styles.imageGallery}>
              <img
                src={menu.galerie_images[0]}
                alt={menu.titre}
                className={styles.menuImage}
                onError={(e) => {
                  // Si l'image ne charge pas, afficher une image par défaut
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
            </div>
          )}

          <p className={styles.description}>{menu.description}</p>

          <div className={styles.priceInfo}>
            <p className={styles.pricePerPerson}>
              {menu.prix_par_personne}€/personne
            </p>
            <p className={styles.minPrice}>
              Prix minimum : {menu.prix_total_minimum}€
            </p>
            <p className={styles.minPersons}>
              Minimum {menu.nombre_personne_minimum} personne(s)
            </p>
          </div>

          <p className={styles.quantity}>
            {menu.quantite_restante} disponible(s)
          </p>

          {/* Conditions mises en évidence */}
          {menu.conditions && (
            <div className={styles.conditionsBox}>
              <h3 className={styles.conditionsTitle}>
                ⚠️ Conditions importantes :
              </h3>
              <p className={styles.conditionsText}>{menu.conditions}</p>
            </div>
          )}

          {/* Régime et Thème */}
          <div className={styles.menuInfo}>
            {menu.regime && menu.regime.libelle && (
              <p className={styles.regime}>
                <strong>Régime :</strong> {menu.regime.libelle}
              </p>
            )}
            {menu.theme && menu.theme.libelle && (
              <p className={styles.theme}>
                <strong>Thème :</strong> {menu.theme.libelle}
              </p>
            )}
          </div>

          {/* Liste des plats avec leurs allergènes */}
          {menu.plats && menu.plats.length > 0 && (
            <div className={styles.platsSection}>
              <h2>Plats inclus :</h2>
              <ul className={styles.platsList}>
                {menu.plats.map((plat) => (
                  <li key={plat.plat_id} className={styles.platItem}>
                    <strong>{plat.titre_plat}</strong>
                    {plat.allergenes && plat.allergenes.length > 0 && (
                      <span className={styles.allergenes}>
                        {" "}
                        (Allergènes : {plat.allergenes.join(", ")})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className={styles.button} onClick={handleCommander}>
            Commander
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MenuDetailPage;
