// api/_utils/express-wrapper.js
const express = require('express');

/**
 * Wrapper pour convertir une application Express en handler Vercel
 * @param {Express} app - Application Express
 * @returns {Function} Handler Vercel
 */
function createHandler(app) {
  return async (req, res) => {
    // Vercel passe req et res directement
    return app(req, res);
  };
}

module.exports = { createHandler };
