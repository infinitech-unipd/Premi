/**
 * Nome del file: menu.client.controller.js
 * Percorso: /public/modules/editor/controllers/menu.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-27
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-17 - Create funzioni print() e overview() - Simone Campagna
 * 2015-08-10 - Aggiunta funzione play() - Simone Campagna
 * 2015-08-09 - Creato metodo save() e traslocati i metodi di modifica degli
 *              oggetti del container in ContainerController - Simone Campagna
 * 2015-08-07 - Creati metodi getInfo(), modal(), update(), objectType(),
 *              removeObject(), setFontStyle(), setFontWeight(), setColor(),
 *              setFontFamily(), setTextAlign(), setBackground() - Enrico Ceron
 */

'use strict';

/**
 * @ngdoc controller
 * @name editor.controller:MenuController
 * @description Controller relativo al menu dell'editor.
 */
angular.module('editor').controller('MenuController', [
  '$rootScope',
  '$scope',
  '$window',
  'Editor',
  '$stateParams',
  '$location',
  function($rootScope, $scope, $window, Editor, $stateParams, $location) {

    /**
     * Presentazione attualmente in editing.
     * @type {Object}
     */
    $scope.presentation = {};

    /**
     * Oggetto attualmente selezionato nel container.
     * @type {Object}
     */
    $scope.object = {};

    /**
     * Denota l'effettiva selezione o meno di un oggetto nel container.
     * @type {Object}
     */
    $scope.object.select = null;

    /**
     * Informazioni della presentazione aggiornate ma non ancora salvate.
     * @type {Object}
     */
    $scope.updateInfo = {};

    /**
     * Utente attualmente autenticato.
     * @type {Object}
     */
    $scope.resolution = null;

    $rootScope.$on('editor:init', function() {
      $scope.getInfo();
    });

    $rootScope.$on('container:select', function() {
      $('.dropdown-button').dropdown({
          hover: false,
          belowOrigin: true
        }
      );
    });

    $rootScope.$on('object:select', function(event, object) {

      // Salva l'oggetto selezionato in object.select
      $scope.object.select = object;
      $scope.$apply();

      $('.dropdown-button').dropdown({
          hover: false,
          belowOrigin: true
        }
      );
    });

    /**
     * Verifica che il tipo dell'oggetto selezionato all'interno del contenitore
     *     sia uguale al tipo passato a parametro.
     *
     * @param {String} type - Tipo dell'oggetto.
     * @returns {Boolean}
     */
    $scope.objectType = function(type) {
      if (!$scope.canvas) {
        return false;
      }
      if ($scope.canvas.getActiveObject()) {
        return $scope.canvas.getActiveObject().get('type') === type;
      }
    };

    /**
     * Rimuove l'oggetto attualmente selezionato nel contenitore in visione.
     */
    $scope.removeObject = function() {
      $scope.canvas.remove($scope.canvas.getActiveObject());
      $scope.saveContainer();
    };

    /**
     * Cambia il font del testo selezionato.
     *
     * @param {String} font - Il nome del font.
     */
    $scope.setFontFamily = function(font) {
      $scope.canvas.getActiveObject().setFontFamily(font);
      $scope.canvas.renderAll();
      $scope.saveContainer();
    };

    /**
     * Cambia l'allineamento del blocco di testo selezionato.
     *
     * @param {String} align - Tipo di allineamento del testo.
     */
    $scope.setTextAlign = function(align) {
      $scope.canvas.getActiveObject().setTextAlign(align);
      $scope.canvas.renderAll();
      $scope.saveContainer();
    };

    /**
     * Cambia lo stile del font del testo selezionato.
     *
     * @param {String} style - Stile del font.
     */
    $scope.setFontStyle = function(style) {
      $scope.canvas.getActiveObject().setFontStyle(style);
      $scope.canvas.renderAll();
      $scope.saveContainer();
    };

    /**
     * Cambia il peso del font del testo selezionato.
     *
     * @param {String} weight - Peso del font.
     */
    $scope.setFontWeight = function(weight) {
      $scope.canvas.getActiveObject().setFontWeight(weight);
      $scope.canvas.renderAll();
      $scope.saveContainer();
    };

    /**
     * Cambia il colore dell'oggetto selezionato.
     *
     * @param {String} color - Colore da assegnare all'oggetto.
     */
    $scope.setColor = function(color) {
      $scope.canvas.getActiveObject().setFill(color);
      $scope.canvas.renderAll();
      $scope.saveContainer();
    };

    /**
     * Cambia colore di sfondo del contenitore selezionato.
     *
     * @param {String} color - Colore di sfondo.
     */
    $scope.setBackgroundColor = function(color) {
      $scope.canvas.setBackgroundColor(color);
      $scope.canvas.renderAll();
      $scope.saveContainer();
    };

    /**
     * Richiede le informazioni della presentazione attualmente in modifica.
     *
     * @listens editor:init
     */
    $scope.getInfo = function() {
      $scope.presentation.info = Editor.getPresentationInfo();
      $scope.resolution = Editor.getResolution();
    };
    /**
     * Apre una finestra di dialogo relativa all'azione richiesta.
     *
     * @param {String} type - Il tipo di azione da eseguire.
     */
    $scope.modal = function(type) {
      $scope.updateInfo = JSON.parse(JSON.stringify($scope.presentation.info));
      $('#modal' + type).openModal({dismissible: false});
    };

    /**
     * Aggiorna le informazioni della presentazione.
     */
    $scope.update = function() {
      Editor.updatePresentationInfo($scope.updateInfo).success(function() {
        $scope.presentation.info = $scope.updateInfo;
        $scope.updateInfo = {};
        $('#modalUpdate').closeModal();
        $scope.error = null;
      }).error(function(err) {
        $scope.error = err.message;
      });
    };

    /**
     * Salva la presentazione modificata sul server.
     */
    $scope.save = function() {
      Editor.saveProductionWidth($('#current-container').width());
      Editor.savePresentation().success(function(res) {
        //TODO messaggio di avvenuto salvataggio
      }).error(function(err) {
        //TODO messaggio di errore
      });
    };

    /**
     * Riproduce la presentazione attualmente dopo averla salvata sul server.
     */
    $scope.play = function() {
      $scope.save();
      $window.open('/#!/player/' + $stateParams.presentationId);
    };

    /**
     * Apre una nuova scheda contenente l'anteprima di stampa della
     *     presentazione.
     */
    $scope.print = function() {
      $window.open('/#!/export/' + $stateParams.presentationId);
    };

    /**
     * Mostra l'overview della presentazione.
     */
    $scope.overview = function() {
      $scope.save();
      $location.path('/overview/' + $stateParams.presentationId);
    };

    /**
     * Cambia l'aspect ratio dei contenitori della presentazione.
     *
     * @param {Object} resolution - Aspect ratio della presentazione.
     */
    $scope.setPresentationResolution = function(resolution) {
      Editor.setResolution(resolution);
    };
  }
]);
