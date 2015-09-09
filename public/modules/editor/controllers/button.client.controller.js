/**
 * Nome del file: button.client.controller.js
 * Percorso: /public/modules/editor/controllers/button.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-27
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-23 - Modificata funzione addShape() - Simone Campagna
 * 2015-08-20 - Aggiunta funzione addShape() - Mattia Favaron
 * 2015-08-20 - Modificata funzione addImage() - Mattia Favaron
 * 2015-08-09 - Modificato metodo addImage() - Simone Campagna
 * 2015-07-30 - Creati metodi modal() e addImage() - Simone Campagna
 * 2015-07-28 - Creato metodo addText() - Enrico Ceron
 */

'use strict';

/**
 * @ngdoc controller
 * @name editor.controller:ButtonController
 * @description Controller del bottone relativo l'inserimento di testo o elementi multimediali all'interno del container in modifica
 */
angular.module('editor').controller('ButtonController', ['$scope',
  function($scope) {
    /**
     * Oggetto immagine contenente l'URL dell'immagine.
     * @type {Object}
     */
    $scope.image = {};

    /**
     * Apre una finestra di dialogo relativa all'azione richiesta.
     *
     * @param {String} type - Il tipo di azione da eseguire.
     */
    $scope.modal = function(type) {
      $('#modal' + type).openModal({dismissible: false});
    };

    /**
     * Aggiunge del testo al contenitore attualmente selezionato.
     */
    $scope.addText = function() {
      var text = new fabric.IText('Text');
      text.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false
      });
      $scope.canvas.add(text);
      $scope.saveContainer();
    };

    /**
     * Aggiunge un'immagine al contenitore attualmente selezionato.
     */
    $scope.addImage = function() {
      fabric.Image.fromURL('http://crossorigin.me/' + $scope.image.url, function(img) {
          $scope.canvas.add(img);
          $scope.canvas.renderAll();
        }
      );
      $scope.saveContainer();
    };

    /**
     * Aggiunge una figura al contenitore attualmente selezionato.
     *
     * @param {String} type - Il tipo di figura da aggiungere.
     */
    $scope.addShape = function(type) {
      var shape = null;
      switch (type) {
        case('circle'):
          shape = new fabric.Circle({
            radius: 50,
            fill: '#FF5722',
            left: 100,
            top: 100
          });
          break;
        case('triangle'):
          shape = new fabric.Triangle({
            width: 100,
            height: 100,
            fill: '#FF5722',
            left: 100,
            top: 100
          });
          break;
        case('rect'):
          shape = new fabric.Rect({
            left: 100,
            top: 100,
            fill: '#FF5722',
            width: 100,
            height: 75
          });
          break;
        case('square'):
          shape = new fabric.Rect({
            left: 100,
            top: 100,
            fill: '#FF5722',
            width: 200,
            height: 200
          });
          break;
        case('line-horizzontal'):
          shape = new fabric.Line([0, 0, 150, 0], {
            stroke: '#FF5722',
            left: 50,
            top: 50
          });
          break;
        case('ellipse'):
          shape = new fabric.Ellipse({
            left: 100,
            top: 100,
            rx: 100,
            ry: 20,
            fill: '#FF5722'
          });
          break;
      }
      $scope.canvas.add(shape);
      $scope.canvas.renderAll();
      $scope.saveContainer();
    };
  }
]);
