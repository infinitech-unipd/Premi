/**
 * Nome del file: player.client.routes.js
 * Percorso: /public/modules/player/config/player.client.routes.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-20
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('player').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    // Player state route
    $stateProvider.
      state('player', {
        url: '/player/:presentationId',
        templateUrl: 'modules/player/views/player.client.view.html'
      });
  }
]);
