'use strict';

// Protractor configuration
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['public/modules/*/tests/e2e/*.js'],
  framework: 'jasmine2'
};