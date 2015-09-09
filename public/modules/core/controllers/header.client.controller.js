/**
 * Nome del file: header.client.controller.js
 * Percorso: /public/modules/core/controllers/header.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-07
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-25 - Modificato evento ready implementando funzione per permettere il testing - Simone Campagna
 */

'use strict';

/**
 * @ngdoc controller
 * @name core.controller:HeaderController
 * @description Controller della navbar.
 */
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  function($scope, Authentication) {
    var self = this;

    /**
     * Utente attualmente autenticato.
     * @type {Object}
     */
    $scope.authentication = Authentication;

    /**
     * Inizializza gli effetti della libreria grafica ed ulteriori operazioni necessarie
     */
    self.ready = function() {
      // Abilita i menu dropdown
      $('.dropdown-button').dropdown({
        hover: false,
        belowOrigin: true
      });

      // Abilita la chiusura del menu al click in modalità mobile
      $('.button-collapse').sideNav({
        closeOnClick: true
      });
    };

    /**
     * Si attiva al termine del caricamento del DOM di pagina
     *
     * @listens document:ready
     */
    $(document).ready(function() {
      self.ready();
    });
  }
]);
