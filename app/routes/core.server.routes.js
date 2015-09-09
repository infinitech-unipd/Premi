/**
 * Nome del file: core.server.routes.js
 * Percorso: /app/routes/core.server.routes.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-07
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

module.exports = function(app) {
  var core = require('../../app/controllers/core.server.controller');
  app.route('/').get(core.index);
};
