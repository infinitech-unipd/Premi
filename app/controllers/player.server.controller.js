/**
 * Nome del file: player.server.controller.js
 * Percorso: /app/controllers/player.server.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-20
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-20 - Creato metodo findForPlay() - Simone Campagna
 */

'use strict';

var mongoose = require('mongoose');
var Presentation = mongoose.model('Presentation');
var _ = require('lodash');

/**
 * @module PlayerController
 */

/**
 * Cerca e restituisce una presentazione accertandosi che esista e che l'utente
 *     autenticato possa accedervi.
 *
 * @param {Object} req - `req.params.id` contiene l'id della presentazione da
 *     riprodurre.
 * @param {Object} res - La presentazione da riprodurre o un eventuale messaggio
 *     di errore 403 o 404.
 */
exports.findForPlay = function(req, res) {
  Presentation.findById(req.params.id).exec(function(err, presentation) {
    if (err) {
      return res.status(404).send({
        message: 'Presentation not found'
      });
    }
    // Controlla se la presentazione richiesta è pubblica
    if (presentation.info.privacy === true) {

      if (presentation.author.toString() === req.user.id) {
        res.json(presentation);
      } else {
        // Utente non autorizzato alla visione
        return res.status(403).send({
          message: 'User is not authorized'
        });
      }
    } else {
      // La presentazione risulta pubblica
      res.json(presentation);
    }
  });
};
