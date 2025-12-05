/**
 * Page Équipe - Présentation statique des membres de l'équipe
 */

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import styles from "../styles/team/Team.module.css";

function Team() {
  // Données statiques de l'équipe
  const teamMembers = [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      role: "Chef Cuisinier",
      description:
        "Passionné de gastronomie française avec plus de 15 ans d'expérience.",
      image: "/images/team/chef-1.jpg",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Sophie",
      role: "Sous-Chef",
      description:
        "Spécialiste des plats végétariens et de la cuisine créative.",
      image: "/images/team/chef-2.jpg",
    },
    {
      id: 3,
      nom: "Bernard",
      prenom: "Pierre",
      role: "Pâtissier",
      description:
        "Maître dans l'art de la pâtisserie française traditionnelle.",
      image: "/images/team/chef-3.jpg",
    },
    {
      id: 4,
      nom: "Dubois",
      prenom: "Marie",
      role: "Chef de Partie",
      description: "Expert en cuisine méditerranéenne et plats du marché.",
      image: "/images/team/chef-4.jpg",
    },
  ];

  return (
    <>
      <Header />
      <div className={styles.team}>
        <div className={styles.container}>
          {/* Section titre */}
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>NOTRE ÉQUIPE</h1>
            <div className={styles.separator}></div>
            <p className={styles.subtitle}>Nos chefs</p>
            <div className={styles.separator}></div>
          </div>

          {/* Grille des membres de l'équipe */}
          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <div key={member.id} className={styles.teamCard}>
                {/* Photo de profil */}
                <div className={styles.teamIllustration}>
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={`Photo de ${member.prenom} ${member.nom}`}
                      className={styles.teamImage}
                      onError={(e) => {
                        // Si l'image échoue, afficher le placeholder
                        e.target.style.display = "none";
                        e.target.nextElementSibling?.classList.remove(
                          styles.hidden
                        );
                      }}
                    />
                  ) : null}
                  <div
                    className={`${styles.teamImagePlaceholder} ${
                      member.image ? styles.hidden : ""
                    }`}
                  >
                    <span className={styles.quoteIcon}>👨‍🍳</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className={styles.teamContent}>
                  <div className={styles.teamHeader}>
                    <h2 className={styles.teamTitle}>
                      {member.prenom} {member.nom}
                    </h2>
                  </div>
                  <div className={styles.teamRole}>{member.role}</div>
                  <div className={styles.teamSeparator}></div>
                  <p className={styles.teamDescription}>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Team;
