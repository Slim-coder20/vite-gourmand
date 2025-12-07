import styles from "./Step3Recap.module.css";
/**
 * Composant pour l'étape 3 : Nombre de personnes et récapitulatif
 *
 * @param {Object} formData - Contient menu, nombre_personne, et tous les prix
 * @param {Function} setFormData - Pour mettre à jour le nombre de personnes
 * @param {Function} onCalculatePrice - Fonction pour recalculer les prix
 * @param {Object} errors - Objet contenant les erreurs de validation
 */

function Step3Recap({ formData, setFormData, onCalculatePrice, errors }) {
  const handleNumberChange = (e) => {
    const number =
      parseInt(e.target.value) || formData.menu?.nombre_personne_minimum || 1;

    // Mettre a jour le nombre de personne //
    setFormData((prev) => ({
      ...prev,
      nombre_personne: number,
    }));

    // Recalculer les Prix automatiquement //
    if (onCalculatePrice) {
      onCalculatePrice(number);
    }
  };
  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>
        Étape 3 : Nombre de personnes et récapitulatif
      </h2>

      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label htmlFor="nombre_personne" className={styles.label}>
            Nombre de personnes <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="nombre_personne"
            name="nombre_personne"
            min={formData.menu?.nombre_personne_minimum || 1}
            value={
              formData.nombre_personne ||
              formData.menu?.nombre_personne_minimum ||
              1
            }
            onChange={handleNumberChange}
            className={styles.input}
            required
          />
          <p className={styles.helpText}>
            Minimum : {formData.menu?.nombre_personne_minimum || 1} personne(s)
          </p>
        </div>
      </div>

      <div className={styles.recapSection}>
        <h3 className={styles.recapTitle}>Récapitulatif de votre commande</h3>

        {/* Détails du menu */}
        <div className={styles.menuDetails}>
          <h4>{formData.menu?.titre}</h4>
          <p>{formData.menu?.description}</p>
        </div>

        {/* Récapitulatif des prix */}
        <div className={styles.pricesList}>
          {/* Prix du menu */}
          <div className={styles.priceLine}>
            <span className={styles.priceLabel}>
              Prix du menu (
              {formData.nombre_personne ||
                formData.menu?.nombre_personne_minimum ||
                1}{" "}
              personne(s))
            </span>
            <span className={styles.priceValue}>
              {formData.prix_menu.toFixed(2)}€
            </span>
          </div>

          {/* Réduction si applicable */}
          {formData.reduction_appliquee && (
            <div className={styles.reduction}>
              <span className={styles.reductionLabel}>
                Réduction de 10% appliquée
              </span>
              <span className={styles.reductionValue}>
                -{(formData.prix_menu / 0.9 - formData.prix_menu).toFixed(2)}€
              </span>
            </div>
          )}

          {/* Prix de livraison */}
          <div className={styles.priceLine}>
            <span className={styles.priceLabel}>Prix de livraison</span>
            <span className={styles.priceValue}>
              {formData.prix_livraison.toFixed(2)}€
            </span>
          </div>

          {/* Séparateur */}
          <div className={styles.separator}></div>

          {/* Total */}
          <div className={`${styles.priceLine} ${styles.total}`}>
            <span className={styles.priceLabel}>Total</span>
            <span className={styles.priceValue}>
              {formData.prix_total.toFixed(2)}€
            </span>
          </div>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {errors.step3 && (
        <div className={styles.errorMessage}>
          <strong>⚠️ Erreur :</strong> {errors.step3}
        </div>
      )}
    </div>
  );
}
export default Step3Recap;
