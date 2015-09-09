/**
 * Nome del file: player.client.controller.js
 * Percorso: /public/modules/player/controllers/player.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-10
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-31 - Aggiunte funzioni next() e prev() - Simone Campagna
 * 2015-08-27 - Aggiunti metodi makeAdapter(), refreshResolution(), ready() e
 *              resize() - Simone Campagna
 * 2015-08-26 - Aggiunta funzione fullscreen() - Simone Campagna
 * 2015-08-16 - Aggiunta funzione make() - Simone Campagna
 * 2015-08-13 - Creato metodo scale() - Simone Campagna
 * 2015-08-10 - Creazione del metodo init() - Simone Campagna
 */

'use strict';

/**
 * @ngdoc controller
 * @name player.controller:PlayerController
 * @description Controller del player.
 */
angular.module('player').controller('PlayerController', [
  '$scope',
  '$location',
  '$rootScope',
  '$stateParams',
  'Player',
  function($scope, $location, $rootScope, $stateParams, Player) {
    var self = this;

    $rootScope.requireHeader = false;
    $rootScope.requireFooter = false;

    /**
     * Contenitori della presentazione.
     * @type {Object[]}
     */
    $scope.containers = {};

    /**
     * Larghezza per l'adattamento della presentazione.
     * @type {Number}
     */
    $scope.width = null;

    /**
     * Errori incorsi durante il caricamento della presentazione.
     * @type {Object}
     */
    $scope.error = {};

    /**
     * Aspect ratio (4:3, 16:9) della presentazione.
     * @type {Object}
     */
    $scope.resolution = null;

    /**
     * Dimensione del canvas della presentazione. Important!
     * @type {Number}
     */
    $scope.canvasSize = $('div.ng-scope').width() * 0.70;

    /**
     * Inizializza il player richiedendo la presentazione al server e
     *     generando i canvas.
     */
    $scope.init = function() {
      Player.init().success(function(res) {
        $scope.containers = res.containers;
        $scope.width = res.productionWidth;
        $scope.resolution = res.resolution;
      }).error(function(err) {
        $scope.error = err;
      });
    };

    /**
     * Crea un contenitore con la risoluzione passata a parametro.
     *
     * @param {Number} index - Indice della slide da creare.
     * @param {Object} resolution - Nuova risoluzione a cui adattare la
     *     presentazione.
     */
    $scope.make = function(index, resolution) {
      var slide = new fabric.StaticCanvas('container' + index);
      slide.loadFromJSON($scope.containers[index], slide.renderAll.bind(slide));
      $scope.scale(slide, resolution);
    };

    /**
     * Scala gli oggetti interni al canvas in base alla sua grandezza.
     *
     * @param {Object} slide - Canvas grafico da scalare.
     * @param {Object} newResolution - Nuova risoluzione con cui rappresentare
     *     le slide.
     */
    $scope.scale = function(slide, newResolution) {
      // Rapporto tra la larghezza di editing e quella attuale
      var newWidth = $('div.ng-scope').width() * 0.70;
      $scope.canvasSize = $('div.ng-scope').width() * 0.70;
      var factor;
      if (newResolution) {
        factor = ($scope.resolution.width / newResolution.width) / ($scope.resolution.height / newResolution.height);
        $scope.resolution = newResolution;
      } else {
        factor = newWidth / $scope.width;
      }

      // Imposta le dimensioni del canvas
      slide.setWidth(newWidth);
      slide.setHeight((newWidth / $scope.resolution.width) * $scope.resolution.height);

      // Scala gli oggetti e l'immagine di sfondo del contenitore
      if (slide.backgroundImage) {
        var bi = slide.backgroundImage;
        bi.width = bi.width * factor;
        bi.height = bi.height * factor;
      }
      var objects = slide.getObjects();
      for (var i in objects) {
        objects[i].scaleX *= factor;
        objects[i].scaleY *= factor;
        objects[i].left *= factor;
        objects[i].top *= factor;
        objects[i].setCoords();
      }
      slide.renderAll();
      slide.calcOffset();
    };

    /**
     * Crea l'adapter per il framework Impress.js.
     */
    $scope.makeAdapter = function() {
      $scope.Adapter = window.impress();
      // Definizione metodo fullscreen per l'Adaptee impress
      $scope.Adapter.fullscreen = function() {
        var elem = document.getElementById('impress');
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
      };
      try {

        $scope.Adapter.init();
      } catch (err) {
        console.log(err);
      }
    };

    /**
     * Mostra la presentazione in fullscreen.
     */
    $scope.fullscreen = function() {
      $scope.Adapter.fullscreen();
    };

    /**
     * Avanza di un contenitore la presentazione.
     */
    $scope.next = function() {
      $scope.Adapter.next();
    };

    /**
     * Retrocede di un contenitore la presentazione.
     */
    $scope.prev = function() {
      $scope.Adapter.prev();
    };

    /**
     * Aggiorna la risoluzione della presentazione su richiesta dell'utente.
     *
     * @param {Object} newResolution - Nuova risoluzione con cui rappresentare i
     *     contenitori.
     */
    $scope.refreshResolution = function(newResolution) {
      for (var i in $scope.containers) {
        $scope.make(i, newResolution);
      }
    };

    /**
     * Permette di eseguire al caricamento completo della struttura di
     *     pagina delle operazioni  necessarie per l'avvio della libreria
     *     grafica o eventualmente altre operazioni richieste.
     */
    self.ready = function() {
    };

    /**
     * Permette di eseguire al ridimensionamento della finestra, le
     *     operazioni necessarie per il ridimensionamento delle slide della
     *     presentazione.
     */
    self.resize = function() {
      for (var i in $scope.containers) {
        $scope.make(i);
      }
    };

    /**
     * Si attiva al termine del caricamento del DOM di pagina.
     *
     * @listens document:ready
     */
    $(document).ready(function() {
      self.ready();
    });

    /**
     * Si attiva al ridimensionamento della finestra del browser.
     *
     * @listens window:resize
     */
    $(window).resize(function() {
      self.resize();
    });
  }
]);
