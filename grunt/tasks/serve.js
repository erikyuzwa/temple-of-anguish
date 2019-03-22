//serve.js task
'use strict';

module.exports = function(grunt) {
  
  // `grunt serve`
  grunt.registerTask('serve', 'lint and host the source', function() {
    grunt.task.run(['jshint:source', 'connect:local']);
  });
};