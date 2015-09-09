/**
 * Nome del file: presentations.server.routes.js
 * Percorso: /app/routes/presentations.server.routes.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-16
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

var users = require('../../app/controllers/users.server.controller');
var presentations = require('../../app/controllers/presentations.server.controller');

module.exports = function(app) {

  app.route('/presentations')
    .get(presentations.listByAuthor);

  app.route('/presentations/create')
    .post(users.requiresLogin, presentations.create);

  app.route('/presentations/public')
    .get(presentations.listPublic);

  app.route('/presentations/:id')
    .get(users.requiresLogin, presentations.isAuthor, presentations.findOne)
    .put(users.requiresLogin, presentations.isAuthor, presentations.update)
    .delete(users.requiresLogin, presentations.isAuthor, presentations.delete);

  app.param('id', presentations.presentationById);
};
