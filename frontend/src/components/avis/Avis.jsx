// Ce fichier est le composant Avis.jsx qui va nous premettre d'afficher les avis des utilisateurs sur la page d'accueil
// depuis la base de donnée avec API api/avis
// Les imports necessaires //
import "../../index.css";
import styles from "./Avis.module.css";
import { useState, useEffect } from "react";
import { getPublicAvis } from "../../services/avisService.js";

// Création de la fonction Avis //
function Avis() {
  // les états //
  const [avis, setAvis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect récupération des données au chargement //
  useEffect(() => {
    const fetchAvis = async () => {
      try {
        setIsLoading(true);
        const data = await getPublicAvis();
        console.log("Avis reçus:", data); // Log pour déboguer
        console.log("Premier avis image:", data[0]?.image); // Log pour vérifier l'image
        setAvis(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des avis:", err);
        setError(err.message);
        setAvis([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvis();
  }, []);

  // Fonction pour afficher les étoiles //
  const renderStars = (note) => {
    const noteNum = parseInt(note);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={styles.star}>
          {i <= noteNum ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };
  return (
    <div className={styles.avis}>
      <div className={styles.container}>
        {/* Section titre - identique à HowItWorks */}
        <div className={styles.titleSection}>
          <h1 className={styles.mainTitle}>AVIS CLIENTS</h1>
          <div className={styles.separator}></div>
          <p className={styles.subtitle}>Ce que nos clients pensent</p>
          <div className={styles.separator}></div>
        </div>

        {/* Affichage conditionnel : Loading, Error, ou Avis */}
        {isLoading ? (
          <div className={styles.loading}>Chargement des avis...</div>
        ) : error ? (
          <div className={styles.error}>Erreur : {error}</div>
        ) : avis.length === 0 ? (
          <div className={styles.noAvis}>Aucun avis disponible</div>
        ) : (
          <div className={styles.avisGrid}>
            {avis.map((item, index) => {
              // Déterminer quelle image utiliser : user_image > image de test > placeholder
              let imageSrc = null;
              
              if (item.user_image) {
                // Priorité 1 : Photo de profil de l'utilisateur
                imageSrc = item.user_image;
              } else {
                // Priorité 2 : Image de test depuis /images/avis/person-X.jpg (cyclique)
                // Utiliser l'index modulo 8 pour avoir person-1.jpg à person-8.jpg
                const personNumber = (index % 8) + 1;
                imageSrc = `/images/avis/person-${personNumber}.jpg`;
              }

              return (
                <div key={item.avis_id} className={styles.avisCard}>
                  {/* Illustration/Image de profil */}
                  <div className={styles.avisIllustration}>
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={`Photo de profil de ${item.user_nom} ${item.user_prenom}`}
                        className={styles.avisImage}
                        onError={(e) => {
                          // Si l'image échoue, afficher le placeholder
                          e.target.style.display = "none";
                          e.target.onerror = null;
                          // Afficher le placeholder à la place
                          const placeholder = e.target.parentElement.querySelector(`.${styles.avisImagePlaceholder}`);
                          if (placeholder) {
                            placeholder.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    {/* Placeholder affiché si pas d'image ou si l'image a échoué */}
                    <div 
                      className={styles.avisImagePlaceholder}
                      style={{ display: imageSrc ? "none" : "flex" }}
                    >
                      <span className={styles.quoteIcon}>"</span>
                    </div>
                  </div>

                {/* Contenu */}
                <div className={styles.avisContent}>
                  <div className={styles.avisHeader}>
                    <h2 className={styles.avisTitle}>
                      {item.user_nom} {item.user_prenom}
                    </h2>
                    <div className={styles.avisStars}>
                      {renderStars(item.note)}
                    </div>
                  </div>
                  <div className={styles.avisSeparator}></div>
                  <p className={styles.avisDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Avis;
