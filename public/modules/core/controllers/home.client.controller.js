/**
 * Nome del file: home.client.controller.js
 * Percorso: /public/modules/core/controllers/home.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-16
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-12 - Creato metodo compareByUpdated() e aggiunto riordinamento array
 *              delle presentazioni ad ogni sua modifica - Enrico Ceron
 * 2015-07-20 - Aggiunti metodi delete() e update() - Simone Campagna
 * 2015-07-16 - Aggiunti metodi alert(), modalClose(), list() e create() - Simone Campagna
 */

'use strict';

/**
 * @ngdoc controller
 * @name core.controller:HomeController
 * @description Controller della homepage.
 */
angular.module('core').controller('HomeController', [
  '$resource',
  '$scope',
  '$rootScope',
  '$location',
  'Authentication',
  'Presentations',
  function($resource,
           $scope,
           $rootScope,
           $location,
           Authentication,
           Presentations) {
    var self = this;

    $rootScope.requireHeader = true;
    $rootScope.requireFooter = true;

    $scope.host = $location.host() + '/#!';

    /**
     * Utente attualmente autenticato.
     * @type {Object}
     */
    $scope.authentication = Authentication;

    /**
     * Raccolta di presentazioni dell'utente autenticato.
     * @type {Object[]}
     */
    $scope.presentations = {};

    /**
     * Messaggi d'errore.
     * @type {Object}
     */
    $scope.error = {};
    $scope.error.list = null;
    $scope.error.insert = null;
    $scope.error.remove = null;

    /**
     * Presentazione selezionata.
     * @type {Object}
     */
    $scope.selected = {};

    /** Presentazione in attesa di aggiornamento.
     * @type {Object}
     */
    $scope.updates = {};

    /**
     * Di supporto a `sort()`, confronta due presentazioni in base all'attributo
     *     updated.
     *
     * @param {Object} a - La prima presentazione da confrontare.
     * @param {Object} b - La seconda presentazione da confrontare.
     * @returns {Number}
     */
    var compareByUpdated = function(a, b) {
      if (a.info.updated > b.info.updated) {
        return -1;
      }
      if (a.info.updated < b.info.updated) {
        return 1;
      }
      return 0;
    };

    /**
     * Carica in locale le presentazioni dell'utente autenticato.
     */
    $scope.list = function() {
      Presentations.getByAuthor().success(function(res) {
        $scope.presentations = res;
        $scope.presentations.sort(compareByUpdated);
      }).error(function(err) {
        $scope.error.list = err.message;
      });
    };

    /**
     * Apre una finestra di dialogo in base al tipo di operazione da effettuare.
     *
     * @param {String} type - Il tipo di azione da eseguire.
     * @param {Object} presentation - La presentazione selezionata.
     */
    $scope.modal = function(type, presentation) {
      $scope.selected = presentation;
      if (type === 'Update') {
        $scope.updates = JSON.parse(JSON.stringify($scope.selected));
      }
      $('#modal' + type).openModal({dismissible: false});
    };

    /**
     * Chiude la finestra di dialogo del tipo indicato.
     *
     * @param {String} type - Il tipo di azione eseguita.
     */
    $scope.modalClose = function(type) {
      $('#modal' + type).closeModal();
      $('.lean-overlay').remove();
    };

    /**
     * Crea una nuova presentazione.
     */
    $scope.create = function() {
      var presentation = {info: $scope.info};
      Presentations.create(presentation).success(function(res) {
        $scope.info = {};
        $scope.presentations.push(res);
        $scope.presentations.sort(compareByUpdated);
        $scope.modalClose('Create');
      }).error(function(err) {
        $scope.error.insert = err.message;
      });
    };

    /**
     * Cancella la presentazione selezionata.
     */
    $scope.delete = function() {
      Presentations.delete($scope.selected._id).success(function() {
        for (var i in $scope.presentations) {
          if ($scope.presentations[i]._id === $scope.selected._id) {
            $scope.presentations.splice(i, 1);
          }
        }
        $scope.modalClose('Delete');
      }).error(function(err) {
        $scope.error.remove = err.message;
      });
    };

    /**
     * Aggiorna titolo, descrizione e privacy della presentazione selezionata.
     */
    $scope.update = function() {
      Presentations.update($scope.updates).success(function(res) {
        for (var i in $scope.presentations) {
          if ($scope.presentations[i]._id === $scope.selected._id) {
            $scope.presentations[i].info = res.info;
          }
        }
        $scope.presentations.sort(compareByUpdated);
        $scope.modalClose('Update');
      }).error(function(err) {
        $scope.error.update = err.message;
      });
    };

    /**
     * Inizializza gli effetti della libreria grafica e rimuove se presenti gli eventi
     *    del framework impress dal DOM.
     */
    self.ready = function() {
      $('.modal-trigger').leanModal();
      $('input#infoTitle').characterCounter();
      $('input#infoDescription').characterCounter();
      $('input#updatedInfoTitle').characterCounter();
      $('input#updatedInfoDescription').characterCounter();
    };

    /**
     * Si attiva al termine del caricamento del DOM di pagina.
     *
     * @listens document:ready
     */
    $(document).ready(function() {
      self.ready();
    });
  }
]);
