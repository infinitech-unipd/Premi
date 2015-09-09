/**
 * Nome del file: button.client.directive.js
 * Percorso: /public/modules/editor/controllers/button.client.directive.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-16
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('editor').directive('editorButton', function() {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'modules/editor/views/button.client.view.html',
    controller: 'ButtonController'
  };
});
