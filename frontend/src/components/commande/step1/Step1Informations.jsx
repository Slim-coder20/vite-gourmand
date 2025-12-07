import styles from "./Step1Informations.module.css"; 



/**
 * Composant pour l'étape 1 : Informations de prestation
 *
 * @param {Object} formData - Toutes les données du formulaire
 * @param {Function} setFormData - Fonction pour mettre à jour formData
 * @param {Object} errors - Objet contenant les erreurs de validation
 * @param {Object} user - Informations de l'utilisateur connecté (pour pré-remplissage)
 */

function Step1Informations({ formData, setFormData, errors, user }) {
// Cette foncction est appelé lorsque un utilisateur modifie un champs dans le formulaire //

  const handleChange = (e) => {
    const { name, value } = e.target; 
    // Mise a jour du formData en gardant les autres valeurs intactes // 
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Met à jour uniquement le champ modifié
    }));
  }

return (
  <div className={styles.stepContainer}>
    <h2 className={styles.stepTitle}>Étape 1 : Informations de prestation</h2>

    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Vos informations</h3>

      {/* Champ Nom */}
      <div className={styles.formGroup}>
        <label htmlFor="nom" className={styles.label}>
          Nom <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className={styles.input}
          placeholder="Votre nom"
          required
        />
      </div>

      {/* Champ Prénom */}
      <div className={styles.formGroup}>
        <label htmlFor="prenom" className={styles.label}>
          Prénom <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="prenom"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          className={styles.input}
          placeholder="Votre prénom"
          required
        />
      </div>

      {/* Champ Email */}
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="votre.email@exemple.com"
          required
        />
      </div>

      {/* Champ Téléphone */}
      <div className={styles.formGroup}>
        <label htmlFor="telephone" className={styles.label}>
          Téléphone <span className={styles.required}>*</span>
        </label>
        <input
          type="tel"
          id="telephone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          className={styles.input}
          placeholder="06 12 34 56 78"
          required
        />
      </div>
    </div>

    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Détails de la prestation</h3>

      {/* Champ Adresse de prestation */}
      <div className={styles.formGroup}>
        <label htmlFor="adresse_prestation" className={styles.label}>
          Adresse de prestation <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="adresse_prestation"
          name="adresse_prestation"
          value={formData.adresse_prestation}
          onChange={handleChange}
          className={styles.input}
          placeholder="123 Rue de la Paix, 33000 Bordeaux"
          required
        />
        <p className={styles.helpText}>
          Adresse où la livraison doit être effectuée
        </p>
      </div>

      {/* Champ Date de prestation */}
      <div className={styles.formGroup}>
        <label htmlFor="date_prestation" className={styles.label}>
          Date de prestation <span className={styles.required}>*</span>
        </label>
        <input
          type="date"
          id="date_prestation"
          name="date_prestation"
          value={formData.date_prestation}
          onChange={handleChange}
          className={styles.input}
          min={new Date().toISOString().split("T")[0]} // Date minimum = aujourd'hui
          required
        />
        <p className={styles.helpText}>La date doit être dans le futur</p>
      </div>

      {/* Champ Heure de livraison */}
      <div className={styles.formGroup}>
        <label htmlFor="heure_livraison" className={styles.label}>
          Heure de livraison souhaitée{" "}
          <span className={styles.required}>*</span>
        </label>
        <input
          type="time"
          id="heure_livraison"
          name="heure_livraison"
          value={formData.heure_livraison}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <p className={styles.helpText}>
          Heure à laquelle vous souhaitez recevoir la commande
        </p>
      </div>

      {/* Champ Lieu de livraison (optionnel) */}
      <div className={styles.formGroup}>
        <label htmlFor="lieu_livraison" className={styles.label}>
          Lieu de livraison
        </label>
        <input
          type="text"
          id="lieu_livraison"
          name="lieu_livraison"
          value={formData.lieu_livraison}
          onChange={handleChange}
          className={styles.input}
          placeholder="Domicile, Bureau, Événement..."
        />
        <p className={styles.helpText}>Précision sur le lieu (optionnel)</p>
      </div>
    </div>

    {/* Affichage des erreurs de validation */}
    {errors.step1 && (
      <div className={styles.errorMessage}>
        <strong>⚠️ Erreur :</strong> {errors.step1}
      </div>
    )}
  </div>
);
 
};

  


export default Step1Informations;