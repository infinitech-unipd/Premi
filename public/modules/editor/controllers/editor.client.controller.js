/**
 * Nome del file: editor.client.controller.js
 * Percorso: /public/modules/editor/controllers/editor.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-24
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-07-24 - Creato metodo init() - Simone Campagna
 */

'use strict';

angular.module('editor').controller('EditorController', [
  '$stateParams',
  '$rootScope',
  '$scope',
  'Editor',
  function($stateParams, $rootScope, $scope, Editor) {
    var self = this;

    $rootScope.requireHeader = false;
    $rootScope.requireFooter = false;

    /**
     * Inizializza l'ambiente editor.
     */
    $scope.init = function() {
      Editor.init($stateParams.presentationId);
    };

    self.ready = function() {
    };

    $(document).ready(function() {
      self.ready();
    });
  }
]);
