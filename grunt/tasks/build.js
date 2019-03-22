//build.js task
'use strict';

module.exports = function(grunt) {
  
  // `grunt build:darwin`
  grunt.registerTask('build:darwin', 'compile and minify source to build folder for mac.', function() {
    grunt.task.run(['clean', 'copy:dist', 'electron:darwin']);
  });

  // `grunt build:win`
  grunt.registerTask('build:win', 'compile and minify source to build folder for windows.', function() {
    grunt.task.run(['clean', 'copy:dist', 'electron:win32']);
  });
};
