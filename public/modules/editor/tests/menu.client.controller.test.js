/**
 * Nome del file: menu.client.controller.test.js
 * Percorso: /public/modules/editor/tests/menu.client.controller.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-31
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-09-01 - Aggiunto test su metodo save() e setPresentationResolution() - Alex Ruzzante
 * 2015-09-01 - Aggiunti test su metodi e objectType() - Alex Ruzzante
 * 2015-09-01 - Aggiunti test su metodi modal() e getInfo() - Alex Ruzzante
 * 2015-09-01 - Aggiunti test su metodi play(), print() e overview() - Alex Ruzzante
 */

'use strict';

(function() {
  describe('MenuController', function() {
    //Initialize global variables
    var scope;
    var $httpBackend;
    var $location;
    var MenuController;
    var Editor;
    var $stateParams;
    var mockPresentation;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function($controller,
                               $rootScope,
                               $window,
                               _$httpBackend_,
                               _Editor_,
                               _$location_,
                               _$stateParams_) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      Editor = _Editor_;
      $location = _$location_;
      $stateParams = _$stateParams_;
      MenuController = $controller('MenuController', {
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
      spyOn($window, 'open').and.callFake(function() {
        return true;
      });
      $stateParams.presentationId = mockPresentation._id;
    }));

    it('$scope.print() should open a new tab with the presentation\'s print preview within', function() {
      scope.print();

      // Test scope value
      expect(window.open).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith('/#!/export/12234');
    });

    it('$scope.play() should play the selected presentation opening a new tab', function() {
      scope.play();

      // Test scope value
      expect(window.open).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith('/#!/player/12234');
    });

    it('$scope.overview() should open the presentation\'s overview', function() {
        scope.overview();

        // Test scope value
        expect($location.path()).toBe('/overview/12234');
      });

    it('$scope.modal() should open a dialog window', function() {
      scope.presentation.info = mockPresentation.info;
      var mock = JSON.parse(JSON.stringify(scope.presentation.info));
      scope.modal();

      // Test scope value
      expect(scope.updateInfo).toEqual(mock);
    });

    it('$scope.getInfo() should obtain the presentation\'s info', function() {
      spyOn(Editor, 'getPresentationInfo').and.returnValue(mockPresentation.info);
      spyOn(Editor, 'getResolution').and.returnValue(mockPresentation.resolution);

      scope.getInfo();

      // Test scope value
      expect(scope.presentation.info).toEqual(mockPresentation.info);
      expect(scope.resolution).toEqual(mockPresentation.resolution);
    });

    it('$rootScope.$on(\'editor:init\') should call getInfo when needed', function() {
        spyOn(scope, 'getInfo').and.callFake(function() {
          return true;
        });

        scope.$emit('editor:init');

        // Test scope value
        expect(scope.getInfo).toHaveBeenCalled();
      });

    it('rootScope.$on(\'object:select\') should intercept the selection of an object', function() {
      spyOn(scope, '$apply').and.callThrough();
      var object = 'I\'m an object!';

      scope.$emit('object:select', object);

      // Test scope value
      expect(scope.object.select).toEqual(object);
    });

    it('$scope.objectType() should return false if scope.canvas is undefined', function() {
      var value = scope.objectType('Type');

      // Test scope value
      expect(value).toBeFalsy();
    });

    it('$scope.save()', function() {
      spyOn(Editor, 'saveProductionWidth').and.callThrough();
      spyOn(Editor, 'savePresentation').and.callThrough();

      scope.save();

      // Test scope value
      expect(Editor.saveProductionWidth).toHaveBeenCalled();
      expect(Editor.savePresentation).toHaveBeenCalled();
    });

    it('$scope.setPresentationResolution()', function() {
      spyOn(Editor, 'setResolution');

      scope.setPresentationResolution();

      // Test scope value
      expect(Editor.setResolution).toHaveBeenCalled();
    });
  });
})();
