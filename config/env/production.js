'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/premi',
  assets: {
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
