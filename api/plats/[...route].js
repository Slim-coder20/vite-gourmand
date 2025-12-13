// api/plats/[...route].js
const express = require('express');
const cors = require('cors');
const platsRouter = require('../../back/routes/api/plats');
const { createHandler } = require('../_utils/express-wrapper');
const { connectMongo } = require('../index');

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return res.status(500).json({ 
      error: 'Database connection failed',
      message: error.message 
    });
  }
});

app.use('/api/plats', platsRouter);

module.exports = createHandler(app);
