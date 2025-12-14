import styles from "../../styles/dashboard/dashboardPage.module.css";
import { useState } from "react";

/**
 * Composant pour créer un avis sur une commande terminée
 *
 * @param {number} commandeId - L'ID de la commande
 * @param {Object} commandeData - Les données de la commande
 * @param {Function} onSubmit - Fonction appelée lors de la soumission du formulaire
 * @param {Function} onCancel - Fonction appelée lors de l'annulation
 * @param {boolean} isLoading - État de chargement
 * @param {string} error - Message d'erreur
 * @returns {JSX.Element} Le composant CreateAvisForm
 */
function CreateAvisForm({
  commandeId,
  commandeData,
  onSubmit,
  onCancel,
  isLoading,
  error,
}) {
  const [formData, setFormData] = useState({
    note: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    note: "",
    description: "",
  });

  // Gestion du changement des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    
    if (!formData.note || formData.note < 1 || formData.note > 5) {
      newErrors.note = "La note doit être entre 1 et 5";
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères";
    }

    setErrors(newErrors);

    // Si pas d'erreurs, soumettre
    if (Object.keys(newErrors).length === 0) {
      onSubmit(commandeId, {
        note: parseInt(formData.note),
        description: formData.description.trim(),
      });
    }
  };

  return (
    <div className={styles.dashboardContent}>
      <h2>Donner votre avis sur la commande #{commandeId}</h2>

      {/* Affichage des informations de la commande */}
      {commandeData?.menu_titre && (
        <div className={styles.formGroup}>
          <label>Menu commandé</label>
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
          <label htmlFor="note">
            Note (sur 5) <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            required
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              maxWidth: "200px",
            }}
          >
            <option value="">Sélectionnez une note</option>
            <option value="1">1 - Très mauvais</option>
            <option value="2">2 - Mauvais</option>
            <option value="3">3 - Moyen</option>
            <option value="4">4 - Bien</option>
            <option value="5">5 - Excellent</option>
          </select>
          {errors.note && (
            <span style={{ color: "red", fontSize: "0.875rem" }}>
              {errors.note}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">
            Votre avis <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            placeholder="Décrivez votre expérience avec cette commande..."
            required
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
          {errors.description && (
            <span style={{ color: "red", fontSize: "0.875rem" }}>
              {errors.description}
            </span>
          )}
          <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.25rem" }}>
            Minimum 10 caractères
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Envoi en cours..." : "Envoyer mon avis"}
          </button>
          <button type="button" onClick={onCancel} disabled={isLoading}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAvisForm;

