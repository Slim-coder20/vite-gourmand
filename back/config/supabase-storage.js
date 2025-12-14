const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

// Initialiser le client Supabase seulement si les variables sont définies
try {
  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log("✅ Client Supabase Storage initialisé");
  } else {
    console.warn("Variables d'environnement Supabase manquantes - upload d'images désactivé");
  }
} catch (error) {
  console.error("❌ Erreur lors de l'initialisation du client Supabase:", error);
  supabase = null;
}

const BUCKET_NAME = "user-avatars";

// Fonction pour uploader une image de profil utilisateur
const uploadUserAvatar = async (
  userId,
  fileBuffer,
  mimeType,
  originalFileName
) => {
  if (!supabase) {
    throw new Error("Supabase Storage non configuré - vérifiez les variables d'environnement");
  }

  try {
    const timestamp = Date.now();
    const extension = originalFileName.split(".").pop().toLowerCase();
    const fileName = `user_${userId}_${timestamp}.${extension}`;

    // Vérifier que le bucket existe
    const { data: buckets, error: bucketError } =
      await supabase.storage.listBuckets();
    if (bucketError) {
      throw new Error(`Erreur bucket : ${bucketError.message}`);
    }

    const bucketExists = buckets.some((bucket) => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      throw new Error(`Bucket ${BUCKET_NAME} introuvable`);
    }

    // Supprimer les anciennes images de l'utilisateur
    const { data: existingFiles } = await supabase.storage
      .from(BUCKET_NAME)
      .list("", {
        search: `user_${userId}_`,
      });

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map((file) => file.name);
      await supabase.storage.from(BUCKET_NAME).remove(filesToDelete);
      console.log(`Anciennes images supprimées pour user ${userId}`);
    }

    // Uploader la nouvelle image
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Erreur upload : ${error.message}`);
    }

    // Récupérer l'URL publique
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    console.log(`Image uploadée : ${publicUrl}`);

    return {
      url: publicUrl,
      path: fileName,
    };
  } catch (error) {
    console.error("Erreur upload avatar :", error);
    throw error;
  }
};

// Fonction pour supprimer l'avatar d'un utilisateur
const deleteUserAvatar = async (userId) => {
  if (!supabase) {
    throw new Error("Supabase Storage non configuré - vérifiez les variables d'environnement");
  }

  try {
    const { data: files } = await supabase.storage.from(BUCKET_NAME).list("", {
      search: `user_${userId}_`,
    });

    if (!files || files.length === 0) {
      return true;
    }

    const filesToDelete = files.map((file) => file.name);
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filesToDelete);

    if (error) {
      throw new Error(`Erreur suppression : ${error.message}`);
    }

    console.log(`Images supprimées pour user ${userId}`);
    return true;
  } catch (error) {
    console.error("Erreur suppression avatar :", error);
    throw error;
  }
};

module.exports = {
  uploadUserAvatar,
  deleteUserAvatar,
};
