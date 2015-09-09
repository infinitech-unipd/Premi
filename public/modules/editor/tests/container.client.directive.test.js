/**
 * Nome del file: container.client.directive.test.js
 * Percorso: /public/modules/editor/tests/container.client.directive.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-31
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-08-31 - Aggiunto test direttiva editorContainer - Tommaso Miotto
 */

'use strict';

describe('editorContainer', function() {
  var $compile;
  var	$rootScope;

  //Load module which contains the directive
  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('editor-container should contain void value', function() {
    var element = $compile('<editor-container></editor-container>')($rootScope);
    expect(element.html()).toContain('');
  });
});
