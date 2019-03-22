
'use strict';

var path = require('path');

module.exports = function(grunt) {
  
  require('time-grunt')(grunt);

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
  });
};
