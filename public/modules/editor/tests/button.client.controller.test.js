/**
 * Nome del file: button.client.controller.test.js
 * Percorso: /public/modules/editor/tests/button.client.controller.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-09-01
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-09-01 - Aggiunto test su modal() - Alex Ruzzante
 */

'use strict';

(function() {
  describe('ButtonController', function() {
    //Initialize global variables
    var scope;
    var Editor;
    var ButtonController;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function($controller, $rootScope, _Editor_) {
      scope = $rootScope.$new();
      Editor = _Editor_;
      ButtonController = $controller('ButtonController', {
        $scope: scope
      });
    }));

    it('$scope.modal() should execute without errors', function() {
      scope.modal();
    });
  });
})();
