import styles from "../../styles/dashboard/dashboardPage.module.css";
import { useState } from "react";

/**
 * Composant pour l'édition d'une commande dans le dashboard
 *
 * @param {Object} command - La commande à modifier
 * @param {Function} onSubmit - Fonction appelée lors de la soumission du formulaire
 * @param {Function} onCancel - Fonction appelée lors de l'annulation de la modification
 * @returns {JSX.Element} Le composant EditCommandForm
 */

function EditCommandForm({
  commandeId,
  commandeData,
  onSubmit,
  onCancel,
  isLoading,
  error,
}) {
  // Gestion des états pour le formulaire de modification ou annulation de la commande//
  const [formData, setFormData] = useState({
    date_prestation: commandeData?.date_prestation
      ? new Date(commandeData.date_prestation).toISOString().split("T")[0]
      : "",
    heure_livraison: commandeData?.heure_livraison
      ? commandeData.heure_livraison
          .toString()
          .split(" ")[1]
          ?.substring(0, 5) || ""
      : "",
    nombre_personne: commandeData?.nombre_personne || "",
    pret_materiel: commandeData?.pret_materiel || false,
    restitution_materiel: commandeData?.restitution_materiel || false,
  });

  // Gestion des erreurs de validation
  const [errors, setErrors] = useState({
    date_prestation: "",
    heure_livraison: "",
    nombre_personne: "",
  });

  // Gestion du changement des champs du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Pour les checkboxes, utiliser checked au lieu de value
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    // Réinitialiser l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.date_prestation) {
      newErrors.date_prestation = "La date de prestation est requise";
    } else {
      const selectedDate = new Date(formData.date_prestation);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date_prestation = "La date ne peut pas être dans le passé";
      }
    }

    if (!formData.heure_livraison) {
      newErrors.heure_livraison = "L'heure de livraison est requise";
    }

    if (!formData.nombre_personne || formData.nombre_personne < 1) {
      newErrors.nombre_personne = "Le nombre de personnes doit être au moins 1";
    }

    setErrors(newErrors);

    // Si pas d'erreurs, soumettre
    if (Object.keys(newErrors).length === 0) {
      onSubmit(commandeId, formData);
    }
  };

  // Gestion de l'annulation de la modification
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className={styles.dashboardContent}>
      <h2>Modifier la commande #{commandeId}</h2>

      {/* Affichage du menu (non modifiable) */}
      {commandeData?.menu_titre && (
        <div className={styles.formGroup}>
          <label>Menu sélectionné (non modifiable)</label>
          <input
            type="text"
            value={commandeData.menu_titre}
            disabled
            className={styles.inputDisabled}
          />
        </div>
      )}

      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>Erreur : {error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="date_prestation">Date de prestation *</label>
          <input
            type="date"
            id="date_prestation"
            name="date_prestation"
            value={formData.date_prestation}
            onChange={handleChange}
            required
          />
          {errors.date_prestation && (
            <span style={{ color: "red", fontSize: "0.875rem" }}>
              {errors.date_prestation}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="heure_livraison">Heure de livraison *</label>
          <input
            type="time"
            id="heure_livraison"
            name="heure_livraison"
            value={formData.heure_livraison}
            onChange={handleChange}
            required
          />
          {errors.heure_livraison && (
            <span style={{ color: "red", fontSize: "0.875rem" }}>
              {errors.heure_livraison}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nombre_personne">Nombre de personnes *</label>
          <input
            type="number"
            id="nombre_personne"
            name="nombre_personne"
            value={formData.nombre_personne}
            onChange={handleChange}
            min="1"
            required
          />
          {errors.nombre_personne && (
            <span style={{ color: "red", fontSize: "0.875rem" }}>
              {errors.nombre_personne}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pret_materiel">
            <input
              type="checkbox"
              id="pret_materiel"
              name="pret_materiel"
              checked={formData.pret_materiel}
              onChange={handleChange}
            />
            Prêt de matériel
          </label>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="restitution_materiel">
            <input
              type="checkbox"
              id="restitution_materiel"
              name="restitution_materiel"
              checked={formData.restitution_materiel}
              onChange={handleChange}
            />
            Restitution de matériel
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Modification en cours..." : "Modifier"}
          </button>
          <button type="button" onClick={handleCancel} disabled={isLoading}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCommandForm;
