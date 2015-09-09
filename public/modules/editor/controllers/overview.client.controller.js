/**
 * Nome del file: overview.client.controller.js
 * Percorso: /public/modules/editor/controllers/overview.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-17
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-09-02 - Aggiunte variabili miniaturesWidth, miniaturesHeight, isTracing,
 *              tracingWay, withoutPosition, modificate funzioni
 *              drawCanvasAsObject(), aggiunti metodi putInPosition(),
 *              arrange(), arrangeHorizontally(), arrangeVertically(),
 *              arrangeRandomly(), arrangeGrid(), return() - Simone Campagna
 * 2015-08-28 - Aggiunte variabili width e resolution aggiunte funzioni
 *              scaleObjects() e scaleCanvas() - Simone Campagna
 * 2015-08-17 - Creati metodi init(), load(), drawCanvasAsObject() - Simone Campagna
 */

'use strict';

/**
 * @ngdoc controller
 * @name core.controller:OverviewController
 * @description Controller dell'overview.
 */
angular.module('editor').controller('OverviewController', [
  '$rootScope',
  '$scope',
  '$location',
  '$stateParams',
  'Editor',
  function($rootScope, $scope, $location, $stateParams, Editor) {
    var self = this;

    /**
     * Contenitori della presentazione.
     * @type {Object[]}
     */
    $scope.containers = {};

    /**
     * Larghezza adottata per la produzione.
     * @type {Number}
     */
    $scope.width = null;

    /**
     * Risoluzione con la quale la presentazione è stata creata.
     * @type {Object}
     */
    $scope.resolution = {};

    /**
     * Larghezza miniature.
     * @type {Number}
     */
    $scope.miniaturesWidth = 150;

    /**
     * Altezza miniature.
     * @type {Number}
     */
    $scope.miniaturesHeight = null;

    /**
     * Contenitori senza una posizione pre-fissata.
     * @type {Object[]}
     */
    $scope.withoutPosition = [];

    $rootScope.$on('editor:init', function() {
      $scope.containers = Editor.getContainers();
      $scope.load();
    });

    /**
     * Inizializza l'ambiente dell'overview generando i canvas.
     */
    $scope.init = function() {
      if (Editor.getPresentationInfo() === undefined) {
        Editor.init();
      } else {
        $scope.containers = Editor.getContainers();
        $scope.load();
      }
    };

    /**
     * Crea l'overview con all'interno i container della presentazione.
     *
     * @listens editor:init
     */
    $scope.load = function() {
      $scope.resolution = Editor.getResolution();
      $scope.width = Editor.getProductionWidth();
      $scope.overview = new fabric.Canvas('over');
      $scope.overview.setWidth($('.overview-wrapper').width());
      $scope.overview.setHeight($('.overview-wrapper').height());
      $scope.drawCanvasAsObject();
    };

    /**
     * Disegna le slide nell'overview.
     */
    $scope.drawCanvasAsObject = function() {
      for (var i in $scope.containers) {
        var canvas = new fabric.Canvas();
        canvas.loadFromJSON($scope.containers[i]);
        $scope.scaleObjects(canvas);
        var imgData = canvas.toDataURL('image/jpeg');
        fabric.Image.fromURL(imgData, function(oImg) {
          oImg.set({
            stroke: '#424242',
            shadow: 'rgba(0,0,0,0.4) 5px 5px 7px'
          });
          oImg.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false
          });
          oImg.width = $scope.miniaturesWidth;
          $scope.miniaturesHeight =
            oImg.height =
            (oImg.width / $scope.resolution.width) * $scope.resolution.height;
          $scope.overview.add(oImg);
        });
      }
      setTimeout(function() {
        $scope.putInPosition();
      }, 5);
    };

    /**
     * Scala gli oggetti interni al canvas.
     *
     * @param {Object} canvas - Contenitore della presentazione.
     */
    $scope.scaleObjects = function(canvas) {
      var factor = canvas.width / $scope.width;
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
     * Dispone i contenitori della presentazione sullo spazio dell'overview.
     *     In caso vi fossero contenitori aggiuntivi e non ancora ordinati, essi
     *     verranno disposti secondo l'algoritmo di posizionamento prefissato.
     */
    $scope.putInPosition = function() {
      var objects = $scope.overview.getObjects();
      for (var i in objects) {
        var top;
        var left;
        var angle;
        var scale;
        top = left = angle = 0; scale = 1;
        if ($scope.containers[i].overviewTop === undefined) {
          $scope.withoutPosition = $scope.withoutPosition.concat(objects[i]);
        } else {
          top = $scope.containers[i].overviewTop;
          left = $scope.containers[i].overviewLeft;
          angle = $scope.containers[i].overviewAngle;
          scale = $scope.containers[i].overviewScale;
        }
        objects[i].angle = angle;
        objects[i].left = left;
        objects[i].top = top;
        objects[i].scaleX = scale;
        objects[i].scaleY = scale;
        objects[i].setCoords();
      }
      if ($scope.withoutPosition.length) {
        $scope.arrange('horrizontal', $scope.withoutPosition);
      }
      $scope.overview.calcOffset();
      $scope.overview.renderAll();
    };

    /**
     * Memorizza tutte le proprietà relative all'effettistica.
     */
    $scope.traceStates = function() {
      var objects = $scope.overview.getObjects();
      for (var i in objects) {
        $scope.containers[i].overviewTop = objects[i].top;
        $scope.containers[i].overviewLeft = objects[i].left;
        $scope.containers[i].overviewAngle = objects[i].angle;
        $scope.containers[i].overviewScale =  objects[i].scaleX;
      }
    };

    /**
     * Arrangia i contenitori scalandoli alle dimensioni minime stabilite dalla
     *     variabile $scope.miniaturesWidth e dispone i contenitori secondo lo
     *     schema definito dal paramero type.
     *
     * @param {String} type - Tipo di arrangiamento richiesto.
     * @param {Array} partials - Array costituito dai contenitori aggiunti post ordinamento.
     */
    $scope.arrange = function(type, partials) {
      var objects = $scope.overview.getObjects();
      for (var i in objects) {
        objects[i].scaleX = 1;
        objects[i].scaleY = 1;
        objects[i].angle = 0;
        objects[i].setCoords();
      }
      if (partials) {
        objects = partials;
      } else {
        objects = $scope.overview.getObjects();
      }
      switch (type) {
        case('horrizontal'):
          $scope.arrangeHorizontally(objects);
          break;
        case('vertical'):
          $scope.arrangeVertically(objects);
          break;
        case('grid'):
          $scope.arrangeGrid(objects);
          break;
        case('random'):
          $scope.arrangeRandomly(objects);
          break;
      }
      $scope.overview.calcOffset();
      $scope.overview.renderAll();
    };

    /**
     * Dispone i contenitori della presentazione orrizontalmente.
     *
     * @param {Array} objects - Contenitori della presentazione.
     */
    $scope.arrangeHorizontally = function(objects) {
      var r = 0; var c = -1;
      for (var i in objects) {
        if (($scope.overview.getWidth() / ((c + 1) * $scope.miniaturesWidth)) >= 1) {
          c++;
        } else {
          r++;
          c = 0;
        }
        objects[i].left = c * $scope.miniaturesWidth;
        objects[i].top = r * $scope.miniaturesHeight;
        objects[i].setCoords();
      }
    };

    /**
     * Dispone i contenitori della presentazione verticalmente.
     *
     * @param {Array} objects - Contenitori della presentazione.
     */
    $scope.arrangeVertically = function(objects) {
      var c = 0; var r = -1;
      for (var i in objects) {
        if (($scope.overview.getHeight() / ((r + 1) * $scope.miniaturesHeight)) >= 1) {
          r++;
        } else {
          c++;
          r = 0;
        }
        objects[i].left = c * $scope.miniaturesWidth;
        objects[i].top = r * $scope.miniaturesHeight;
        objects[i].setCoords();
      }
    };

    /**
     * Dispone i contenitori della presentazione casualmente.
     *
     * @param {Array} objects - Contenitori della presentazione.
     */
    $scope.arrangeRandomly = function(objects) {
      var maxWidth = Math.floor($scope.overview.getWidth() / $scope.miniaturesWidth);
      var maxHeight = Math.floor($scope.overview.getHeight() / $scope.miniaturesHeight);
      var min = 0;
      for (var i in objects) {
        var r = Math.floor(Math.random() * (maxWidth - min)) + min;
        var c = Math.floor(Math.random() * (maxHeight - min)) + min;
        objects[i].left = c * $scope.miniaturesWidth;
        objects[i].top = r * $scope.miniaturesHeight;
        objects[i].setCoords();
      }
    };

    /**
     * Dispone i contenitori della presentazione in griglia di dimensione
     *     prefissata.
     *
     * @param {Array} objects - Contenitori della presentazione.
     */
    $scope.arrangeGrid = function(objects) {
      var numberForRow = 4;
      var r = 0; var c = -1;
      for (var i in objects) {
        if (c < numberForRow) {
          c++;
        } else {
          r++;
          c = 0;
        }
        objects[i].left = c * $scope.miniaturesWidth;
        objects[i].top = r * $scope.miniaturesHeight;
        objects[i].setCoords();
      }
    };

    /**
     * Ritorna all'editor salvando le modifiche effettuate sulla base del
     *     parametro saving passato come parametro.
     *
     * @param {Boolean} saving - Definisce se salvare o meno le modifiche
     *     effettuate.
     */
    $scope.return = function(saving) {
      if (saving) {
        $scope.traceStates();
        Editor.saveOverviewWidth($scope.overview.getWidth());
        Editor.saveContainers($scope.containers);
        Editor.savePresentation().success(function() {
          $location.path('/editor/' + $stateParams.presentationId);
        }).error(function(err) {
          //TODO messaggio di errore
        });
      }
      $location.path('/editor/' + $stateParams.presentationId);
    };

    /**
     * Inizializza gli effetti della libreria grafica e nasconde eventuali
     *     moduli grafici non richiesti.
     */
    self.ready = function() {
      $('header').addClass('hide');
      $('footer').addClass('hide');
      $('.overview-wrapper').css('height', $('body').height() - $('header').height());
      Materialize.showStaggeredList('#staggered-test');
    };

    /**
     * Ridimensiona l'overiew al ridimensionamento della finestra del browser.
     */
    self.resize = function() {
      $scope.overview.setWidth($('.overview-wrapper').width());
      $scope.overview.setHeight($('.overview-wrapper').height());
    };

    $(document).ready(function() {
      self.ready();
    });

    $(window).on('resize', function() {
      self.resize();
    });
  }
]);
