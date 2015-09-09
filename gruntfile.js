'use strict';

module.exports = function(grunt) {
  // Unified Watch Object
  var watchFiles = {
    serverViews: ['app/views/**/*.*'],
    serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
    clientViews: ['public/modules/**/views/**/*.html'],
    clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
    clientCSS: ['public/modules/**/*.css'],
    mochaTests: ['app/tests/**/*.js']
  };

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      serverViews: {
        files: watchFiles.serverViews,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: watchFiles.clientViews,
        options: {
          livereload: true
        }
      },
      clientJS: {
        files: watchFiles.clientJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientCSS: {
        files: watchFiles.clientCSS,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: watchFiles.clientJS.concat(watchFiles.serverJS),
        options: {
          jshintrc: true
        }
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: watchFiles.clientCSS
      }
    },
    uglify: {
      production: {
        options: {
          mangle: false
        },
        files: {
          'public/dist/application.min.js': 'public/dist/application.js'
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/dist/application.min.css': '<%= applicationCSSFiles %>'
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: watchFiles.serverViews.concat(watchFiles.serverJS)
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    ngAnnotate: {
      production: {
        files: {
          'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: true,
        limit: 10
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    mochaTest: {
      src: watchFiles.mochaTests,
      options: {
        reporter: 'spec',
        require: 'server.js'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    protractor: {
      options: {
        configFile: 'protractor.conf.js',
        keepAlive: true,
        noColor: false
      },
      e2e: {
        options: {
          args: {} // Target-specific arguments
        }
      }
    },
    mocha_istanbul: {
      coverage: {
        src: watchFiles.serverJS
      },
      options: {
        coverageFolder: 'coverage',
        reportFormats: ['lcovonly']
      }
    },
    lcovMerge: {
      options: {
        emitters: ['event', 'file'],
        outputFile: 'coverage/mergeLcov.info'
      },
      src: ['coverage/*.info', 'coverage/**/*.info']
    },
    coveralls: {
      all: {
        src: 'coverage/mergeLcov.info',
        force: false
      }
    },
    jsmeter: {
      files: {
        src: ['public/modules/**/*.js', 'app/**/*.js']
      },
      options: {
        engine: 'console'
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-lcov-merge');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-coveralls');

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig',
    'Task that loads the config into a grunt option.',
    function() {
      var init = require('./config/init')();
      var config = require('./config/config');

      grunt.config.set('applicationJavaScriptFiles', config.assets.js);
      grunt.config.set('applicationCSSFiles', config.assets.css);
    }
  );

  // Default task
  grunt.registerTask('default', ['lint', 'concurrent:default']);

  // Debug task
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Lint task
  grunt.registerTask('lint', ['jshint', 'csslint']);

  // Build task
  grunt.registerTask('build',
    [
      'lint',
      'loadConfig',
      'ngAnnotate',
      'uglify',
      'cssmin'
    ]
  );

  // Test task
  grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit', 'protractor']);
  grunt.registerTask('e2e', ['env:test', 'protractor']);

  // Run the project in production mode
  grunt.registerTask('prod', ['build', 'env:prod', 'concurrent:default']);

  // Send coverage results to coveralls.io
  grunt.registerTask('coverage', ['mocha_istanbul', 'lcovMerge']);
};
