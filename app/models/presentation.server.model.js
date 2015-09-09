/**
 * Nome del file: presentation.server.model.js
 * Percorso: /app/models/presentation.server.model.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-13
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-27 - Aggiunto attributo resolution - Simone Campagna
 * 2015-08-19 - Aggiunti productionWidth e overviewWidth - Simone Campagna
 * 2015-08-12 - Creato metodo setUpdated() - Enrico Ceron
 * 2015-07-13 - Definizione dello schema di Presentation - Enrico Ceron
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Valuta la lunghezza del titolo di una presentazione.
 *
 * @memberOf Presentation
 * @param {String} title - Il titolo della presentazione.
 * @returns {Boolean}
 */
var validateTitle = function(title) {
  return (title && title.length < 41);
};

/**
 * Valuta la lunghezza della descrizione di una presentazione.
 *
 * @memberOf Presentation
 * @param {String} description - La descrizione della presentazione.
 * @returns {Boolean}
 */
var validateDescription = function(description) {
  return (description.length < 241);
};

/**
 * Aggiorna l'attributo updated della presentazione con la data attuale.
 *
 * @memberOf Presentation
 * @param {Object} presentation - La presentazione modificata.
 */
var setUpdated = function(presentation) {
  presentation.info.updated = new Date();
};

/**
 * Classe che definisce gli oggetti di tipo presentazione.
 * @class
 * @name Presentation
 */
var PresentationSchema = new Schema({
  /**
   * L'autore della presentazione come riferimento alla collection User.
   * @memberOf Presentation
   * @type {Schema.ObjectId}
   */
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  /**
   * Contiene le informazioni principali della presentazione.
   * @memberOf Presentation
   * @type {Object}
   */
  info: {
    title: {
      type: String,
      trim: true,
      required: 'A presentation must have a title',
      validate: [validateTitle, 'The title should be shorter']
    },
    description: {
      type: String,
      trim: true,
      validate: [validateDescription, 'The description is too long']
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date
    },
    privacy: {
      type: Boolean,
      default: false
    }
  },
  /**
   * Contiene i contenitori della presentazione.
   * @memberOf Presentation
   * @type {Array}
   */
  containers: [
    {
      scaleWidth: {
        type: Number
      },
      overview: {
        type: Number
      },
      overviewTop: {
        type: Number
      },
      overviewLeft: {
        type: Number
      },
      overviewScale: {
        type: Number
      },
      overviewAngle: {
        type: Number
      },
      background: {
        type: String,
        default: '#fff'
      },
      objects: []
    }
  ],
  /**
   * Definisce il tema generale della presentazione.
   * @memberOf Presentation
   * @type {Object}
   */
  theme: {
    background: {
      type: String,
      default: '#fff'
    }
  },
  /**
   * La larghezza dei contenitori al momento della loro creazione.
   * @memberOf Presentation
   * @type {Number}
   */
  productionWidth: {
    type: Number
  },
  /**
   * La larghezza dello spazio dell'overview al momento della sua apertura.
   * @memberOf Presentation
   * @type {Number}
   */
  overviewWidth: {
    type: Number
  },
  /**
   * Definisce il rapporto (aspect ratio) dei contenitori.
   * @memberOf Presentation
   * @type {Object}
   */
  resolution: {
    width: {
      type: Number,
      default: 4
    },
    height: {
      type: Number,
      default: 3
    }
  }
}, {versionKey: false});

PresentationSchema.pre('save', function(done) {
  setUpdated(this);
  done();
});

mongoose.model('Presentation', PresentationSchema);
