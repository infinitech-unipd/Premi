/**
 * Nome del file: manual.client.routes.js
 * Percorso: /public/modules/manual/config/manual.client.routes.js
 * Autore: InfiniTech
 * Data creazione: 2015-09-01
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('manual').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.

    // Manual state routing
    state('manual', {
      url: '/manual',
      templateUrl: 'modules/manual/views/manual.client.view.html'
    });
  }
]);
