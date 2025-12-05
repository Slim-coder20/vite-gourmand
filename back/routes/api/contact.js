const express = require("express");
const Contact = require("../../models/Contact");
const { transporter } = require("../../config/email");

// Création du router Express //
const router = express.Router();

// Route GET pour récupérer tous les messages de contact
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
    console.log("Messages de contact récupérés avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des messages de contact",
      error: error.message,
    });
    console.error(
      "Erreur lors de la récupération des messages de contact :",
      error
    );
  }
});

// Route POST pour créer un message de contact
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, content } = req.body;

    // Vérification que tous les champs sont présents
    if (!name || !email || !subject || !content) {
      return res.status(400).json({
        message: "Tous les champs sont requis (name, email, subject, content)",
      });
    }

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Format d'email invalide",
      });
    }

    // Création du nouveau message de contact
    const contact = new Contact({
      name,
      email,
      subject,
      content,
    });

    // Sauvegarde dans la base de données
    await contact.save();

    // Envoi de l'email de confirmation à l'utilisateur
    try {
      const userMailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Confirmation de réception - Vite Gourmand",
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
                .success {
                  background-color: #d4edda;
                  border-left: 4px solid #28a745;
                  padding: 10px;
                  margin: 15px 0;
                  border-radius: 3px;
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
                  <h2>Merci pour votre message !</h2>
                  <p>Bonjour ${name},</p>
                  <div class="success">
                    <strong>✅ Votre message a bien été reçu</strong>
                  </div>
                  <p>Nous avons bien reçu votre demande concernant : <strong>${subject}</strong></p>
                  <p>Notre équipe vous répondra dans les plus brefs délais.</p>
                  <p>Cordialement,<br>L'équipe Vite Gourmand</p>
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
          Merci pour votre message - Vite Gourmand
          
          Bonjour ${name},
          
          Votre message a bien été reçu.
          Nous avons bien reçu votre demande concernant : ${subject}
          
          Notre équipe vous répondra dans les plus brefs délais.
          
          Cordialement,
          L'équipe Vite Gourmand
          
          © ${new Date().getFullYear()} Vite Gourmand - Tous droits réservés
        `,
      };

      await transporter.sendMail(userMailOptions);
      console.log(`Email de confirmation envoyé à ${email}`);
    } catch (emailError) {
      // On log l'erreur mais on ne bloque pas la sauvegarde du message
      console.error(
        "Erreur lors de l'envoi de l'email de confirmation :",
        emailError
      );
    }

    // Envoi de l'email de notification à l'administrateur
    try {
      const adminEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
      const adminMailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: adminEmail,
        subject: `Nouveau message de contact - ${subject}`,
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
                .info-box {
                  background-color: #e7f3ff;
                  border-left: 4px solid #2196F3;
                  padding: 15px;
                  margin: 15px 0;
                  border-radius: 3px;
                }
                .message-box {
                  background-color: #f5f5f5;
                  padding: 15px;
                  margin: 15px 0;
                  border-radius: 5px;
                  border: 1px solid #ddd;
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
                  <h2>Nouveau message de contact</h2>
                  <div class="info-box">
                    <p><strong>De :</strong> ${name} (${email})</p>
                    <p><strong>Sujet :</strong> ${subject}</p>
                    <p><strong>Date :</strong> ${new Date().toLocaleString(
                      "fr-FR"
                    )}</p>
                  </div>
                  <div class="message-box">
                    <strong>Message :</strong>
                    <p>${content.replace(/\n/g, "<br>")}</p>
                  </div>
                </div>
                <div class="footer">
                  <p>Cet email a été envoyé automatiquement depuis le formulaire de contact.</p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
          Nouveau message de contact - Vite Gourmand
          
          De : ${name} (${email})
          Sujet : ${subject}
          Date : ${new Date().toLocaleString("fr-FR")}
          
          Message :
          ${content}
        `,
      };

      await transporter.sendMail(adminMailOptions);
      console.log(`Email de notification envoyé à l'administrateur`);
    } catch (emailError) {
      // On log l'erreur mais on ne bloque pas la sauvegarde du message
      console.error(
        "Erreur lors de l'envoi de l'email de notification :",
        emailError
      );
    }

    // Réponse réussie
    res.status(201).json({
      message: "Message envoyé avec succès",
      contact: contact,
    });
    console.log("Message de contact créé avec succès");
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du message de contact",
      error: error.message,
    });
    console.error("Erreur lors de la création du message de contact :", error);
  }
});

// Exportation du router pour l'utiliser dans index.js
module.exports = router;

