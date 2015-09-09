'use strict';

/**
 * @module CoreController
 */

/**
 * Restituisce al client la pagina d'avvio renderizzata iniettando in `req.user`
 *     l'utente autenticato quando possibile.
 *
 * @param {Object} req - Richiesta HTTP.
 * @param {Object} res - La pagina d'avvio della single-page application.
 */
exports.index = function(req, res) {
  res.render('index', {
    user: req.user || null,
    request: req
  });
};
