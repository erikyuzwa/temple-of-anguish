
'use strict';

module.exports = function(grunt) {
  return {
    
    options: {
      dest: 'build',
      flow: {
        html: {
          steps: {
            js: ['concat', 'uglifyjs'],
            css: ['cssmin']
          },
          post: {}
        }
      }
    },
    html: ['app/index.html']
  };
};
