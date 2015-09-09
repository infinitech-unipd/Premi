/**
 * Nome del file: onLastRepeat.client.directive.test.js
 * Percorso: /public/modules/editor/tests/onLastRepeat.client.directive.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-31
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-31 - Aggiunto test direttiva onLasRepeat - Tommaso Miotto
 */

'use strict';

describe('onLastRepeat', function() {
  var $compile;
  var NavController;
  var scope;

  //Load module which contains the directive
  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  beforeEach(inject(function($controller, $rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    NavController = $controller('navController',{
    $scope: scope
  });
  }));
});
