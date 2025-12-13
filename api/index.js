// api/index.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connexion MongoDB (réutilisable entre les fonctions)
let mongoConnection = null;

async function connectMongo() {
  if (mongoConnection && mongoose.connection.readyState === 1) {
    return mongoConnection;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    // Options dépréciées supprimées (useNewUrlParser, useUnifiedTopology)
    // Ces options n'ont plus d'effet depuis Mongoose 6+
    mongoConnection = await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected");
    return mongoConnection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

module.exports = { connectMongo };
