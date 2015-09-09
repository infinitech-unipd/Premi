/**
 * Nome del file: player.client.controller.test.js
 * Percorso: /public/modules/player/tests/player.client.controller.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-28
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-28 - Aggiunti tests per metodi init() e make() - Alex Ruzzante
 */

'use strict';

(function() {
  describe('PlayerController', function() {
    //Initialize global variables
    var scope;
    var $httpBackend;
    var PlayerController;
    var Player;
    var mockPresentation;
    var $stateParams;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function($controller,
                               $rootScope,
                               _$httpBackend_,
                               _$stateParams_,
                               _Player_) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $stateParams = _$stateParams_;
      Player = _Player_;
      PlayerController = $controller('PlayerController', {
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

    it('$scope.init() should request a presentation to server', function() {
      $stateParams.presentationId = mockPresentation._id;
      scope.presentation = mockPresentation;
      $httpBackend.expectGET('/player/12234').respond(mockPresentation);
      scope.init();
      $httpBackend.flush();
      // Test scope value
      expect(scope.presentation._id).toEqual(mockPresentation._id);
      expect(scope.containers).toEqual(mockPresentation.containers);
      expect(scope.width).toEqual(mockPresentation.productionWidth);
      expect(scope.resolution).toEqual(mockPresentation.resolution);
    });

    it('$scope.init() should set scope.error if it cannot find a presentation', function() {
      $stateParams.presentationId = mockPresentation._id;
      scope.presentation = mockPresentation;
      $httpBackend.expectGET('/player/12234').respond(400, {
        message: 'presentation error'
      });
      scope.init();
      $httpBackend.flush();
      // Test scope value
      expect(scope.error.message).toBe('presentation error');
    });

    it('$scope.make() should create a slide', function() {
      scope.containers = mockPresentation.containers;
      scope.resolution = mockPresentation.resolution;
      var slide = scope.containers[1];
      $httpBackend.expectGET('/player/12234').respond(200);
      scope.make();
      // Test scope value
      expect(slide).toBeDefined();
    });
  });
})();
