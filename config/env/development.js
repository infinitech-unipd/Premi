'use strict';

module.exports = {
  db: 'mongodb://localhost/premi-dev',
  app: {
    title: 'Premi - Development Environment'
  },
  assets: {
    css: [
      'public/modules/**/css/*.css'
    ],
    js: [
      'public/config.js',
      'public/application.js',
      'public/modules/*/*.js',
      'public/modules/*/*[!tests]*/*.js'
    ],
    tests: [
      'public/lib/angular-mocks/angular-mocks.js',
      'public/modules/*/tests/*.js'
    ]
  }
};
