
'use strict';

module.exports = function(grunt) {
  return {
    
    options: {
      assetsDirs: [
        'build',
        'build/images',
        'build/styles'
      ],
      patterns: {
        js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
      }
    },

    html: ['build/{,*/}*.html'],
    
    css: ['build/styles/{,*/}*.css'],
    
    js: ['build/scripts/{,*/}*.js']
  };
};
