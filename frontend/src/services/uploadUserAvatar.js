import { getToken } from "./authService.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Service pour uploader une image de profil utilisateur
 * Utilisation de Supabase pour l'upload de l'image
 */
export const uploadUserAvatar = async (file) => {
  try {
    // Vérifier que le fichier existe
    if (!file) {
      throw new Error("Aucun fichier fourni");
    }

    // Vérifier la taille du fichier (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB en bytes
    if (file.size > maxSize) {
      throw new Error("Le fichier est trop volumineux (max 2MB)");
    }

    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP"
      );
    }

    // Récupérer le token d'authentification
    const token = getToken();
    if (!token) {
      throw new Error("Vous devez être connecté pour uploader une image");
    }

    // Créer un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("avatar", file);

    // Envoyer la requête POST vers l'API
    const response = await fetch(`${API_URL}/user/upload-avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // Vérifier si la réponse est OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de l'upload de l'image"
      );
    }

    // Parser la réponse JSON
    const data = await response.json();

    // Retourner l'URL de l'image
    return {
      url: data.url,
      success: data.success,
      message: data.message,
    };
  } catch (error) {
    // Propager l'erreur avec un message clair
    throw new Error(
      error.message || "Erreur lors de l'upload de l'image de profil"
    );
  }
};
