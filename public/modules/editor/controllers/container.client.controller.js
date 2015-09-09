/**
 * Nome del file: container.client.controller.js
 * Percorso: /public/modules/editor/controllers/container.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-27
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-28 - Aggiunta funzione resize() - Simone Campagna
 * 2015-08-27 - Aggiunta funzione refreshResolution() - Simone Campagna
 * 2015-08-19 - Modificata funzione makeCanvas() - Simone Campagna
 * 2015-08-16 - Aggiunta funzione scale() - Simone Campagna
 * 2015-08-09 - Traslocati in MenuController i metodi per le modifiche sul
 *              canvas - Simone Campagna
 * 2015-28-07 - Creati metodi setFontStyle(), setFontWeight(), setColor(),
 *              setFontFamily(), setTextAlign() - Enrico Ceron
 * 2015-08-05 - Creati metodi makeCanvas(), addText(), removeObject(),
 *              addImageFromURL() e saveContainer() - Enrico Ceron
 */

'use strict';

/**
 * @ngdoc controller
 * @name editor.controller:ContainerController
 * @description Controller del contenitore principale in editing.
 */
angular.module('editor').controller('ContainerController', [
  '$rootScope',
  '$scope',
  'Editor',
  function($rootScope, $scope, Editor) {
    var self = this;

    /**
     * Canvas JSON attualmente caricato.
     * @type {Object}
     */
    $scope.container = {};

    /**
     * Indice del contenitore attualmente selezionato.
     * @type {Integer}
     */
    $scope.current = null;

    /**
     * Contenitore grafico sul quale è possibile eseguire i metodi di fabric.
     * @type {Object}
     */
    $scope.canvas = new fabric.Canvas('current-container');

    /**
     * Comunica se il container è stato inizializzato o meno.
     * @type {Object}
     */
    $scope.justInitialized = false;

    $rootScope.$on('container:select', function(event, index) {
      $scope.makeCanvas(index);
    });

    $rootScope.$on('editor:resolution', function(event, oldResolution, newResolution) {
      $scope.refreshResolution(oldResolution, newResolution);
    });

    /**
     * Scala il canvas attualmente selezionato e tutti i suoi oggetti in base
     *     alla risoluzione scelta. Il metodo scala la miniatura sulla base del
     *     parametro factor determinato dalla grandezza della miniatura e
     *     dall'eventuale risoluzione in esecuzione.
     *
     * @param {Object} oldResolution - Risoluzione precedente.
     * @param {Object} newResolution - Risoluzione attualmente selezionata.
     */
    $scope.scale = function(oldResolution, newResolution) {
      $scope.resolution = Editor.getResolution();
      $scope.productionWidth = Editor.getProductionWidth();

      // Imposta la larghezza del canvas principale
      var newWidth = $('editor-container').width() * 0.7;
      var factor = 1;

      // Determina se modificare il fattore di scalatura in base alla dimensione
      // del canvas
      if ($scope.container.scaleWidth !== $scope.productionWidth) {
        factor = newWidth / $scope.productionWidth;
        $scope.container.scaleWidth = $scope.productionWidth;
      }
      // Determina se modificare il fattore di scalatura in base al cambio di
      // risoluzione
      else if (newResolution && (newResolution !== oldResolution)) {
        factor = (oldResolution.width / newResolution.width) / (oldResolution.height / newResolution.height);
      }
      // Imposta la grandezza del canvas
      $scope.canvas.setWidth(newWidth);
      $scope.canvas.setHeight((newWidth / $scope.resolution.width) * $scope.resolution.height);

      // Scala gli oggetti interni al canvas
      if ($scope.canvas.backgroundImage) {
        var bi = $scope.canvas.backgroundImage;
        bi.width = bi.width * factor; bi.height = bi.height * factor;
      }
      var objects = $scope.canvas.getObjects();
      for (var i in objects) {
        objects[i].scaleX *= factor;
        objects[i].scaleY *= factor;
        objects[i].left *= factor;
        objects[i].top *= factor;
        objects[i].setCoords();
      }
      $scope.canvas.renderAll();
      $scope.canvas.calcOffset();
    };

    /**
     * Construisce il canvas con il contenuto del contenitore selezionato.
     *
     * @param {Integer} index - La posizione del contenitore nel cammino.
     * @listens container:select
     * @fires object:select
     */
    $scope.makeCanvas = function(index) {
      if (!$scope.justInitialized) {
        $scope.justInitialized = true;
        $scope.$apply();
      }
      $scope.current = index;
      $scope.container = Editor.getContainer(index);
      $scope.canvas.loadFromJSON($scope.container);
      $scope.canvas.overviewTop = $scope.container.overviewTop;
      $scope.canvas.overviewLeft = $scope.container.overviewLeft;
      $scope.canvas.overviewAngle = $scope.container.overviewAngle;
      $scope.canvas.overviewScale = $scope.container.overviewScale;
      $scope.canvas.scaleWidth = $scope.container.scaleWidth;
      $scope.scale();
      $scope.canvas.on('mouse:up', function() {
        $scope.saveContainer();
        $rootScope.$emit('object:select', $scope.canvas.getActiveObject());
      });
    };

    /**
     * Salva il contenitore attualmente selezionato nella presentazione caricata
     *     in locale.
     */
    $scope.saveContainer = function() {
      // Aggiorna il contenitore inserendo le informazioni extra necessarie per l'overview
      $scope.container = $scope.canvas.toJSON([
        'overviewTop',
        'overviewLeft',
        'overviewAngle',
        'overviewScale',
        'scaleWidth'
      ]);

      Editor.saveContainer($scope.container, $scope.current);
    };

    /**
     * Aggiorna la risoluzione della presentazione ricostruendo il container
     *     principale con per la nuova risoluzione.
     *
     * @param {Object} oldResolution - Risoluzione precedente della presentazione.
     * @param {Object} newResolution - Risoluzione nuova della presentazione.
     * @listens editor:resolution
     */
    $scope.refreshResolution = function(oldResolution, newResolution) {
      $scope.scale(oldResolution, newResolution);
    };

    /**
     * Adatta le dimensioni del canvas principale al ridimensionamento della
     *     finestra.
     */
    self.resize = function() {
      $scope.makeCanvas($scope.current);
    };

    $(window).resize(function() {
      self.resize();
    });
  }
]);
