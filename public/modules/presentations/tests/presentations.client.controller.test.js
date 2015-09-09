/**
 * Nome del file: presentations.client.controller.test.js
 * Percorso: /public/modules/presentations/tests/presentations.client.controller.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-27
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-28 - Aggiunti test su metodi init() e modal() - Tommaso Miotto
 */

'use strict';

(function() {
  describe('PresentationsController', function() {
    //Initialize global variables
    var scope;
    var $httpBackend;
    var PresentationsController;
    var mockPresentation;
    var Presentations;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function($controller,
                               $rootScope,
                               _$httpBackend_,
                               _Presentations_) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      Presentations = _Presentations_;
      PresentationsController = $controller('PresentationsController', {
        $scope: scope
      });
      scope.presentations = [];
      mockPresentation = {
        _id: '12234',
        info: {
          title: 'A sample presentation',
          description: 'Premi rocks!'
        }
      };
    }));

    it('$scope.init() should show public presentations list', function() {
      scope._id = '12345';
      scope.info = {};
      scope.info.title = 'Another sample presentation';
      scope.info.description = 'Premi rocks!';
      var mockPresentation2 = {_id: scope._id , info: scope.info};
      var listPresentations = [mockPresentation, mockPresentation2];
      $httpBackend.expectGET('/presentations/public').respond(listPresentations);
      scope.init();
      $httpBackend.flush();
      // Test scope value
      expect(scope.presentations.length).toBe(2);
      expect(scope.presentations[0]._id).toBe('12234');
      expect(scope.presentations[0].info.title).toBe('A sample presentation');
      expect(scope.presentations[0].info.description).toBe('Premi rocks!');
      expect(scope.presentations[1]._id).toBe('12345');
      expect(scope.presentations[1].info.title).toBe('Another sample presentation');
      expect(scope.presentations[1].info.description).toBe('Premi rocks!');
    });

    it('$scope.init() should set scope.error if list error', function() {
      $httpBackend.expectGET('/presentations/public').respond(400, {
        message: 'public presentations list error'
      });
      scope.init();
      $httpBackend.flush();
      // Test scope value
      expect(scope.error).toBe('public presentations list error');
    });

    it('$scope.modal(type,presentation) should open modal for correct presentation', function() {
      scope.modal('Share', mockPresentation);
      expect(scope.selected).toBe(mockPresentation);
    });
  });
})();
