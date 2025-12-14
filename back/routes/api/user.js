const express = require("express");
const authenticateToken = require("../../middleware/auth");
const pool = require("../../config/database");
const multer = require("multer");
const { uploadUserAvatar } = require("../../config/supabase-storage");

// Configuration Multer pour l'upload d'images
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  // Accepter uniquement les images
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true); // Accepter le fichier
  } else {
    cb(
      new Error("Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP"),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  },
  fileFilter: fileFilter,
});

// Création du router Express //
const router = express.Router();

// création de la route POST pour l'upload de l'image user //
router.post(
  "/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      // Vérifier que le fichier existe
      if (!req.file) {
        return res.status(400).json({
          message: "Aucun fichier fourni",
        });
      }

      // Récupérer l'ID de l'utilisateur depuis le token
      const userId = req.user.userId;

      // Uploader l'image dans Supabase Storage
      const { url } = await uploadUserAvatar(
        userId,
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      );

      // Mettre à jour la colonne image dans la base de données
      await pool.query('UPDATE "user" SET image = ? WHERE user_id = ?', [
        url,
        userId,
      ]);

      res.status(200).json({
        success: true,
        url: url,
        message: "Image uploadée avec succès",
      });
    } catch (error) {
      console.error("Erreur upload avatar :", error);

      // Gérer les erreurs multer
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "Fichier trop volumineux (max 2MB)",
          });
        }
      }

      res.status(500).json({
        message: "Erreur lors de l'upload de l'image",
        error: error.message,
      });
    }
  }
);

module.exports = router;
