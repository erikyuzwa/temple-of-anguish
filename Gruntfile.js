
'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    APP: {
      date: new Date(),
      pkg: grunt.file.readJSON('./package.json'),
      env: process.env
    },

    clean: {
      // `grunt clean:build`
      build: ['build/**'],

      // `grunt clean:dist`
      dist: ['dist/**']

    },

    connect: {
      options: {
        port: 3000,
        hostname: '0.0.0.0'
      },

      dev: {
        options: {
          base: 'build',
          keepalive: true
        }
      }
    },

    copy: {
      // `grunt copy:dist`
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: 'build',
          src: [
            '**'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: 'build/images',
          src: ['generated/*']
        }]
      }
    },

    electron: {
      options: {
        asar: true,
        dir: 'build',
        name: '<%= APP.pkg.name %>',
        out: 'dist',
        appVersion: '<%= APP.pkg.version %>',
        overwrite: true,
        arch: 'x64',
        prune: true
      },

      // `grunt electron:darwin`
      darwin: {
        options: {
          appBundleId: 'com.wazoogames.' + '<%= APP.pkg.name %>',
          appCategoryType: 'games',
          platform: 'darwin'
        }
      },

      // `grunt electron:win32`
      win32: {
        options: {
          arch: 'ia32',
          versionString: '<%= APP.pkg.version %>',
          platform: 'win32'
        }
      },

      win64: {
        options: {
          arch: 'x64',
          versionString: '<%= APP.pkg.version %>',
          platform: 'win32'
        }
      }
    },

    jshint: {
      // shared options
      options: {

        // points to jshintrc in root
        jshintrc: '.jshintrc',

        // run linter against all files
        force: true,

        // use custom reporter
        reporter: require('jshint-stylish')
      },

      // `grunt jshint:source`
      source: {
        files: [{
          expand: true,
          cwd: '../app',
          src: [
            '**/*.js'
          ]
        }]
      }
    },

    watch: {
      // `grunt watch:js`
      js: {
        files: ['app/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '35729'
        }
      },

      // `grunt watch:livereload`
      livereload: {
        options: {
          livereload: '35729'
        },
        files: [
          'app/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }

  });

  // `grunt build:darwin`
  grunt.registerTask('build:darwin', 'compile and minify source to build folder for mac.', function() {
    grunt.task.run(['clean', 'copy:dist', 'electron:darwin']);
  });

  // `grunt build:win`
  grunt.registerTask('build:win', 'compile and minify source to build folder for windows.', function() {
    grunt.task.run(['clean', 'copy:dist', 'electron:win32']);
  });

  grunt.registerTask('build', 'build for all platforms', function() {
    grunt.task.run([
        'clean',
        'jshint',
        'copy:dist',
        'electron'
    ]);
  });

  // `grunt serve`
  grunt.registerTask('serve', 'lint and host the source', function() {
    grunt.task.run(['jshint:source', 'connect:dev', 'watch']);
  });

  grunt.registerTask('default', 'build');

  /*
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'grunt/conf'),
    init: true,
    jitGrunt: {
      customTasksDir: 'grunt/tasks',
      staticMappings: {
        useminPrepare: 'grunt-usemin'
      }
    },
    data: {
      pkg: grunt.file.readJSON('./package.json'),
      env: process.env
    }
  });

  // we need a single task in the Gruntfile
  grunt.registerTask('default', 'Grunt.', function() {
    grunt.log.ok(grunt.config('pkg.name'));
    grunt.task.run(['serve']);
  });*/
};
