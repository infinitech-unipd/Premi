/**
 * Nome del file: player.server.routes.js
 * Percorso: /app/routes/player.server.routes.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-20
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

module.exports = function(app) {
  var player = require('../../app/controllers/player.server.controller');

  app.route('/player/:id')
    .get(player.findForPlay);
};
