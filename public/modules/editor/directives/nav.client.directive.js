/**
 * Nome del file: nav.client.directive.js
 * Percorso: /public/modules/editor/controllers/nav.client.directive.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-16
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('editor').directive('editorNav', function() {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'modules/editor/views/nav.client.view.html',
    controller: 'NavController'
  };
});
