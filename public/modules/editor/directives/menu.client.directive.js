/**
 * Nome del file: menu.client.directive.js
 * Percorso: /public/modules/editor/controllers/menu.client.directive.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-16
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('editor').directive('editorMenu', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'modules/editor/views/menu.client.view.html',
    controller: 'MenuController'
  };
});

