
//clean.js
'use strict';

module.exports = function(grunt) {
  return {
    
    // `grunt clean:build`
    build: ['build/**'],

    // `grunt clean:dist`
    dist: ['dist/**']
  };
};
