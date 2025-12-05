/**
 * Service pour gérer les appels API liés au contact
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
/**
 * Envoie un message de contact
 * @param {Object} contactData - Les données du formulaire de contact
 * @param {string} contactData.name - Nom de l'utilisateur
 * @param {string} contactData.email - Email de l'utilisateur
 * @param {string} contactData.subject - Sujet du message
 * @param {string} contactData.content - Contenu du message
 * @returns {Promise<Object>} La réponse de l'API
 */

export const sendContactMessage = async (contactData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la réponse n'est pas OK, on lance une erreur avec le message de l'API
      throw new Error(data.message || "Erreur lors de l'envoi du message");
    }

    return data;
  } catch (error) {
    // Si c'est une erreur réseau, on la transforme en message plus clair
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Impossible de contacter le serveur. Vérifiez votre connexion."
      );
    }
    throw error;
  }
};
