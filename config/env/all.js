'use strict';

module.exports = {
  app: {
    title: 'Premi',
    description: 'Didactic project of Software Engineering course held in Università degli Studi di Padova during Academic Year 2014-2015.',
    keywords: 'infinitech, premi, padova, unipd, ingegneria del software, swe, didactic project'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions',
  assets: {
    lib: {
      css: [
        'public/lib/materialize/dist/css/materialize.min.css',
        'public/lib/josefinSans/josefinSans.css',
        'public/lib/amaranth/amaranth.css',
        'public/lib/ubuntuMono/ubuntuMono.css',
        'https://fonts.googleapis.com/icon?family=Material+Icons'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/materialize/dist/js/materialize.min.js',
        'public/lib/fabric/dist/fabric.min.js',
        'public/lib/jspdf/dist/jspdf.min.js',
        'public/lib/impress/js/impress.js'
      ]
    }
  }
};
