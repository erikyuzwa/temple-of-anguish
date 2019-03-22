
//watch.js
'use strict';

module.exports = function(grunt) {

  return {
    // `grunt watch:bower`
    bower: {
      files: ['bower.json'],
      tasks: ['wiredep']
    },
      
    // `grunt watch:js`
    js: {
      files: ['app/scripts/{,*/}*.js'],
      tasks: ['newer:jshint:all'],
      options: {
        livereload: '35729'
      }
    },
    
    // `grunt watch:jsTest`
    jsTest: {
      files: ['test/spec/{,*/}*.js'],
      tasks: ['newer:jshint:test', 'karma']
    },
    
    // `grunt watch:compass`
    compass: {
      files: ['app/styles/{,*/}*.{scss,sass}'],
      tasks: ['compass:server', 'autoprefixer:server']
    },
    
    // `grunt watch:gruntfile`
    gruntfile: {
      files: ['Gruntfile.js']
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
  };
};