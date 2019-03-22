
'use strict';

module.exports = function(grunt) {
  return {

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
  };
};
