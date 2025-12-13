// api/_utils/express-wrapper.js
const express = require('express');
const { parse } = require('url');

/**
 * Wrapper pour convertir une application Express en handler Vercel
 * @param {Express} app - Application Express
 * @returns {Function} Handler Vercel
 */
function createHandler(app) {
  return async (req, res) => {
    // Vercel Serverless Functions avec catch-all [...route].js
    // Quand on accède à /api/menus, Vercel appelle la fonction avec req.url = '/menus'
    // (le /api est déjà capturé par le routing Vercel)
    // On doit reconstruire le chemin complet avec /api
    
    const originalUrl = req.url || '/';
    
    // Le chemin dans req.url est déjà sans le /api (car c'est capturé par [...route])
    // On doit ajouter /api devant pour que les routes Express fonctionnent
    // Exemple: req.url = '/menus' -> on veut '/api/menus'
    if (!originalUrl.startsWith('/api')) {
      req.url = `/api${originalUrl}`;
      req.originalUrl = `/api${originalUrl}`;
    } else {
      req.originalUrl = originalUrl;
    }
    
    // Reconstruire les propriétés Express nécessaires
    const parsedUrl = parse(req.url, true);
    req.path = parsedUrl.pathname;
    req.query = parsedUrl.query;
    
    // Appel de l'application Express
    return app(req, res);
  };
}

module.exports = { createHandler };
