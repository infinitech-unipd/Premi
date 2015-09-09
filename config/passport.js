'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
var User = require('mongoose').model('User');
var path = require('path');
var config = require('./config');

/**
 * Module init function.
 */
module.exports = function() {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, '-salt -password', function(err, user) {
      done(err, user);
    });
  });

  // Initialize strategies
  config.getGlobbedFiles('./config/strategies/**/*.js')
    .forEach(function(strategy) {
      require(path.resolve(strategy))();
    }
  );
};
