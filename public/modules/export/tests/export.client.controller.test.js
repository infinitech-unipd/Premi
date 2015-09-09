/**
 * Nome del file: export.client.controller.test.js
 * Percorso: /public/modules/export/tests/export.client.controller.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-09-01
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-09-03 - Aggiunti test per metodi addToPDF() e download() - Alex Ruzzante
 * 2015-09-01 - Aggiunti test per metodo init() - Alex Ruzzante
 */

'use strict';

(function() {
  describe('ExportController', function() {
    //Initialize global variables
    var scope;
    var $httpBackend;
    var ExportController;
    var mockPresentation;
    var $stateParams;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function($controller,
                               $rootScope,
                               _$httpBackend_,
                               _$stateParams_) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $stateParams = _$stateParams_;
      ExportController = $controller('ExportController', {
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

    it('$scope.init() should initialize the slides to export', function() {
      $stateParams.presentationId = mockPresentation._id;
      $httpBackend.expectGET('/player/12234').respond(mockPresentation);
      scope.init();
      $httpBackend.flush();
      // Test scope value
      expect(scope.containers).toEqual(mockPresentation.containers);
      expect(scope.productionWidth).toEqual(mockPresentation.productionWidth);
      expect(scope.resolution).toEqual(mockPresentation.resolution);
    });

    it('$scope.init() should respond with error if it cannot find a presentation', function() {
      $stateParams.presentationId = mockPresentation._id;
      spyOn(console, 'error');
      $httpBackend.expectGET('/player/12234').respond(400, {
        message: 'presentation error'
      });
      scope.init();
      $httpBackend.flush();
      // Test scope value
    });

    it('$scope.addToPDF() should execute without errors', function() {
      scope.resolution = mockPresentation.resolution;
      scope.resolution.width = 4;
      scope.containers = mockPresentation.containers;
      var canvas = new fabric.Canvas();
      scope.addToPDF(canvas, 0);
    });

    it('$scope.download() should execute without errors', function() {
      scope.download();
    });
  });
})();
