import { useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import styles from "../styles/contact/Contact.module.css";
import { sendContactMessage } from "../services/contactService";

function Contact() {
  // Les états // 
  const [ name, setName ] = useState(""); 
  const [ email, setEmail] = useState(""); 
  const [ subject, setSubject ] = useState(""); 
  const [ content, setContent ] = useState(""); 

  // Les états de gestion du formulaire de contact // 
  const [ error, setError ] = useState(null); 
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading ] = useState(false); 
  const [validationErrors, setValidationErrors] = useState({});

  /**
   * Fonction de validation du formulaire 
   * @return {boolean} true si le formulaire est valide false si non valide 
   */

  const validateForm = () => {
    const errors = {}; 
    // Vérification des champs du formulaire de contact
    if(!name.trim()){
        errors.name = "Le nom est requis"
      } else if (name.trim().length < 2) {
        errors.name = "Le nom doit contenir au moins 2 caratères"
      }
    // Validation de l'email
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!email.trim()) {
         errors.email = "L'email est requis";
       } else if (!emailRegex.test(email)) {
         errors.email = "Format d'email invalide";
       }
    // Validation du sujet
         if (!subject.trim()) {
          errors.subject = "Le sujet est requis";
        } else if (subject.trim().length < 3) {
          errors.subject = "Le sujet doit contenir au moins 3 caractères";
        }
    // Validation du message
        if (!content.trim()) {
          errors.content = "Le message est requis";
        } else if (content.trim().length < 10) {
          errors.content = "Le message doit contenir au moins 10 caractères";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Gestion de la soumission du formulaire 
     *  @param {Event} e - L'événement de soumission
    */
    const handleSubmit = async (e) => {
      e.preventDefault(); 
      setError(null);
      setSuccess(false); 
      // Validation du formulaire 
      if(!validateForm()) {
        return; 
      }
  
      setIsLoading(true); 
  
      // Envoie du message vers API // 
      try {
        // Envoie du message vers API avec la fonction sendContactMessage qui intéragit avec le back //
        await sendContactMessage({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(), 
          content: content.trim()
        }); 
  
        // Succès : réinitialisation du formulaire et affichage du message de succès
        setName("");
        setEmail("");
        setSubject("");
        setContent("");
        setSuccess(true);
        setValidationErrors({});
  
        // Masquer le message de succès après 2 secondes 
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
        
      } catch (error) {
         // Gestion des erreurs
         setError(
          error.message || "Une erreur est survenue lors de l'envoi du message"
        );
      } finally {
        setIsLoading(false); 
      }
    
    };
  return (
    <>
    <Header /> 
    <div className={styles.contactContainer}>
        <div className={styles.contactWrapper}>
          <div className={styles.contactHeader}>
            <h1>Contactez-nous</h1>
            <p>
              Une question ? Une suggestion ? N'hésitez pas à nous écrire, nous
              vous répondrons dans les plus brefs délais.
            </p>
          </div>

          {/* Message de succès */}
          {success && (
            <div className={styles.successMessage}>
              <span className={styles.successIcon}>✅</span>
              <div>
                <strong>Message envoyé avec succès !</strong>
                <p>
                  Nous avons bien reçu votre message et vous répondrons bientôt.
                </p>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>❌</span>
              <div>
                <strong>Erreur</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.contactForm}>
            {/* Champ Nom */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={
                  validationErrors.name
                    ? `${styles.input} ${styles.inputError}`
                    : styles.input
                }
                placeholder="Votre nom"
                disabled={isLoading}
              />
              {validationErrors.name && (
                <span className={styles.errorText}>
                  {validationErrors.name}
                </span>
              )}
            </div>

            {/* Champ Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={
                  validationErrors.email
                    ? `${styles.input} ${styles.inputError}`
                    : styles.input
                }
                placeholder="votre.email@exemple.com"
                disabled={isLoading}
              />
              {validationErrors.email && (
                <span className={styles.errorText}>
                  {validationErrors.email}
                </span>
              )}
            </div>

            {/* Champ Sujet */}
            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>
                Sujet *
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={
                  validationErrors.subject
                    ? `${styles.input} ${styles.inputError}`
                    : styles.input
                }
                placeholder="Sujet de votre message"
                disabled={isLoading}
              />
              {validationErrors.subject && (
                <span className={styles.errorText}>
                  {validationErrors.subject}
                </span>
              )}
            </div>

            {/* Champ Message */}
            <div className={styles.formGroup}>
              <label htmlFor="content" className={styles.label}>
                Message *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={
                  validationErrors.content
                    ? `${styles.textarea} ${styles.inputError}`
                    : styles.textarea
                }
                placeholder="Votre message..."
                rows={6}
                disabled={isLoading}
              />
              {validationErrors.content && (
                <span className={styles.errorText}>
                  {validationErrors.content}
                </span>
              )}
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le message"
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer /> 
    </>
    
  );
}
export default Contact;