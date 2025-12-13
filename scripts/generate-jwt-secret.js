// Script pour générer une clé secrète JWT sécurisée
const crypto = require('crypto');

// Générer une clé de 64 bytes (512 bits) en base64
const jwtSecret = crypto.randomBytes(64).toString('base64');

console.log('\n✅ Clé JWT secrète générée :\n');
console.log(jwtSecret);
console.log('\n📋 Copiez cette clé pour l\'utiliser dans vos variables d\'environnement\n');
console.log('⚠️  IMPORTANT : Gardez cette clé secrète et ne la partagez jamais !\n');

