/**
 * Nome del file: settings.client.controller.test.js
 * Percorso: /public/modules/users/tests/settings.client.controller.test.js
 * Autore: InfiniTech
 * Data creazione: 2015-09-02
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-09-02 - Aggiunti tests su metodi updateUserProfile(),
 * changeUserPassword() - Alex Ruzzante
 */

'use strict';

(function() {
  describe('SettingsController', function() {
    //Initialize global variables
    var scope;
    var $httpBackend;
    var $location;
    var  SettingsController;
    var  Users;
    var  Authentication;
    var $stateParams;

    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function($controller, $rootScope, _$httpBackend_,
                               _Authentication_, _Users_,
                               _$location_, _$stateParams_) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      Users = _Users_;
      $location = _$location_;
      Authentication = _Authentication_;
      $stateParams = _$stateParams_;
      SettingsController = $controller('SettingsController', {
        $scope: scope
      });
    }));

    it('$scope.updateUserProfile(isValid) should update user\'s profile if' +
      ' isValid is true', function() {
      Authentication.user = {};
      scope.success = false;
      scope.error = undefined;
      scope.user = {firstName: 'A sample', lastName: 'User'};
      var mockUser = {firstName: 'A sample', lastName: 'User'};
      $httpBackend.expectPUT('users').respond(mockUser);
      scope.updateUserProfile(true);
      $httpBackend.flush();
      // Test scope value
      expect(scope.success).toBeTruthy();
      expect(Authentication.user.firstName).toBe('A sample');
      expect(Authentication.user.lastName).toBe('User');
      expect(scope.error).toBe(null);
    });

    it('$scope.updateUserProfile(isValid) should set scope.submitted if' +
      ' isValid is false', function() {
      scope.submitted = false;
      scope.updateUserProfile(false);
      // Test scope value
      expect(scope.submitted).toBeTruthy();
    });

    it('$scope.changeUserPassword() should set scope.success if it has' +
      ' changed the password', function() {
      scope.passwordDetails = '*******';
      scope.success = false;
      scope.error = undefined;
      $httpBackend.expectPOST('/users/password' , scope.passwordDetails).
        respond(200);
      scope.changeUserPassword();
      $httpBackend.flush();
      // Test scope value
      expect(scope.success).toBeTruthy();
      expect(scope.error).toBe(null);
      expect(scope.passwordDetails).toBe(null);
    });

    it('$scope.changeUserPassword() should set scope.error if there is a' +
      ' change password error', function() {
      scope.passwordDetails = '*******';
      $httpBackend.expectPOST('/users/password' , scope.passwordDetails).
        respond(400, {
        'message': 'password error'
      });
      scope.changeUserPassword();
      $httpBackend.flush();
      // Test scope value
      expect(scope.error).toBe('password error');
    });
  });
})();
