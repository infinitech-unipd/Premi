/**
 * Nome del file: presentations.client.controller.js
 * Percorso: /public/modules/presentations/controllers/presentations.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-20
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-20 - Creati metodi init() e modal() - Simone Campagna
 */

'use strict';

/**
 * @ngdoc controller
 * @name presentation.controller:PresentationController
 * @description Controller relativo le presentazioni pubbliche del servizio.
 */
angular.module('presentations').controller('PresentationsController', [
  '$scope',
  '$rootScope',
  'Presentations',
  function($scope, $rootScope, Presentations) {

    $rootScope.requireHeader = true;
    $rootScope.requireFooter = true;

    /**
     * Presentazione attualmente selezionata.
     * @type {Object}
     */
    $scope.selected = null;

    /**
     * Eventuali messaggi d'errore.
     * @type {Object[]}
     */
    $scope.error = null;

    /**
     * Lista delle presentazioni pubbliche.
     * @type {Object[]}
     */
    $scope.presentations = null;

    /**
     * Preleva le presentazioni pubbliche dal database.
     */
    $scope.init = function() {
      Presentations.getPublicPresentations().success(function(res) {
        $scope.presentations = res;
      }).error(function(err) {
        $scope.error = err.message;
      });
    };

    /**
     * Apre una finestra di dialogo del tipo richiesto.
     *
     * @param {String} type - Tipo della richiesta.
     * @param {Object} presentation - La presentazione da aggiornare.
     */
    $scope.modal = function(type, presentation) {
      $scope.selected = presentation;
      $('#modal' + type).openModal({dismissible: false});
    };
  }
]);
