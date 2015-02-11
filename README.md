# grunt-nugetter

> Download nuget packages

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-nugetter --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-nugetter');
```

## The "nugetter" task

### Overview
In your project's Gruntfile, add a section named `nugetter` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  nugetter: {
    options: {
      // Task-specific options go here.
    }
  },
});
```

### Options

#### options.id
Type: `String`
Default value: `''`

The id of the nuget package you want to download.

#### options.version
Type: `String`
Default value: `''`

The optional version you would like to download.  If not given, downloads latest.

#### options.server
Type: `String`
Default value: `'http://nuget.org/api/v2/'`

Allows you to point to internal nuget server.

#### options.dest
Type: `String`
Default value: `'%(id)s.zip'`

Where the unzipped files should be stored.  Option supports referencing other options as a named parameter.

#### options.tmp
Type: `String`
Default value: `'%(id)s.zip'`

Where the package sholud be temporarily stored.  Option supports referencing other options as a named parameter.  File is automatically deleted if tmpDelete is true.

#### options.tmpDelete
Type: `Boolean`
Default value: `true`

Whether the temporary package is automatically deleted.

### Usage Examples

#### Default Options
This is the most basic example, using default locations and server to download the jQuery NuGet package.

```js
grunt.initConfig({
  nugetter: {
    options: {
      packages: [
        {
          id: 'jQuery'
        }
      ]
    }
  }
});
```

#### Custom Options
This example shows how to use a custom server, custom destination, and multiple packages.

```js
grunt.initConfig({
  nugetter: {
    options: {
      packages: [
        {
          id: 'jQuery'
        },
        {
          id: 'CustomPackage',
          dest: '_source/nuget/%(id)s
          server: 'http://my-custom-server/api/'
        }
      ]
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
