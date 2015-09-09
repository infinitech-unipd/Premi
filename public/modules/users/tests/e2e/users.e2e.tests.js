/**
 * Nome del file: users.e2e.tests.js
 * Percorso: /public/modules/users/tests/e2e/users.e2e.tests.js
 * Autore: InfiniTech
 * Data creazione: 2015-09-04
 * E-mail: info.infinitech@gmail.com
 *
 * Questo file è proprietà del gruppo InfiniTech e viene rilasciato sotto
 * licenza GNU AGPLv3.
 *
 * Diario delle modifiche:
 * 2015-09-06 - Aggiunti tests delete e cancel delete - Alex Ruzzante
 * 2015-09-06 - Aggiunti tests share, play presentation, editor - Alex Ruzzante
 * 2015-09-06 - Aggiunti tests create, list presentations, edit details - Alex Ruzzante
 * 2015-09-06 - Aggiunti tests show e edit user's profile - Alex Ruzzante
 * 2015-09-04 - Ristrutturazione suites e corretto signin - Tommaso Miotto
 * 2015-09-04 - Aggiunti tests signin e signup - Alex Ruzzante
 */

'use strict';

var username = 'alexrzz' + Math.random() * 10000000000;

describe('Users E2E Tests:', function() {
  beforeEach(function() {
    browser.driver.manage().window().maximize();
  });
  afterEach(function() {
    browser.get('http://localhost:3000/auth/signout');
  });

  describe('Test signup page', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/#!/signup');
    });

    it('Should allow user signup if username is free', function() {
      element(by.model('credentials.firstName')).sendKeys('Alex');
      element(by.model('credentials.lastName')).sendKeys('Ruzzante');
      element(by.model('credentials.email')).sendKeys('alex@' +
        'infinitech.com');
      element(by.model('credentials.username')).sendKeys(username);
      element(by.model('credentials.password')).sendKeys('password1234');
      element(by.model('credentials.passwordConfirm')).
        sendKeys('password1234');
      element(by.css('button[type=submit]')).click();
      expect(element(by.binding('authentication.user.firstName')).getText()).
        toEqual('Alex!');
    });
  });

  describe('Test signin page', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/#!/signin');
    });

    it('Should allow user authentication', function() {
      element(by.model('credentials.username')).sendKeys(username);
      element(by.model('credentials.password')).sendKeys('password1234');
      element(by.css('button[type=submit]')).click();
      expect(element(by.binding('authentication.user.firstName')).getText()).
        toEqual('Alex!');
    });
  });

  describe('Test user\'s profile related pages', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/#!/signin');
      element(by.model('credentials.username')).sendKeys(username);
      element(by.model('credentials.password')).sendKeys('password1234');
      element(by.css('button[type=submit]')).click();
      element(by.cssContainingText('a', 'arrow_drop_down')).click();
      element(by.cssContainingText('a', 'Edit profile')).click();
    });

    it('Should show user\'s profile', function() {
      expect(element(by.model('user.firstName')).getAttribute('value')).
        toEqual('Alex');
      expect(element(by.model('user.lastName')).getAttribute('value')).
        toEqual('Ruzzante');
      expect(element(by.model('user.email')).getAttribute('value')).
        toEqual('alex@infinitech.com');
      expect(element(by.model('user.username')).getAttribute('value')).
        toEqual(username);
    });

    it('Should edit user\'s profile', function() {
      element(by.model('user.firstName')).clear();
      element(by.model('user.firstName')).sendKeys('Alessandro');
      element(by.model('user.lastName')).clear();
      element(by.model('user.lastName')).sendKeys('Del Piero');
      element(by.model('user.email')).clear();
      element(by.model('user.email')).sendKeys('delpiero@juventus.com');
      element(by.css('button[type=submit]')).click();
      element(by.cssContainingText('a', 'OK')).click();
      expect(element(by.model('user.firstName')).getAttribute('value')).
        toEqual('Alessandro');
      expect(element(by.model('user.lastName')).getAttribute('value')).
        toEqual('Del Piero');
      expect(element(by.model('user.email')).getAttribute('value')).
        toEqual('delpiero@juventus.com');
    });
  });

  describe('Test user\'s presentations related pages', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/#!/signin');
      element(by.model('credentials.username')).sendKeys(username);
      element(by.model('credentials.password')).sendKeys('password1234');
      element(by.css('button[type=submit]')).click();
    });

    it('Should allow user to create a presentation', function() {
      element(by.cssContainingText('i', 'add')).click();
      element(by.model('info.title')).sendKeys('A sample presentation');
      element(by.model('info.description')).sendKeys('A sample description');
      element(by.cssContainingText('a', 'Create')).click();
      var presentationsList = element.all(by.
        repeater('presentation in presentations'));
      expect(presentationsList.count()).toEqual(1);
      expect(presentationsList.first().element(by.
        binding('presentation.info.title')).getText()).
        toEqual('A sample presentation');
      expect(presentationsList.first().element(by.
        binding('presentation.info.description')).getText()).
        toEqual('A sample description');
    });

    it('Should allow user to view the list of his presentations', function() {
      element(by.cssContainingText('i', 'add')).click();
      element(by.model('info.title')).sendKeys('Another sample presentation');
      element(by.model('info.description')).
        sendKeys('Another sample description');
      element(by.cssContainingText('a', 'Create')).click();
      var presentationsList = element.all(by.
        repeater('presentation in presentations'));
      expect(presentationsList.count()).toEqual(2);
      expect(presentationsList.get(0).element(by.
        binding('presentation.info.title')).getText()).
        toEqual('Another sample presentation');
      expect(presentationsList.get(0).element(by.
        binding('presentation.info.description')).getText()).
        toEqual('Another sample description');
      expect(presentationsList.get(1).element(by.
        binding('presentation.info.title')).getText()).
        toEqual('A sample presentation');
      expect(presentationsList.get(1).element(by.
        binding('presentation.info.description')).getText()).
        toEqual('A sample description');
    });

    it('Should allow user to edit the details of his presentation', function() {
      element(by.cssContainingText('i', 'create')).click();
      element(by.model('updates.info.title')).clear();
      element(by.model('updates.info.title')).sendKeys('Edited title');
      element(by.model('updates.info.description')).clear();
      element(by.model('updates.info.description')).
        sendKeys('Edited description');
      element(by.cssContainingText('a', 'Update')).click();
      var presentationsList = element.all(by.
        repeater('presentation in presentations'));
      expect(presentationsList.get(0).element(by.
        binding('presentation.info.title')).getText()).
        toEqual('Edited title');
      expect(presentationsList.get(0).element(by.
        binding('presentation.info.description')).getText()).
        toEqual('Edited description');
    });

    it('Should allow user to share one of his presentations', function() {
      element(by.cssContainingText('i', 'share')).click();
      expect(element(by.css('a[target=_blank]')).getText()).
        toMatch('http://www.infinitech.tk:3000/player/');
    });

    it('Should allow user to play one of his presentations', function() {
      element(by.cssContainingText('i', 'play_arrow')).click();
      expect(browser.getLocationAbsUrl()).
        toMatch('http://localhost:3000/#!/player/');
    });

    it('Should allow user to open one of his presentations into editor mode',
      function() {
      element(by.cssContainingText('i', 'web')).click();
      expect(browser.getLocationAbsUrl()).
        toMatch('http://localhost:3000/#!/editor/');
    });

    it('Should allow user to cancel the delete operation of his presentation',
      function() {
        var presentationsList = element.all(by.
          repeater('presentation in presentations'));
        var count = presentationsList.count();
        element(by.cssContainingText('i', 'delete')).click();
        element(by.cssContainingText('a', 'Cancel')).isDisplayed().
          then(function(isVisible) {
            if (isVisible) {
              click();
            }
          });
        var recountPresentationsList = element.all(by.
          repeater('presentation in presentations'));
        expect(recountPresentationsList.count()).toEqual(count);
      });

    it('Should allow user to delete one of his presentations', function() {
      var presentationsList = element.all(by.
        repeater('presentation in presentations'));
      var count = presentationsList.count();
      element(by.cssContainingText('i', 'delete')).click();
      element(by.cssContainingText('a', 'Delete')).click();
      var recountPresentationsList = element.all(by.
        repeater('presentation in presentations'));
      expect(recountPresentationsList.count()).toBe(1);
    });
  });
});

