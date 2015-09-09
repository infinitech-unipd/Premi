/**
 * Nome del file: button.client.directive.test.js
 * Percorso: /public/modules/editor/tests/button.client.directive.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-31
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-31 - Aggiunto test direttiva editorButton - Tommaso Miotto
 */

'use strict';

describe('editorButton', function() {
  var $compile;
  var	$rootScope;

  //Load module which contains the directive
  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('editor-button should contain void value', function() {
    var element = $compile('<editor-button></editor-button>')($rootScope);
    expect(element.html()).toContain('');
  });
});
