//connect.js
'use strict';

module.exports = function(grunt) {

  return {
    options: {
      port: 3000,
      hostname: '0.0.0.0'
    },

    local: {
      options: {
        base: 'build',
        keepalive: true
      }
    }
    
  };
};