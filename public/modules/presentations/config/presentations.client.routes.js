/**
 * Nome del file: presentations.client.routes.js
 * Percorso: /public/modules/presentations/presentations.client.routes.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-20
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('presentations').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    // Public presentation state route
    $stateProvider.
      state('public', {
        url: '/presentations',
        templateUrl: 'modules/presentations/views/presentations.client.view.html'
      });
  }
]);
