/*
 * grunt-nuget-download
 * https://github.com/bbBobbyEarl/grunt-nuget-download
 *
 * Copyright (c) 2015 Bobby Earl
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('nuget_download', 'Download a nuget package in grunt.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};

/*

  grunt.registerTask(
    NS + 'skyui-nuget', 
    'Downloads the latest (or specified) SkyUI nuget package', 
    function(version) {
      var url = version ? 'site.skyJsonRemoteByVersion' : 'site.skyJsonRemoteById';
      grunt.config.set('site.nugetVersion', version);
      grunt.config.set('site.skyJsonRemote', grunt.config(url));    
      grunt.task.run('http:skyui-nuget-json');
      grunt.task.run('curl:skyui-nuget-download');
      grunt.task.run('unzip:skyui-nuget-unzip');
      //grunt.task.run('copy:skyui-nuget-copy');
    }
  );
  
    // Downloads the latest metadata for a package and finds the download url.
    http: {
      'skyui-nuget-json': {
        options: {
          url: '<%= site.skyJsonRemote %>',
          json: true,
          ignoreErrors: true,
          callback: function(possibleError, response, body) {
            var error, message;
            
            if (possibleError) {
              error = possibleError;
              if (error.code == 'ENOTFOUND') {
                message = 'Blackbaud NuGet server requires LAN / VPN access.'.green.bold;
              }
            } else {
              try {
                var parent = grunt.config('paths.nugetVersion') ? body.d : body.d[0];
                grunt.config.set('paths.skyZipRemote', parent.__metadata.media_src);
                message = 'Found latest SkyUI nuget: ' + grunt.config('paths.skyZipRemote');
              } catch(e) {
                message = 'Error parsing nuget response.';
                error = e;
              }
            }
            
            if (message) {
              grunt.log.writeln(message);
            }
            
            if (error) {
              grunt.fail.fatal(error);
            }
          }
        }
      }
    }
    
    
    // Downloads the latest nuget package, saving it as a zip file.
    curl: {
      'skyui-nuget-download': {
        src: '<%= site.skyZipRemote %>',
        dest: '<%= site.skyZipLocal %>'
      }
    },
    
      // Unzips our nuget package
    unzip: {
      'skyui-nuget-unzip': {
        src: '<%= site.skyZipLocal %>',
        dest: '<%= site.skyZipExpanded %>'
      }
    },
    
      
    // Copies the contents of unzipped nuget package to our _sass directory.
    copy: {
      'skyui-nuget-copy': {
        files: [{
          expand: true,
          cwd: '<%= site.skyZipExpanded %>/Content/Content/Styles/Sky/',
          src: ['**'],
          dest: '<%= site.skyTfsLocal %>'
        }]
      }
    },
*/
