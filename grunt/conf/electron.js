// electron.js
'use strict';

module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('./package.json');

  return {

    options: {
      asar: true,
      dir: 'build',
      name: pkg.name,
      out: 'dist',
      electronVersion: '3.0.4',
      appVersion: pkg.version,
      overwrite: true,
      arch: 'x64'
    },

    // `grunt electron:darwin`
    darwin: {
      options: {
        appBundleId: 'com.pixelwebsoftware.' + pkg.name,
        appCategoryType: 'games',
        platform: 'darwin'
      }
    },

    // `grunt electron:win32`
    win32: {
      options: {
        versionString: pkg.version,
        platform: 'win32'
      }
    }
  };
};
