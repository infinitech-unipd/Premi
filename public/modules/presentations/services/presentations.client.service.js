/**
 * Nome del file: presentations.client.service.js
 * Percorso: /public/modules/presentations/services/presentations.client.service.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-16
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-20 - Aggiunto metodo getPublicPresentations() - Simone Campagna
 * 2015-07-27 - Aggiunto metodo findOne() - Simone Campagna
 * 2015-07-20 - Aggiunti metodi update() e delete() - Simone Campagna
 * 2015-07-16 - Aggiunti metodi getByAuthor() e create() - Simone Campagna
 */

'use strict';

/**
 * @ngdoc service
 * @name presentations.service:Presentations
 * @description Service del package omonimo che fornisce le principali operazioni per le presentazioni.
 */
angular.module('presentations').factory('Presentations', ['$http',
  function($http) {
    return {

      /**
       * Restituisce le presentazioni dell'utente attuale.
       *
       * @returns {HttpPromise}
       */
      getByAuthor: function() {
        return $http.get('/presentations');
      },

      /**
       * Prova ad inserire una nuova presentazione nel database.
       *
       * @param {Object} presentation - Una nuova presentazione.
       * @returns {HttpPromise}
       */
      create: function(presentation) {
        return $http.post('/presentations/create', presentation);
      },

      /**
       * Prova a rimuovere una presentazione dal database.
       *
       * @param {String} id - Id della presentazione da rimuovere.
       * @returns {HttpPromise}
       */
      delete: function(id) {
        return $http.delete('/presentations/' + id);
      },

      /**
       * Prova ad aggioranre una presentazione nel database.
       *
       * @param {Object} presentation - La presentazione da aggiornare.
       * @returns {HttpPromise}
       */
      update: function(presentation) {
        return $http.put('/presentations/' + presentation._id, presentation);
      },

      /**
       * Prova a cercare una singola presentazione e la restituisce.
       *
       * @param {String} id - Id della presentazione da cercare.
       * @returns {HttpPromise}
       */
      findOne: function(id) {
        return $http.get('/presentations/' + id);
      },

      /**
       * Restituisce tutte le presentazio pubbliche.
       *
       * @return {HttpPromise}
       */
      getPublicPresentations: function() {
        return $http.get('/presentations/public');
      }
    };
  }
]);
