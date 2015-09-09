/**
 * Nome del file: users.server.routes.js
 * Percorso: /app/routes/users.server.routes.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-07
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

var passport = require('passport');

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');

  app.route('/users').put(users.update);

  app.route('/users/password').post(users.changePassword);

  app.route('/auth/signup').post(users.signup);
  app.route('/auth/signin').post(users.signin);
  app.route('/auth/signout').get(users.signout);

  app.param('userId', users.userByID);
};
