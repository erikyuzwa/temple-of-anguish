
//copy.js
'use strict';

module.exports = function(grunt) {

  // Configurable paths for the application
  var pkg = grunt.file.readJSON('./package.json');

  return {

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
  };
};
