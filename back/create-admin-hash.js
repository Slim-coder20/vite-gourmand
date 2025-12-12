// Script pour créé un hash pour le mot de passe admin // 
const bcrypt = require("bcrypt");

// le mot de passe admin // 
const password = 'MotDePasseAdmin123!';

// Génrer le hash avec bcrypt //
bcrypt.hash(password, 10)
  .then(hashedPassword => {
    console.log("\n✅ Hash généré avec succès :");
    console.log(hashedPassword);
    console.log("\n📋 Copiez ce hash pour l'utiliser dans votre INSERT SQL\n");
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ Erreur lors du hashage :", error);
    process.exit(1);
  });