/**
 * Nome del file: onLastExport.client.directive.js
 * Percorso: /public/modules/editor/controllers/onLastExport.client.directive.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-19
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('export').directive('onLastExport', function() {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope) {
      setTimeout(function() {
        scope.make(scope.$index);
      }, 2);
    }
  };
});
