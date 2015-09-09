/**
 * Nome del file: presentation.server.routes.test.js
 * Percorso: /app/tests/presentation.server.routes.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-27
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-28 - Definiti test sulla ricezione di errori e operazioni delete - Enrico Ceron
 * 2015-08-27 - Definiti test sulle operazioni create, update e read - Enrico Ceron
 */

'use strict';

var should = require('should');
var request = require('supertest');
var app = require('../../server');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Presentation = mongoose.model('Presentation');
var agent = request.agent(app);

var credentials;
var user;
var presentation;

describe('Presentation CRUD tests', function() {
  beforeEach(function(done) {
    // Definisce le credenziali di accesso
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Crea un nuovo utente
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Salva l'utente nel DB e crea una nuova presentazione dell'utente
    user.save(function() {
      presentation = new Presentation({
        info: {
          title: 'Title',
          description: 'Very bad description.'
        }
      });

      done();
    });
  });

  it('should be able to save a presentation if logged in', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr) {
        if (signinErr) {
          done(signinErr);
        }
        var userId = user.id;

        agent.post('/presentations/create')
          .send(presentation)
          .expect(200)
          .end(function(presentationSaveErr, presentationSaveRes) {
            if (presentationSaveErr) {
              done(presentationSaveErr);
            }
            presentation = presentationSaveRes.body;

            (presentation.author).should.equal(userId);
            (presentation.info.title).should.match('Title');
            (presentation.info.description).should.match('Very bad description.');

            done();
          });
      });
  });

  it('should be able to get own presentations if logged in', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr) {
        if (signinErr) {
          done(signinErr);
        }

        agent.post('/presentations/create')
          .send(presentation)
          .expect(200)
          .end(function(presentationSaveErr) {
            if (presentationSaveErr) {
              done(presentationSaveErr);
            }

            agent.get('/presentations')
              .expect(200)
              .end(function(presentationSaveErr, presentationSaveRes) {
                presentationSaveRes.body.should.be.an.Array.with.lengthOf(1);

                done();
              });
          });
      });
  });

  it('should not be able to save a presentation if not logged in', function(done) {
    agent.post('/presentations/create')
      .send(presentation)
      .expect(401)
      .end(function(presentationSaveErr) {
        done(presentationSaveErr);
      });
  });

  it('should not be able to save a presentation if no title is provided', function(done) {
    presentation.info.title = '';

    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr) {
        if (signinErr) {
          done(signinErr);
        }

        agent.post('/presentations/create')
          .send(presentation)
          .expect(400)
          .end(function(presentationSaveErr, presentationSaveRes) {
            (presentationSaveRes.body.message).should.match('A presentation must have a title');

            done(presentationSaveErr);
          });
      });
  });

  it('should be able to update a presentation if signed in', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr) {
        if (signinErr) {
          done(signinErr);
        }

        agent.post('/presentations/create')
          .send(presentation)
          .expect(200)
          .end(function(presentationSaveErr, presentationSaveRes) {
            if (presentationSaveErr) {
              done(presentationSaveErr);
            }

            presentation = presentationSaveRes.body;
            presentation.info.title = 'WHY YOU GOTTA BE SO PREMI?';

            agent.put('/presentations/' + presentationSaveRes.body._id)
              .send(presentation)
              .expect(200)
              .end(function(presentationUpdateErr, presentationUpdateRes) {
                if (presentationUpdateErr) {
                  done(presentationUpdateErr);
                }

                (presentationUpdateRes.body._id).should.equal(presentationSaveRes.body._id);
                (presentationUpdateRes.body.info.title).should.match('WHY YOU GOTTA BE SO PREMI?');

                done();
              });
          });
      });
  });

  it('should be able to get a list of public presentations if not signed in', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr) {
        if (signinErr) {
          done(signinErr);
        }

        agent.post('/presentations/create')
          .send(presentation)
          .expect(200)
          .end(function(presentationSaveErr) {
            if (presentationSaveErr) {
              done(presentationSaveErr);
            }

            agent.get('/auth/signout')
              .end(function() {
                request(app).get('/presentations/public')
                  .end(function(req, res) {
                    res.body.should.be.an.Array.with.lengthOf(1);

                    done();
                  });
              });
          });
      });
  });

  it('should be able to get a private presentation if author is signed in', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr) {
        if (signinErr) {
          done(signinErr);
        }

        agent.post('/presentations/create')
          .send(presentation)
          .expect(200)
          .end(function(presentationSaveErr, presentationSaveRes) {
            if (presentationSaveErr) {
              done(presentationSaveErr);
            }

            agent.get('/presentations/' + presentationSaveRes.body._id)
              .end(function(presentationUpdateErr, presentationUpdateRes) {
                if (presentationUpdateErr) {
                  done(presentationUpdateErr);
                }

                (presentationUpdateRes.body._id).should.equal(presentationSaveRes.body._id);
                (presentationUpdateRes.body.info.title).should.match('Title');

                done();
              });
          });
      });
  });

  it('should return an error if presentation is invalid', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr) {
        if (signinErr) {
          done(signinErr);
        }

        agent.post('/presentations/create')
          .send(presentation)
          .expect(200)
          .end(function(presentationSaveErr) {
            if (presentationSaveErr) {
              done(presentationSaveErr);
            }

            agent.get('/auth/signout')
              .end(function() {
                request(app).get('/presentations/&')
                  .end(function(req, res) {
                    res.body.should.be.an.Object.with.property('message', 'Presentation is invalid');

                    done();
                  });
              });
          });
      });
  });

  it('should return an error if presentation does not exist', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr) {
        if (signinErr) {
          done(signinErr);
        }

        agent.post('/presentations/create')
          .send(presentation)
          .expect(200)
          .end(function(presentationSaveErr) {
            if (presentationSaveErr) {
              done(presentationSaveErr);
            }

            agent.get('/auth/signout')
              .end(function() {
                request(app).get('/presentations/aaaaaaaaaaaa')
                  .end(function(req, res) {
                    res.body.should.be.an.Object.with.property('message', 'Presentation not found');

                    done();
                  });
              });
          });
      });
  });

  it('should be able to delete an article if signed in', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr) {
        if (signinErr) {
          done(signinErr);
        }

        agent.post('/presentations/create')
          .send(presentation)
          .expect(200)
          .end(function(presentationSaveErr, presentationSaveRes) {
            if (presentationSaveErr) {
              done(presentationSaveErr);
            }

            agent.delete('/presentations/' + presentationSaveRes.body._id)
              .send(presentation)
              .expect(200)
              .end(function(presentationDeleteErr, presentationDeleteRes) {
                if (presentationDeleteErr) {
                  done(presentationDeleteErr);
                }

                (presentationDeleteRes.body._id).should.equal(presentationDeleteRes.body._id);

                done();
              });
          });
      });
  });

  it('should not be able to delete a presentation if not signed in', function(done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr) {
        if (signinErr) {
          done(signinErr);
        }

        agent.post('/presentations/create')
          .send(presentation)
          .expect(200)
          .end(function(presentationSaveErr, presentationSaveRes) {
            if (presentationSaveErr) {
              done(presentationSaveErr);
            }

            agent.get('/auth/signout')
              .end(function(signinErr) {
                if (signinErr) {
                  done(signinErr);
                }

                request(app).delete('/presentations/' + presentationSaveRes.body._id)
                  .expect(401)
                  .end(function(presentationDeleteErr, presentationDeleteRes) {
                    (presentationDeleteRes.body.message).should.match('User is not logged in');

                    done(presentationDeleteErr);
                  });
              });
          });
      });
  });

  afterEach(function(done) {
    User.remove().exec(function() {
      Presentation.remove().exec(done);
    });
  });
});
