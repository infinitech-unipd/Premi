/**
 * Nome del file: overview.client.controller.test.js
 * Percorso: /public/modules/editor/tests/overview.client.controller.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-31
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-09-02 - Aggiunti test mancanti - Alex Ruzzante
 * 2015-09-02 - Aggiunti test su metodi putInPosition(), return() e load() - Alex Ruzzante
 * 2015-08-31 - Aggiunto test su metodo init() - Alex Ruzzante
 */

'use strict';

(function() {
  describe('OverviewController', function() {
    //Initialize global variables
    var scope;
    var  $httpBackend;
    var  $location;
    var  OverviewController;
    var  Editor;
    var  $stateParams;
    var  mockPresentation;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function($controller,
                               $rootScope,
                               _$httpBackend_,
                               _Editor_,
                               _$location_,
                               _$stateParams_) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      Editor = _Editor_;
      $location = _$location_;
      $stateParams = _$stateParams_;
      OverviewController = $controller('OverviewController', {
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

    it('$scope.init() should open the editor if the page is refreshed', function() {
      spyOn(Editor, 'getPresentationInfo').and.returnValue(undefined);
      spyOn(Editor, 'init').and.callFake(function() {
        return true;
      });
      scope.init();
      // Test scope value
      expect(Editor.init).toHaveBeenCalled();
    });

    it('$scope.init() should initialize the overview', function() {
      spyOn(Editor, 'getPresentationInfo').and.returnValue(mockPresentation.
        info);
      spyOn(Editor, 'getContainers').and.returnValue(mockPresentation.
        containers);
      spyOn(scope, 'load').and.callFake(function() {
        return true;
      });
      scope.init();
      // Test scope value
      expect(Editor.getContainers).toHaveBeenCalled();
      expect(scope.load).toHaveBeenCalled();
      expect(scope.containers).toEqual(mockPresentation.containers);

    });

    it('rootScope.$on(\'editor:init\') should intercept when the presentation is obtained and load overview slides', function() {
      spyOn(Editor, 'getContainers').and.returnValue(mockPresentation.containers);
      spyOn(scope, 'load').and.callFake(function() {
        return true;
      });
      scope.$emit('editor:init');
      // Test scope value
      expect(scope.containers).toBe(mockPresentation.containers);
      expect(scope.load).toHaveBeenCalled();
    });

    it('$scope.load() should create the overview canvas', function() {
      spyOn(Editor, 'getResolution').and.returnValue(mockPresentation.resolution);
      spyOn(Editor, 'getProductionWidth').and.returnValue(mockPresentation.productionWidth);
      spyOn(scope, 'drawCanvasAsObject').and.callFake(function() {
        return true;
      });
      scope.load();
      // Test scope value
      expect(Editor.getResolution).toHaveBeenCalled();
      expect(Editor.getProductionWidth).toHaveBeenCalled();
      expect(scope.drawCanvasAsObject).toHaveBeenCalled();
      expect(scope.resolution).toEqual(mockPresentation.resolution);
      expect(scope.width).toEqual(mockPresentation.productionWidth);
    });

    it('$scope.putInPosition() should put containers in position', function() {
      scope.overview = new fabric.Canvas();
      scope.containers.overviewTop = undefined;
      scope.withoutPosition = ['One container'];
      spyOn(scope, 'arrange');
      scope.putInPosition();
      // Test scope value
      expect(scope.arrange).toHaveBeenCalled();
    });

    it('$scope.return(saving) should save the tracking if saving is true and then go back to the editor', function() {
      var saving = true;
      scope.overview = new fabric.Canvas();
      scope.containers = [];
      spyOn(scope, 'traceStates');
      spyOn(Editor, 'saveOverviewWidth');
      spyOn(Editor, 'saveContainers');
      $stateParams.presentationId = mockPresentation._id;
      scope.return(saving);
      // Test scope value
      expect(scope.traceStates).toHaveBeenCalled();
      expect(Editor.saveOverviewWidth).toHaveBeenCalled();
      expect(Editor.saveContainers).toHaveBeenCalled();
    });

    it('$scope.return(saving) should not save the tracking if saving is' +
      ' false and then go back to the editor', function() {
      var saving = false;
      scope.overview = new fabric.Canvas();
      $stateParams.presentationId = mockPresentation._id;
      scope.return(saving);
      // Test scope value
    });

    it('$scope.arrangeGrid() should be executed without errors', function() {
      scope.arrangeGrid();
    });

    it('$scope.arrangeRandomly() should be executed without errors', function() {
      scope.overview = new fabric.Canvas();
      scope.arrangeRandomly();
    });

    it('$scope.arrangeVertically() should be executed without errors', function() {
      scope.overview = new fabric.Canvas();
      scope.arrangeVertically();
    });

    it('$scope.arrangeHorizontally() should be executed without errors', function() {
      scope.overview = new fabric.Canvas();
      scope.arrangeHorizontally();
    });

    it('$scope.arrangeHorizontally() should be executed without errors', function() {
      scope.overview = new fabric.Canvas('over');
      spyOn(scope.overview, 'getObjects');
      spyOn(scope.overview, 'calcOffset');
      spyOn(scope.overview, 'renderAll');
      // Test scope value
      scope.arrange('String', mockPresentation.containers);
      expect(scope.overview.calcOffset).toHaveBeenCalled();
      expect(scope.overview.renderAll).toHaveBeenCalled();
      expect(scope.overview.getObjects).toHaveBeenCalled();
    });

    it('$scope.traceStates() should be executed without errors', function() {
      scope.overview = new fabric.Canvas('over');
      spyOn(scope.overview, 'getObjects');
      scope.traceStates();
      // Test scope value
      expect(scope.overview.getObjects).toHaveBeenCalled();
    });
  });
})();
