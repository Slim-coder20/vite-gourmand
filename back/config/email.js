// Configuration de l'envoi d'email avec nodemailer
// Ce fichier centralise la configuration de l'envoi d'emails
// pour pouvoir l'utiliser dans toutes les routes API

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Création du transporteur email
// Configuration flexible pour développement et production
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true pour le port 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER, // Email de l'expéditeur
    pass: process.env.SMTP_PASSWORD, // Mot de passe d'application ou mot de passe SMTP
  },
});

// Fonction pour envoyer un email de réinitialisation de mot de passe
const sendPasswordResetEmail = async (email, resetToken, frontendUrl) => {
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Réinitialisation de votre mot de passe - Vite Gourmand",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              border: 1px solid #e0e0e0;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #d4a574;
            }
            .content {
              background-color: white;
              padding: 20px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #d4a574;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .button:hover {
              background-color: #c49564;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #666;
              margin-top: 20px;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 10px;
              margin: 15px 0;
              border-radius: 3px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🍽️ Vite Gourmand</div>
            </div>
            <div class="content">
              <h2>Réinitialisation de votre mot de passe</h2>
              <p>Bonjour,</p>
              <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte Vite Gourmand.</p>
              <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
              </div>
              <p>Ou copiez-collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #0066cc;">${resetLink}</p>
              <div class="warning">
                <strong>⚠️ Important :</strong>
                <ul>
                  <li>Ce lien est valide pendant <strong>1 heure</strong> uniquement</li>
                  <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                  <li>Pour votre sécurité, ne partagez jamais ce lien</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              <p>&copy; ${new Date().getFullYear()} Vite Gourmand - Tous droits réservés</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Réinitialisation de votre mot de passe - Vite Gourmand
      
      Bonjour,
      
      Vous avez demandé à réinitialiser votre mot de passe pour votre compte Vite Gourmand.
      
      Cliquez sur le lien suivant pour créer un nouveau mot de passe :
      ${resetLink}
      
      ⚠️ Important :
      - Ce lien est valide pendant 1 heure uniquement
      - Si vous n'avez pas demandé cette réinitialisation, ignorez cet email
      - Pour votre sécurité, ne partagez jamais ce lien
      
      Cet email a été envoyé automatiquement, merci de ne pas y répondre.
      
      © ${new Date().getFullYear()} Vite Gourmand - Tous droits réservés
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email de réinitialisation envoyé :", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw error;
  }
};

module.exports = {
  transporter,
  sendPasswordResetEmail,
};
