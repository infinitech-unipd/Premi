/**
 * Nome del file: editor.client.controller.test.js
 * Percorso: /public/modules/editor/tests/editor.client.controller.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-31
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-09-01 - Aggiunto test su metodo init() - Alex Ruzzante
 */

'use strict';

(function() {
  describe('EditorController', function() {
    //Initialize global variables
    var scope;
    var $httpBackend;
    var $location;
    var EditorController;
    var Editor;
    var Presentations;
    var $stateParams;
    var mockPresentation;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function($controller,
                               $rootScope,
                               _$httpBackend_,
                               _Editor_,
                               _Presentations_,
                               _$location_,
                               _$stateParams_) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      Editor = _Editor_;
      $location = _$location_;
      Presentations = _Presentations_;
      $stateParams = _$stateParams_;
      EditorController = $controller('EditorController', {
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
      $stateParams.presentationId = mockPresentation._id;
    }));

    it('$scope.init() should initialize the editor', function() {
      spyOn(Editor, 'init').and.returnValue(true);

      scope.init();

      // Test scope value
      expect(Editor.init).toHaveBeenCalled();
      expect(Editor.init).toHaveBeenCalledWith('12234');
    });
  });
})();
