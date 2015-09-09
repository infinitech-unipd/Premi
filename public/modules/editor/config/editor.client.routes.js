/**
 * Nome del file: editor.client.routes.js
 * Percorso: /public/modules/editor/config/editor.client.routes.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-27
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('editor').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.

      // Editor state routing
      state('editor', {
        url: '/editor/:presentationId',
        templateUrl: 'modules/editor/views/editor.client.view.html'
      }).

      // Overview state routing
      state('overview', {
        url: '/overview/:presentationId',
        templateUrl: 'modules/editor/views/overview.client.view.html'
      });
  }
]);
