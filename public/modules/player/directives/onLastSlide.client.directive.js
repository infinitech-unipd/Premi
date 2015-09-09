/**
 * Nome del file: onLastRepeat.client.directive.js
 * Percorso: /public/modules/player/directives/onLastRepeat.client.directive.js
 * Autore: InfiniTech
 * Data creazione: 2015-08-25
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('player').directive('onLastSlide', function() {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope) {
      if(scope.containers[scope.$index].overviewTop === undefined) {
        scope.containers[scope.$index].overviewTop = 0;
        scope.containers[scope.$index].overviewLeft = scope.$index * 150;
        scope.containers[scope.$index].overviewAngle = 0;
        scope.containers[scope.$index].overviewScale =  1;
      }
      setTimeout(function() {
        scope.make(scope.$index);
      });

      if (scope.$last) {
        setTimeout(function() {
          scope.makeAdapter();
        }, 100);
      }
    }
  };
});
