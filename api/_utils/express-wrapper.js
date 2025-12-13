// api/_utils/express-wrapper.js
const express = require('express');

/**
 * Wrapper pour convertir une application Express en handler Vercel
 * @param {Express} app - Application Express
 * @returns {Function} Handler Vercel
 */
function createHandler(app) {
  return async (req, res) => {
    // Vercel Serverless Functions : le chemin est dans req.url
    // On doit préfixer avec /api pour que les routes Express fonctionnent
    const originalUrl = req.url;
    
    // Si l'URL ne commence pas par /api, on l'ajoute
    if (!originalUrl.startsWith('/api')) {
      req.url = `/api${originalUrl}`;
    }
    
    // Appel de l'application Express
    return app(req, res);
  };
}

module.exports = { createHandler };
