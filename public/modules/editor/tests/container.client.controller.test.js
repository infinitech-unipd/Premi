/**
 * Nome del file: container.client.controller.test.js
 * Percorso: /public/modules/editor/tests/container.client.controller.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-31
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-09-01 - Aggiunti test su metodi scale() e makeCanvas() - Alex Ruzzante
 * 2015-08-31 - Aggiunto test su metodo saveContainer() - Alex Ruzzante
 */

'use strict';

(function() {
  describe('ContainerController', function() {
    //Initialize global variables
    var scope;
    var $httpBackend;
    var ContainerController;
    var Editor;
    var Presentations;
    var mockPresentation;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function($controller,
                               $rootScope,
                               _$httpBackend_,
                               _Editor_,
                               _Presentations_) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      Editor = _Editor_;
      Presentations = _Presentations_;
      ContainerController = $controller('ContainerController', {
        $scope: scope
      });
      mockPresentation = {
        _id: '12234',
        info: {
          title: 'A sample presentation',
          description: 'Premi rocks!'
        },
        containers: [
          'First container',
          'Second container'
        ],
        productionWidth: '500',
        overviewWidth: '500',
        resolution: {
          width: '500',
          height: '500'
        }
      };
    }));

    it('$scope.scale(oldResolution, newResolution) should scale the objects properly', function() {
      scope.container = mockPresentation.containers[0];
      scope.container.scaleWidth = '500';
      scope.resolution = mockPresentation.resolution;
      var oldResolution = {width: '500', height: '500'};
      var newResolution = {width: '500', height: '500'};
      spyOn(Editor, 'getResolution').and.returnValue(mockPresentation.resolution);
      spyOn(Editor, 'getProductionWidth').and.returnValue(mockPresentation.productionWidth);
      scope.scale(oldResolution, newResolution);

      // Test scope value
      expect(scope.resolution).toEqual(mockPresentation.resolution);
      expect(scope.productionWidth).toEqual(mockPresentation.productionWidth);
    });

    it('$scope.saveContainer() should save the selected container', function() {
      Editor.saveContainers(mockPresentation.containers);

      scope.saveContainer();

      // Test scope value
      expect(scope.container).toEqual(scope.canvas.toJSON([
        'top',
        'left',
        'angle',
        'scaleWidth'
      ]));
    });

    it('$scope.makeCanvas(index) should save the selected container', function() {
      scope.justInitialized = false;
      spyOn(scope.canvas, 'loadFromJSON').and.returnValue({});
      spyOn(scope, 'scale').and.returnValue(true);
      Editor.setResolution(mockPresentation.resolution);
      Editor.saveContainers({});
      Editor.saveContainer(mockPresentation.containers[0],0);

      scope.makeCanvas(0);

      // Test scope value
      expect(scope.justInitialized).toBeTruthy();
    });
  });
})();
