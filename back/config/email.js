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

// Fonction pour envoyer un email de confirmation de commande
const sendOrderConfirmationEmail = async (user, commande) => {
  // Formater la date de prestation
  const datePrestation = new Date(commande.date_prestation);
  const dateFormatee = datePrestation.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Extraire l'heure de livraison
  const heureLivraison = commande.heure_livraison
    ? new Date(commande.heure_livraison).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Non spécifiée";

  // Calculer le total
  const prixTotal = (commande.prix_menu || 0) + (commande.prix_livraison || 0);

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: `Confirmation de commande ${commande.numero_commande} - Vite Gourmand`,
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
            .success-badge {
              background-color: #d4edda;
              color: #155724;
              padding: 10px;
              border-radius: 5px;
              text-align: center;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .order-details {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
            .order-details h3 {
              margin-top: 0;
              color: #d4a574;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: 500;
            }
            .detail-value {
              color: #333;
            }
            .price-section {
              background-color: #fff3cd;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
              border-left: 4px solid #ffc107;
            }
            .total-price {
              font-size: 20px;
              font-weight: bold;
              color: #d4a574;
              text-align: center;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #666;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🍽️ Vite Gourmand</div>
            </div>
            <div class="content">
              <div class="success-badge">
                ✅ Votre commande a été confirmée avec succès !
              </div>
              
              <h2>Confirmation de commande</h2>
              <p>Bonjour ${user.prenom} ${user.nom},</p>
              <p>Nous avons bien reçu votre commande. Vous trouverez ci-dessous tous les détails de votre réservation.</p>
              
              <div class="order-details">
                <h3>Détails de la commande</h3>
                <div class="detail-row">
                  <span class="detail-label">Numéro de commande :</span>
                  <span class="detail-value"><strong>${
                    commande.numero_commande
                  }</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date de commande :</span>
                  <span class="detail-value">${new Date(
                    commande.date_commande
                  ).toLocaleDateString("fr-FR")}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Menu commandé :</span>
                  <span class="detail-value">${
                    commande.menu_titre || "Menu"
                  }</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Nombre de personnes :</span>
                  <span class="detail-value">${
                    commande.nombre_personne
                  } personne(s)</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date de prestation :</span>
                  <span class="detail-value">${dateFormatee}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Heure de livraison :</span>
                  <span class="detail-value">${heureLivraison}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Adresse de livraison :</span>
                  <span class="detail-value">${
                    commande.adresse_prestation || "Non spécifiée"
                  }</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Statut :</span>
                  <span class="detail-value"><strong>${
                    commande.statut || "en attente"
                  }</strong></span>
                </div>
              </div>
              
              <div class="price-section">
                <h3>Récapitulatif des prix</h3>
                <div class="detail-row">
                  <span class="detail-label">Prix du menu :</span>
                  <span class="detail-value">${(
                    commande.prix_menu || 0
                  ).toFixed(2)}€</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Prix de livraison :</span>
                  <span class="detail-value">${(
                    commande.prix_livraison || 0
                  ).toFixed(2)}€</span>
                </div>
                <div class="total-price">
                  Total : ${prixTotal.toFixed(2)}€
                </div>
              </div>
              
              <p style="margin-top: 20px;">
                <strong>Prochaines étapes :</strong><br>
                Votre commande est en cours de traitement. Vous recevrez une notification lorsque votre commande sera prête.
              </p>
              
              <p>
                Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter.
              </p>
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
      Confirmation de commande ${commande.numero_commande} - Vite Gourmand
      
      Bonjour ${user.prenom} ${user.nom},
      
      Nous avons bien reçu votre commande. Voici les détails :
      
      Numéro de commande : ${commande.numero_commande}
      Date de commande : ${new Date(commande.date_commande).toLocaleDateString(
        "fr-FR"
      )}
      Menu : ${commande.menu_titre || "Menu"}
      Nombre de personnes : ${commande.nombre_personne}
      Date de prestation : ${dateFormatee}
      Heure de livraison : ${heureLivraison}
      Adresse : ${commande.adresse_prestation || "Non spécifiée"}
      Statut : ${commande.statut || "en attente"}
      
      Récapitulatif des prix :
      - Prix du menu : ${(commande.prix_menu || 0).toFixed(2)}€
      - Prix de livraison : ${(commande.prix_livraison || 0).toFixed(2)}€
      - Total : ${prixTotal.toFixed(2)}€
      
      Votre commande est en cours de traitement.
      
      © ${new Date().getFullYear()} Vite Gourmand - Tous droits réservés
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email de confirmation de commande envoyé :", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation :", error);
    throw error;
  }
};

// Fonction pour envoyer un email de notification d'avis suite à une commande terminée
const sendAvisConfirmationEmail = async (user, commande, frontendUrl) => {
  // Construire le lien vers le dashboard pour créer un avis
  const dashboardLink = `${frontendUrl}/dashboard?commande=${commande.commande_id}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: `Donnez votre avis sur votre commande ${commande.numero_commande} - Vite Gourmand`,
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
            .success-badge {
              background-color: #d4edda;
              color: #155724;
              padding: 10px;
              border-radius: 5px;
              text-align: center;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .order-info {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
              text-align: center;
            }
            .order-info h3 {
              margin-top: 0;
              color: #d4a574;
            }
            .order-number {
              font-size: 18px;
              font-weight: bold;
              color: #333;
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🍽️ Vite Gourmand</div>
            </div>
            <div class="content">
              <div class="success-badge">
                ✅ Votre commande est terminée !
              </div>
              
              <h2>Partagez votre expérience</h2>
              <p>Bonjour ${user.prenom} ${user.nom},</p>
              <p>Votre commande <strong>${
                commande.numero_commande
              }</strong> est maintenant terminée.</p>
              <p>Votre avis est important pour nous ! Il nous aide à améliorer nos services et à offrir une meilleure expérience à tous nos clients.</p>
              
              <div class="order-info">
                <h3>Commande concernée</h3>
                <p class="order-number">${commande.numero_commande}</p>
              </div>
              
              <p style="text-align: center; margin-top: 20px;">
                Cliquez sur le bouton ci-dessous pour vous connecter à votre compte et donner votre avis :
              </p>
              
              <div style="text-align: center;">
                <a href="${dashboardLink}" class="button">Donner mon avis</a>
              </div>
              
              <p style="text-align: center; margin-top: 20px;">
                Ou copiez-collez ce lien dans votre navigateur :<br>
                <span style="word-break: break-all; color: #0066cc; font-size: 12px;">${dashboardLink}</span>
              </p>
              
              <p style="margin-top: 20px;">
                Merci de prendre quelques instants pour partager votre expérience avec nous.
              </p>
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
      Donnez votre avis sur votre commande ${
        commande.numero_commande
      } - Vite Gourmand
      
      Bonjour ${user.prenom} ${user.nom},
      
      Votre commande ${commande.numero_commande} est maintenant terminée.
      
      Votre avis est important pour nous ! Il nous aide à améliorer nos services et à offrir une meilleure expérience à tous nos clients.
      
      Cliquez sur le lien suivant pour vous connecter à votre compte et donner votre avis :
      ${dashboardLink}
      
      Merci de prendre quelques instants pour partager votre expérience avec nous.
      
      © ${new Date().getFullYear()} Vite Gourmand - Tous droits réservés
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email d'invitation à donner un avis envoyé :", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email d'invitation à donner un avis :",
      error
    );
    throw error;
  }
};

module.exports = {
  transporter,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendAvisConfirmationEmail,
};
