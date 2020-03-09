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
      electronVersion: '8.1.0',
      appVersion: pkg.version,
      overwrite: true,
      arch: 'x64'
    },

    // `grunt electron:darwin`
    darwin: {
      options: {
        appBundleId: 'com.wazoogames.' + pkg.name,
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
