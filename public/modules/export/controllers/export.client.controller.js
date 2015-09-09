/**
 * Nome del file: export.client.controller.js
 * Percorso: /public/modules/export/controllers/export.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-19
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-27 - Modificata funzione make() e aggiunta addToPDF() - Simone Campagna
 * 2015-08-20 - Inserita scalatura canvas al resize della pagina - Simone Campagna
 * 2015-08-17 - Creati metodi init(), make() e download() - Simone Campagna
 */

'use strict';

/**
 * @ngdoc controller
 * @name editor.controller:ExportController
 * @description Controller relativo al modulo per l'esportazione della presentazione in pdf.
 */
angular.module('export').controller('ExportController', [
  '$location',
  '$rootScope',
  '$scope',
  '$stateParams',
  'Player',
  function($location, $rootScope, $scope, $stateParams, Player) {
    var self = this;

    $rootScope.requireHeader = true;
    $rootScope.requireFooter = false;

    /**
     * Slide da stampare.
     * @type {Object}
     */
    $scope.containers = null;

    /**
     * Dimensione di produzione necessaria per la scalatura.
     * @type {Object}
     */
    $scope.productionWidth = null;

    /**
     * Oggetto jsPDF al quale è possibile appendere oggetti.
     * @type {Object}
     */
    var pdf = new jsPDF('l', 'pt', 'a4');

    /**
     * Nasconde componenti grafiche della pagina non necessarie.
     */
    self.ready = function() {
      $('footer').addClass('hide');
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
     * Inizializza i contenitori per l'esportazione.
     */
    $scope.init = function() {
      Player.init().success(function(res) {
        $scope.containers = res.containers;
        $scope.productionWidth = res.productionWidth;
        $scope.resolution = res.resolution;
      }).error(function(err) {
        //TODO messaggio di errore
      });
    };

    /**
     * Crea i canvas dei contenitori mostrandone un'anteprima.
     *
     * @param {Number} index - Indice del contenitore da creare.
     */
    $scope.make = function(index) {
      var canvas = new fabric.StaticCanvas('container' + index);
      canvas.loadFromJSON($scope.containers[index], canvas.renderAll.bind(canvas));

      var newWidth = $('#path').width() * 0.6;
      var factor = newWidth / $scope.productionWidth;

      canvas.setWidth(newWidth);
      canvas.setHeight((newWidth / $scope.resolution.width) * $scope.resolution.height);

      if (canvas.backgroundImage) {
        // Need to scale background images as well
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
      $scope.addToPDF(canvas, index);
    };

    /**
     * Aggiunge i canvas al PDF sulla base della risoluzione con la quale la
     *     presentazione è stata creata.
     *
     * @param {Object} canvas - Canvas da inserire nel PDF.
     * @param {Number} index - Indice del contenitore nella presentazione.
     */
    $scope.addToPDF = function(canvas, index) {
      // Aggiunge le slide al PDF
      var imgData = canvas.toDataURL('image/jpeg');
      if ($scope.resolution.width === 4) {
        pdf.addImage(imgData, 'JPEG', 121.8, 76.475, 598.4, 442.05);
      } else {
        pdf.addImage(imgData, 'JPEG', 121.8, 129.2, 598.4, 336.6);
      }
      if ($scope.containers.length - 1 > index) {
        pdf.addPage();
      }
    };

    /**
     * Avvia il download del PDF contenente la presentazione.
     */
    $scope.download = function() {
      pdf.save($scope.title);
    };

    /**
     * Ricostruisce le eventuali miniature relative l'anteprima di stampa.
     */
    self.resize = function() {
      for (var i in $scope.containers) {
        $scope.make(i);
      }
    };

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
