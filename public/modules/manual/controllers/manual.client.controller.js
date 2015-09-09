/**
 * Nome del file: manual.client.controller.js
 * Percorso: /public/modules/manual/controllers/manual.client.controller.js
 * Autore: InfiniTech
 * Data creazione: 2015-07-27
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 */

'use strict';

angular.module('manual').controller('ManualController', ['$scope', '$rootScope',
  function($scope, $rootScope) {

    $rootScope.requireHeader = true;
    $rootScope.requireFooter = false;

    $scope.toc = [];

    $(document).ready(function() {
      $('.collapsible').collapsible({
        accordion: true
      });
      $('#up-button').fadeOut();

      $('img').addClass('responsive-img');
      $('.figure .caption').addClass('center-align');
    });

    $(window).scroll(function() {
      if ($(this).scrollTop() > 200) {
        $('#up-button').fadeIn();
      } else {
        $('#up-button').fadeOut();
      }
    });

    $('#up-button').click(function() {
      $('body').animate({
        scrollTop: 0
      }, 600);
      return false;
    });
  }
]);
