/*
 * grunt-nugetter
 * https://github.com/bbBobbyEarl/grunt-nugetter
 *
 * Copyright (c) 2015 Bobby Earl
 * Licensed under the MIT license.
 */

'use strict';

var sprintf = require('underscore.string/sprintf'),
    request = require('request'),
    merge = require('merge'),
    async = require('async'),
    path = require('path'),
    Zip = require('jszip'),
    fs = require('fs');

module.exports = function(grunt) {

  var optionsDefault = {
    id: '',
    version: '',
    server: 'http://nuget.org/api/v2/',
    dest: 'nuget/%(id)s',
    tmp: '%(id)s.zip',
    tmpDelete: true,
    urlLatest: '%(server)sFindPackagesById()?id=\'%(id)s\'&$orderby=Published desc&$top=1',
    urlVersion: '%(server)sPackages(Id=\'%(id)s\',Version=\'%(version)s\''
  };
  
  /**
  * Register the nuggetter task.
  *   - Grab our promise from grunt.
  *   - Merge defaults with task options
  *   - Merge task options with target options
  *   - Determine url based on latest or specific version.
  *   - Initiate request and add event handlers
  **/
  grunt.registerMultiTask('nugetter', 'Download nuget packages', function() {

    /**
    * Create our async callback.
    * Update a few options that have placeholders.
    * Iterate each package requested.
    **/

    var done = this.async();
    var optionsTask = this.options(optionsDefault);
    async.each(optionsTask.packages, function (pkg) {

      /**
      * Requests the json url and adds response + error handlers.
      * Removes old zip + dest directory if they exist.
      **/
      var optionsTarget = merge(true, optionsTask, pkg);
      optionsTarget.tmp = sprintf(optionsTarget.tmp, optionsTarget);
      optionsTarget.dest = sprintf(optionsTarget.dest, optionsTarget);
      optionsTarget.url = sprintf(optionsTarget.version ? optionsTarget.urlVersion : optionsTarget.urlLatest, optionsTarget);

      if (grunt.file.exists(optionsTarget.tmp)) {
        grunt.file.delete(optionsTarget.tmp);
      }
      if (grunt.file.exists(optionsTarget.dest)) {
        grunt.file.delete(optionsTarget.dest);
      }

      grunt.verbose.writeln('Initial request to nuget server %s', optionsTarget.url);
      request({ url: optionsTarget.url, json: true }, function (error, response, body) {

        /**
        * Handles the json body being returned.
        * Finds the appropriate download url.
        **/
        var url;
        if (optionsTask.version && body.d) {
          url = body.d.__metadata.media_src;
        } else if (typeof body.d[0] !== 'undefined') {
          url = body.d[0].__metadata.media_src
        }

        if (url) {

          grunt.verbose.writeln('Download url successfully located: %s', url);
          request(url).pipe(fs.createWriteStream(optionsTarget.tmp)).on('close', function() {

            /**
            * Handles a successful package download.
            **/
            grunt.verbose.writeln('%s successfully downloaded.', optionsTarget.tmp);
            var zip = new Zip(fs.readFileSync(optionsTarget.tmp), {checkCRC32: true});
            Object.keys(zip.files).map(function (key) {

              /**
              * Called for each file/folder in the package
              **/
              var file = zip.files[key];
              var separatorUniversal = '/'
              var separatorProblems = new RegExp(path.sep.replace('\\', '\\\\'), 'g');
              var dest = path.join(optionsTarget.dest, key).replace(separatorProblems, separatorUniversal);
              var dir = path.dirname(dest);

              if (dest.slice(-1) === separatorUniversal) {
                grunt.verbose.writeln('Creating directory: %s', dest);
                grunt.file.mkdir(dir);
              } else {
                grunt.verbose.writeln('Creating file: %s', dest);
                grunt.file.mkdir(dir);
                fs.writeFileSync(dest, file.asNodeBuffer());
              }

            });
            if (optionsTarget.tmpDelete) {
              grunt.file.delete(optionsTarget.tmp);
            }

          });

        } else {
          onPackageError('Error parsing NuGet response.');
        }

      }).on('error', onPackageError);

    }, onPackageError);
    
  });
  
  /**
  * Handles all request response errors (and done technically)
  **/
  function onPackageError(error) {
    if (error) {
      grunt.fail.fatal(error);
    }
    done();
  }

};  // export
