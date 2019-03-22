//test.js task
'use strict';

module.exports = function(grunt) {
  
  // `grunt test`
  grunt.registerTask('test', 'run karma tests', function() {
    grunt.task.run(['jshint:source']);
  });
};