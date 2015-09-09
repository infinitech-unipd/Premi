/**
 * Nome del file: nav.client.controller.js
 * Percorso: /public/modules/editor/controllers/nav.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-27
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-27 - Aggiunte funzioni scale() e refreshResolution() - Simone Campagna
 * 2015-08-16 - Modificata funzione di creazione canvas per proporzioni 4:3 - Simone Campagna
 * 2015-08-12 - Aggiunta scalatura 1:3 container - Simone Campagna
 * 2015-08-09 - Rimosso metodo getContainer() e corretti moveContainerUp() e
 *              moveContainerDown() - Simone Campagna
 * 2015-08-07 - Creati metodi moveContainerUp(), moveContainerDown() - Simone Campagna
 * 2015-08-05 - Creati metodi make(), removeContainer(), selectContainer(),
 *              save(), insertContainer(), getContainer() e getContainers() - Simone Campagna
 */

'use strict';

/**
 * @ngdoc controller
 * @name core.controller:NavController
 * @description Controller della side nav di editor.
 */
angular.module('editor').controller('NavController', [
  '$rootScope',
  '$scope',
  'Editor',
  function($rootScope, $scope, Editor) {
    var self = this;

    /**
     * Array di contenitori in formato JSON.
     * @type {Object}
     */
    $scope.containers = [];

    /**
     * Assume valore true se la presentazione è già stata inizializzata una
     *     volta.
     * @type {Object}
     */
    $scope.justInitialized = false;

    /**
     * Indice del contenitore attualmente selezionato.
     * @type {Object}
     */
    $scope.current = null;

    $rootScope.$on('editor:init', function() {
      $scope.getContainers();
    });

    $scope.$on('last', function() {
      if (!$scope.justInitialized) {
        $scope.justInitialized = true;
        $scope.selectContainer(0);
      }
    });

    $rootScope.$on('editor:resolution', function(event, oldResolution, newResolution) {
      $scope.refreshResolution(oldResolution, newResolution);
    });

    /**
     * Costruisce un canvas non modificabile all'interno della barra laterale
     *     rappresentante il contenitore di posizione index della presentazione.
     *
     * @param {Integer} index - La posizione del contenitore nel cammino.
     * @param {Object} oldResolution - La risoluzione precedente.
     * @param {Object} newResolution - La risoluzione attualmente selezionata.
     */
    $scope.make = function(index, oldResolution, newResolution) {
      var canvas = new fabric.StaticCanvas('container' + index);
      canvas.loadFromJSON($scope.containers[index], canvas.renderAll.bind(canvas));
      $scope.scale(canvas, index, oldResolution, newResolution);
    };

    /**
     * Scala il canvas attualmente selezionato e tutti i suoi oggetti in base
     * alla risoluzione scelta. Il metodo scala il contenitore sulla base del
     * parametro di presentazione productionWidth.
     * Se il contenitore in questione non è stato ancora scalato a quella
     * dimensione, viene di conseguenza scalato, altrimenti il fattore di
     * scalatura rimane neutro (pari a 1).
     *
     * @param {Object} canvas - Canvas da scalare.
     * @param {Number} index - Indice del contenitore.
     * @param {Object} oldResolution - Risoluzione precedente.
     * @param {Object} newResolution - Risoluzione attualmente selezionata.
     */
    $scope.scale = function(canvas, index, oldResolution, newResolution) {
      $scope.resolution = Editor.getResolution();
      $scope.productionWidth = Editor.getProductionWidth();

      // Imposta la larghezza della miniatura
      var newWidth = 180;
      var factor = newWidth / $scope.productionWidth;

      // Determina se modificare il fattore di scalatura in base al cambio di
      // risoluzione
      if (newResolution && (newResolution !== oldResolution)) {
        factor = (newResolution.width / oldResolution.width) / (newResolution.height / oldResolution.height);
      }

      // Imposta la grandezza del canvas
      canvas.setWidth(newWidth);
      canvas.setHeight((newWidth / $scope.resolution.width) * $scope.resolution.height);

      // Scala gli oggetti interni al canvas
      if (canvas.backgroundImage) {
        var bi = canvas.backgroundImage;
        bi.width = bi.width * factor; bi.height = bi.height * factor;
      }
      var objects = canvas.getObjects();
      for (var i in objects) {
        objects[i].scaleX *= factor;
        objects[i].scaleY *= factor;
        objects[i].left *= factor;
        objects[i].top *= factor;
        objects[i].setCoords();
      }
      canvas.renderAll();
      canvas.calcOffset();
    };

    /**
     * Riceve i contenitori della presentazione.
     *
     * @listens editor:init
     */
    $scope.getContainers = function() {
      $scope.containers = Editor.getContainers();
    };

    /**
     * Rimuove un contenitore.
     *
     * @param {Number} index - La posizione del contenitore nel cammino.
     */
    $scope.removeContainer = function(index) {
      $scope.containers.splice(index, 1);
      if (!$scope.containers.length) {
        $scope.insertContainer();
        $scope.selectContainer(0);
      } else if (index === $scope.current) {
        if (index > 0) {
          $scope.selectContainer(index - 1);
        } else {
          $scope.selectContainer(0);
        }
      }
    };

    /**
     * Seleziona un contenitore aggiornando la vista del canvas principale.
     *
     * @param {Number} index - La posizione del contenitore nel cammino.
     * @fires container:select
     */
    $scope.selectContainer = function(index) {
      $rootScope.$emit('container:select', index);
      $scope.current = index;
    };

    /**
     * Salva tutti i contenitori della presentazione.
     */
    $scope.save = function() {
      Editor.saveContainers($scope.containers);
    };

    /**
     * Inserisce un contenitore in coda al cammino e salva la presentazione.
     */
    $scope.insertContainer = function() {
      var canvas = new fabric.StaticCanvas('new', {backgroundColor: 'white'});
      $scope.containers.push(canvas.toJSON());
      $scope.save();
      $scope.selectContainer($scope.containers.length - 1);
    };

    /**
     * Sposta il container alla posizione precedente nel cammino e salva.
     *
     * @param {Number} index - La posizione del contenitore nel cammino.
     */
    $scope.moveContainerUp = function(index) {
      if (index !== 0) {
        var tmp = $scope.containers[index - 1];
        $scope.containers[index - 1] = $scope.containers[index];
        $scope.containers[index] = tmp;
        $scope.containers[index - 1].$index = index - 1;
        $scope.containers[index].$index = index;
        $scope.save();
        $scope.selectContainer(index - 1);
      }
    };

    /**
     * Sposta il container alla posizione successiva nel cammino e salva.
     *
     * @param {Number} index - La posizione del contenitore nel cammino.
     */
    $scope.moveContainerDown = function(index) {
      if (index !== $scope.containers.length - 1) {
        var tmp = $scope.containers[index + 1];
        $scope.containers[index + 1] = $scope.containers[index];
        $scope.containers[index + 1].$index = index + 1;
        $scope.containers[index] = tmp;
        $scope.containers[index].$index = index;
        $scope.save();
        $scope.selectContainer(index + 1);
      }
    };

    /**
     * Aggiorna l'aspect ratio della presentazione ricostruendo il contenitore
     *     principale.
     *
     * @param {Object} oldResolution - Risoluzione precedente della presentazione.
     * @param {Object} newResolution - Risoluzione nuova della presentazione.
     * @listens editor:resolution
     */
    $scope.refreshResolution = function(oldResolution, newResolution) {
      for (var i in $scope.containers) {
        $scope.make(i, oldResolution, newResolution);
      }
    };

    /**
     * Inizializza gli effetti della libreria grafica necessari.
     */
    self.ready = function() {
      $('.button-collapse').sideNav({
        menuWidth: 310
      });
    };

    $(document).ready(function() {
      self.ready();
    });
  }
]);
