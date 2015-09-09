/**
 * Nome del file: editor.client.service.test.js
 * Percorso: /public/modules/editor/tests/editor.client.service.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-28
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-28 - Aggiunti test per metodi di Editor - Alex Ruzzante
 */

'use strict';

(function() {
  describe('EditorService', function() {
    //Initialize global variables
    var $httpBackend;
    var mockPresentation;
    var Presentations;
    var $stateParams;
    var Editor;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function(_$stateParams_,
                               _$httpBackend_,
                               _Editor_,
                               _Presentations_) {
      $httpBackend = _$httpBackend_;
      Editor = _Editor_;
      Presentations = _Presentations_;
      $stateParams = _$stateParams_;
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

    it('Editor.updatePresentationInfo() should update the presentation\'s info', function() {
      Editor.updatePresentationInfo(mockPresentation.info);

      // Test scope value
      expect(Editor.getPresentationInfo()).toEqual(mockPresentation.info);
    });

    it('Editor.getPresentationInfo() should return the updated presentation\'s info', function() {
      Editor.updatePresentationInfo(mockPresentation.info);

      // Test scope value
      expect(Editor.getPresentationInfo()).toEqual(mockPresentation.info);
    });

    it('Editor.init() should obtain the presentation to edit', function() {
      $stateParams.presentationId = mockPresentation._id;

      $httpBackend.expectGET('/presentations/12234').respond(mockPresentation);

      Editor.init();
      $httpBackend.flush();

      // Test scope value
      expect(Editor.getPresentationInfo()).toEqual(mockPresentation.info);
    });

    it('Editor.saveContainers(containers) should save the presentation\'s containers', function() {
      Editor.saveContainers(mockPresentation.containers);

      // Test scope value
      expect(Editor.getContainers()).toEqual(mockPresentation.containers);
    });

    it('Editor.getContainers() should get the presentation\'s containers', function() {
      Editor.saveContainers(mockPresentation.containers);

      // Test scope value
      expect(Editor.getContainers()).toEqual(mockPresentation.containers);
    });

    it('Editor.saveContainer(container, index) should save the presentation\'s container', function() {
      Editor.saveContainers({});
      Editor.saveContainer(mockPresentation.containers[0],0);

      // Test scope value
      expect(Editor.getContainer(0)).toEqual(mockPresentation.containers[0]);
    });

    it('Editor.getContainer() should get the presentation\'s container', function() {
      Editor.saveContainers({});
      Editor.saveContainer(mockPresentation.containers[1],0);
      expect(Editor.getContainer(0)).toEqual(mockPresentation.containers[1]);
    });

    //getResolution setResolution
    it('Editor.getResolution() should get the presentation\'s resolution', function() {
      Editor.setResolution(mockPresentation.resolution);

      // Test scope value
      expect(Editor.getResolution()).toEqual(mockPresentation.resolution);

    });

    it('Editor.setResolution(resolution) should set the presentation\'s resolution', function() {
      Editor.setResolution(mockPresentation.resolution);

      // Test scope value
      expect(Editor.getResolution()).toEqual(mockPresentation.resolution);
    });

    it('Editor.saveProductionWidth(width) should save the presentation\'s production width', function() {
      Editor.saveProductionWidth(mockPresentation.productionWidth);

      // Test scope value
      expect(Editor.getProductionWidth()).toEqual(mockPresentation.
        productionWidth);
    });

    it('Editor.getProductionWidth() should get the presentation\'s production width', function() {
      Editor.saveProductionWidth(mockPresentation.productionWidth);

      // Test scope value
      expect(Editor.getProductionWidth()).toEqual(mockPresentation.
        productionWidth);
    });
  });
})();
