// api/index.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connexion MongoDB (réutilisable entre les fonctions)
let mongoConnection = null;

async function connectMongo() {
  if (mongoConnection && mongoose.connection.readyState === 1) {
    return mongoConnection;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    mongoConnection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
    return mongoConnection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connectMongo };
