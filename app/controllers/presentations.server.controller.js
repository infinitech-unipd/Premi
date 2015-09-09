/**
 * Nome del file: presentations.server.controller.js
 * Percorso: /app/controllers/presentations.server.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-16
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-20 - Modificate update(), listByAuthor() e presentationById() - Simone Campagna
 * 2015-07-31 - Modificati metodi delete(), update() e findOne() dopo la
 *              creazione del middleware presentationById() - Enrico Ceron
 * 2015-07-24 - Creato medoto findOne() - Simone Campagna
 * 2015-07-20 - Creati metodi delete() e update() - Simone Campagna
 * 2015-07-16 - Creati metodi create(), listByAuthor() e isAuthor() - Enrico Ceron
 */

'use strict';

var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var Presentation = mongoose.model('Presentation');
var _ = require('lodash');

/**
 * @module PresentationsController
 */

/**
 * Crea una nuova presentazione con autore l'utente che effettua la richiesta.
 *
 * @param {Object} req - `req.user` contiene l'utente autenticato, `req.body`
 *     contiene una nuova presentazione.
 * @param {Object} res - In caso di successo la presentazione appena creata,
 *     altrimenti un messaggio di errore 400.
 */
exports.create = function(req, res) {
  var presentation = new Presentation(req.body);
  presentation.author = req.user;
  presentation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(presentation);
    }
  });
};

/**
 * Cerca le presentazioni con autore l'utente che effettua la richiesta.
 *
 * @param {Object} req - `req.user` contiene l'utente autenticato.
 * @param {Object} res - In caso di successo l'array di presentazioni,
 *     altrimenti un messaggio di errore 400.
 */
exports.listByAuthor = function(req, res) {
  Presentation.find({author: req.user}, {info: 1}).sort('-created')
    .exec(function(err, presentations) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(presentations);
      }
    });
};

/**
 * Cerca le presentazioni pubbliche all'interno del database.
 *
 * @param {Object} req - `req.user` contiene l'utente autenticato.
 * @param {Object} res - In caso di successo l'array di presentazioni,
 *     altrimenti un messaggio di errore 400.
 */
exports.listPublic = function(req, res) {
  Presentation.find({'info.privacy': false}, {info: 1, author: 1})
    .populate('author', 'username').sort('-created')
    .exec(function(err, presentations) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(presentations);
      }
    });
};

/**
 * Rimuove una presentazione dal database.
 *
 * @param {Object} req - `req.presentation` contiene la presentazione da
 *     rimuovere.
 * @param {Object} res - In caso di successo la presentazione appena rimossa,
 *     altrimenti un messaggio di errore 400.
 */
exports.delete = function(req, res) {
  var presentation = req.presentation;
  presentation.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(presentation);
    }
  });
};

/**
 * Aggiorna una presentazione già presente nel database.
 *
 * @param {Object} req - `req.presentation` contiene la presentazione da
 *     aggiornare, `req.body` contiene la stessa presentazione già aggiornata.
 * @param {Object} res - In caso di successo la presentazione appena aggiornata,
 *     altrimenti un messaggio di errore 400.
 */
exports.update = function(req, res) {
  var presentation = req.presentation;
  presentation = _.extend(presentation, req.body);
  presentation.save(function(err) {
    if (err) {
      console.log('****************** ERR ', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(presentation);
    }
  });
};

/**
 * Restituisce la presentazione richiesta dal client.
 *
 * @param {Object} req - `req.presentation` contiene la presentazione da
 *     restituire.
 * @param {Object} res - La presentazione oggetto della richiesta.
 */
exports.findOne = function(req, res) {
  res.json(req.presentation);
};

/**
 * Middleware per verificare che l'utente sia autore della presentazione.
 *
 * @param {Object} req - `req.user` contiene l'utente autenticato.
 * @param {Object} res - Un eventuale messaggio di errore 403.
 * @param {Function} next - Callback.
 */
exports.isAuthor = function(req, res, next) {
  if ((req.presentation.author).toString() !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};

/**
 * Ricerca la presentazione passata come parametro e la inietta nell'oggetto
 *     request.
 *
 * @param {Object} req - Richiesta HTTP.
 * @param {Object} res - Un eventuale messaggio di errore 400 o 404.
 * @param {Function} next - Callback.
 * @param {mongoose.Types.ObjectId} id - Id della presentazione in URL.
 */
exports.presentationById = function(req, res, next, id) {

  if (req.url !== 'presentation/public') {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Presentation is invalid'
      });
    }

    Presentation.findById(id).exec(function(err, presentation) {
      if (err) {
        return res.status(404).send({
          message: 'Presentation not found'
        });
      }
      req.presentation = presentation;
      next();
    });
  } else {

    next();
  }
};
