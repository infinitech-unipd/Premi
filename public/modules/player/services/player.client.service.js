/**
 * Nome del file: player.client.service.js
 * Percorso: /public/modules/player/services/player.client.service.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-20
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-20 - Creato metodo init() - Simone Campagna
 */

'use strict';

angular.module('player').factory('Player', ['$http', '$stateParams',
  function($http, $stateParams) {
    return {

      /**
       * Inizializza il player.
       *
       * @returns {HttpPromise}
       */
      init: function() {
        return $http.get('/player/' + $stateParams.presentationId);
      }
    };
  }
]);
