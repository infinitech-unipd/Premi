/**
 * Nome del file: presentation.server.model.test.js
 * Percorso: app/tests/presentation.server.model.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-15
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-07-15 - Definiti test di unità Presentation model - Enrico Ceron
 */

'use strict';

var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Presentation = mongoose.model('Presentation');

var user;
var presentation;

describe('Presentation model unit tests', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      presentation = new Presentation({
        author: user,
        info: {
          title: 'Title',
          description: 'Description.'
        }
      });

      done();
    });
  });

  describe('save()', function() {
    it('should be able to save without problems', function(done) {
      return presentation.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function(done) {
      presentation.info.title = '';

      return presentation.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when title is too long', function(done) {
      presentation.info.title = '';
      for (var i = 0; i < 41; i++) {
        presentation.info.title += 'a';
      }

      return presentation.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when description is too long', function(done) {
      presentation.info.description = '';
      for (var i = 0; i < 241; i++) {
        presentation.info.description += 'a';
      }

      return presentation.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Presentation.remove().exec();
    User.remove().exec();
    done();
  });
});
