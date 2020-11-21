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
      appVersion: pkg.version,
      overwrite: true,
      arch: 'x64',
      prune: true
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
        arch: 'x86',
        versionString: pkg.version,
        platform: 'win32'
      }
    },

    win64: {
      options: {
        arch: 'x64',
        versionString: pkg.version,
        platform: 'win32'
      }
    }
  };
};
