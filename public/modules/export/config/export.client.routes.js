/**
 * Nome del file: editor.client.routes.js
 * Percorso: /public/modules/export/config/export.client.routes.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-25
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('export').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.

      // Export state routing
      state('export', {
        url: '/export/:presentationId',
        templateUrl: 'modules/export/views/export.client.view.html'
      });
  }
]);
