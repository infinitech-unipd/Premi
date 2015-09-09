/**
 * Nome del file: onLastRepeat.client.directive.js
 * Percorso: /public/modules/editor/controllers/onLastRepeat.client.directive.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-27
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('editor').directive('onLastRepeat', function() {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope) {
      if (scope.$last) {
        setTimeout(function() {
          scope.$emit('last');
        }, 2);
      }
      setTimeout(function() {
        scope.make(scope.$index);
      }, 2);
    }
  };
});
