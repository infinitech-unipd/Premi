/**
 * Nome del file: home.client.controller.js
 * Percorso: /public/modules/core/controllers/home.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-16
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-31 - Aggiunto test su modal() - Alex Ruzzante
 * 2015-08-28 - Refactoring di mockPresentation - Alex Ruzzante
 * 2015-08-27 - Aggiunti test su metodo list() e update(), modificati costrutti
 *              when in expect, migliorati test su metodi create() - Alex Ruzzante
 * 2015-08-26 - Aggiunti test su metodo delete() - Alex Ruzzante
 * 2015-08-25 - Aggiunto test correct data create() - Alex Ruzzante
 * 2015-08-14 - Aggiunti test su metodi create() - Mattia Favaron
 */

'use strict';

(function() {
  describe('HomeController', function() {
    //Initialize global variables
    var scope;
    var $httpBackend;
    var HomeController;
    var Presentations;
    var mockPresentation;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _Presentations_) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      Presentations = _Presentations_;
      HomeController = $controller('HomeController', {
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

    it('should expose the authentication service', function() {
      expect(scope.authentication).toBeTruthy();
    });

    it('$scope.list() should list user\'s presentations', function() {
      var mockPresentation2 = {
        _id: '12235',
        info: {
          title: 'Another sample presentation',
          description: 'Premi rocks!'
        }
      };
      var listPresentations = [mockPresentation, mockPresentation2];

      $httpBackend.expectGET('/presentations').respond(listPresentations);

      scope.list();
      $httpBackend.flush();

      // Test scope value
      expect(scope.presentations.length).toBe(2);
      expect(scope.presentations[0]._id).toBe('12234');
      expect(scope.presentations[0].info.title).toBe('A sample presentation');
      expect(scope.presentations[0].info.description).toBe('Premi rocks!');
      expect(scope.presentations[1]._id).toBe('12235');
      expect(scope.presentations[1].info.title).toBe('Another sample presentation');
      expect(scope.presentations[1].info.description).toBe('Premi rocks!');
    });

    it('$scope.list() should set scope.error if list error', function() {
      $httpBackend.expectGET('/presentations').respond(400, {
        message: 'list error'
      });

      scope.list();
      $httpBackend.flush();

      // Test scope value
      expect(scope.error.list).toBe('list error');
    });

    it('$scope.delete() should delete an existing user\'s presentation', function() {
      scope.selected = mockPresentation;
      scope.presentations.push(mockPresentation);

      $httpBackend.expectDELETE('/presentations/12234').respond(200);

      scope.delete();
      $httpBackend.flush();

      // Test scope value
      expect(scope.presentations.length).toBe(0);
    });

    it('$scope.delete() should set scope.error if delete error', function() {
      scope.selected = mockPresentation;

      $httpBackend.expectDELETE('/presentations/12234').respond(400, {
        'message': 'delete error: presentation does not exist'
      });

      scope.delete();
      $httpBackend.flush();

      // Test scope value
      expect(scope.error.remove).toBe('delete error: presentation does not exist');
    });

    it('$scope.update() should update an existing user\'s presentation',
      function() {
      scope.updates = mockPresentation;
      scope.selected = mockPresentation;
      scope.presentations.push(mockPresentation);
      var presentationUpdated = mockPresentation;
      presentationUpdated.info.title = 'Changed title';
      presentationUpdated.info.description = 'Changed description';

      $httpBackend.expectPUT('/presentations/12234').
        respond(presentationUpdated);

      scope.update();
      $httpBackend.flush();

      // Test scope value
      expect(scope.presentations.length).toBe(1);
      expect(scope.presentations[0]._id).toBe('12234');
      expect(scope.presentations[0].info.title).toBe('Changed title');
      expect(scope.presentations[0].info.description).toBe('Changed description');
    });

    it('$scope.update() should set scope.error if update error', function() {
      scope.updates = mockPresentation;
      scope.selected = mockPresentation;
      scope.presentations.push(mockPresentation);

      $httpBackend.expectPUT('/presentations/12234').respond(400, {
        'message': 'update error: title too long'
      });

      scope.update();
      $httpBackend.flush();
      expect(scope.error.update).toBe('update error: title too long');
    });

    it('$scope.create() should create a new presentation with correct data', function() {
      $httpBackend.expectPOST('/presentations/create').respond(mockPresentation);

      scope.create();
      $httpBackend.flush();

      // Test scope value
      expect(scope.presentations.length).toBe(1);
      expect(scope.presentations[0].info.title).toBe('A sample presentation');
      expect(scope.presentations[0].info.description).toBe('Premi rocks!');
      expect(scope.error.insert).toBe(null);
    });

    it('$scope.create() should set scope.error if create error', function() {
      scope.info = {};
      scope.info.title = '0123456789012345678901234567890123456789123';

      $httpBackend.expectPOST('/presentations/create').respond(400, {
        'message': 'create error: title too long'
      });

      scope.create();
      $httpBackend.flush();

      // Test scope value
      expect(scope.presentations.length).toBe(0);
      expect(scope.error.insert).toBe('create error: title too long');
    });

    it('$scope.modal(type,presentation) should open modal for correct presentation', function() {
      scope.modal('Update', mockPresentation);

      // Test scope value
      expect(scope.updates).toEqual(JSON.parse(JSON.stringify(scope.selected)));
      expect(scope.selected).toBe(mockPresentation);
    });
  });
})();
