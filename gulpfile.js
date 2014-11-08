var config = {};

config.srcPath = 'src';
config.distPath = 'dist';
config.examplePath = 'example';
config.exampleDataPath = config.examplePath + '/data';
config.exampleDistPath = config.examplePath + '/dist';
config.nodeModulesPath = 'node_modules';
config.publicRoot = './';

config.hgScriptsSrc = [config.srcPath + '/**/*.js'];
config.vendorScriptsSrc = [
  config.nodeModulesPath + '/showdown/compressed/showdown.js',
  config.nodeModulesPath + '/showdown/compressed/extensions/twitter.js',
  config.nodeModulesPath + '/showdown/compressed/extensions/google-prettify.js',
  config.nodeModulesPath + '/showdown/compressed/extensions/github.js'
];
config.allScriptsSrc = config.hgScriptsSrc.concat(config.vendorScriptsSrc);

config.metadataSrc = config.exampleDataPath + '/**/metadata.json';
config.injectedMetadataDist = config.exampleDistPath + '/data';
config.injectedMetadataSrc = config.injectedMetadataDist + '/**/*';
config.combinedDataFilePath = config.exampleDistPath + '/data.min.json';

config.scriptDistFileName = 'hex-grid.js';

config.host = '0.0.0.0';
config.port = '3000';

config.buildTasks = ['scripts', 'data', 'watch'];

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var merge = require('merge-stream');
var glob = require('glob');
var fs = require('fs');
var Q = require('q');

// ---  --- //

gulp.task('scripts', function () {
  // The goal of this function is to generate two versions of the concatenated scripts: one with the minified hex-grid
  // source, and one with non-minified. However, both need to have the unadulterated version of the vendor code.

  // TODO: do some more research about streams and whether there is a better way to do this

  var hgStreamNonMin = gulp.src(config.hgScriptsSrc)
      .pipe(plugins.plumber())
      .pipe(plugins.concat(config.scriptDistFileName))
      .pipe(plugins.size({title: 'hex-grid scripts before minifying'}));
  var hgStreamMin = gulp.src(config.hgScriptsSrc)
      .pipe(plugins.plumber())
      .pipe(plugins.concat(config.scriptDistFileName))
      .pipe(plugins.rename({suffix: '.min'}))
      .pipe(plugins.uglify())
      .pipe(plugins.size({title: 'hex-grid scripts after minifying'}));

  var vendorStream1 = gulp.src(config.vendorScriptsSrc)
      .pipe(plugins.plumber())
      .pipe(plugins.concat(config.scriptDistFileName))
      .pipe(plugins.size({title: 'Vendor scripts'}));
  var vendorStream2 = gulp.src(config.vendorScriptsSrc)
      .pipe(plugins.plumber())
      .pipe(plugins.concat(config.scriptDistFileName));

  var combinedStreamNonMin = merge(hgStreamNonMin, vendorStream1)
      .pipe(plugins.concat(config.scriptDistFileName))
      .pipe(plugins.size({title: 'Combined scripts without minification'}))
      .pipe(gulp.dest(config.distPath));
  var combinedStreamMin = merge(hgStreamMin, vendorStream2)
      .pipe(plugins.concat(config.scriptDistFileName))
      .pipe(plugins.rename({suffix: '.min'}))
      .pipe(plugins.size({title: 'Combined scripts with minification'}))
      .pipe(gulp.dest(config.distPath));

  return merge(combinedStreamNonMin, combinedStreamMin);
});

gulp.task('data', ['merge-data']);// TODO: this should also inject the paths of all of the image and video files into the metadata

gulp.task('merge-data', ['inject-data-descriptions'], function () {
  var metadataPromises = [];
  var metadataArray = [];

  glob.sync(config.injectedMetadataSrc)
      .forEach(readInjectedDescription.bind(this, metadataPromises, metadataArray));

  return Q.all(metadataPromises)
      .then(writeMergedMetadata.bind(this, metadataArray));

  // ---  --- //

  function readInjectedDescription(metadataPromises, metadataArray, metadataFilePath) {
    var deferred = Q.defer();

    // Read the metadata from the given file and add this to the combined metadata array
    fs.readFile(metadataFilePath, function (err, data) {
      if (err) {
        deferred.reject(err);
      } else {
        metadataArray.push(JSON.parse(data));
        deferred.resolve();
      }
    });

    metadataPromises.push(deferred.promise);
  }

  function writeMergedMetadata(metadataArray) {
    var deferred = Q.defer();
    var combinedMetadataString = JSON.stringify(metadataArray);

    // Write out the combined data
    fs.writeFile(config.combinedDataFilePath, combinedMetadataString, function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  }
});

gulp.task('inject-data-descriptions', function () {
  var streams = [];

  glob.sync(config.metadataSrc)
      .forEach(injectDescription.bind(this, streams));

  // Merge all of the individual streams into one stream
  if (streams.length) {
    return mergeStreams(streams);
  }

  // ---  --- //

  function injectDescription(streams, metadataFilePath) {
    // Determine the file path for the description file that corresponds to the given metadata file
    var dataItemDirectoryPath = metadataFilePath.substr(0, metadataFilePath.indexOf('metadata.json'));
    var descriptionFilePath = dataItemDirectoryPath + 'description.md';
    var dataItemName = dataItemDirectoryPath.substring(config.exampleDataPath.length + 1, dataItemDirectoryPath.length - 1);

    // Create a stream for a single data item to read its description file and inject it into its metadata file
    var stream = gulp.src(metadataFilePath)
        // Inject the description after sanitizing it for JSON
        .pipe(plugins.replace('"content": ""', function () {
          var descriptionData = fs.readFileSync(descriptionFilePath).toString();

          descriptionData = sanitizeForJson(descriptionData);

          return '"content": "' + descriptionData + '"';
        }))
        // Rename the metadata file to match the name of the data item
        .pipe(plugins.rename(function (path) {
          path.basename = dataItemName;
        }))
        // Write out the metadata with the injected description to a separate file
        .pipe(gulp.dest(config.injectedMetadataDist));

    streams.push(stream);
  }

  function mergeStreams(streams) {
    var i, count;
    var totalStream = streams[0];

    for (i = 1, count = streams.length; i < count; i += 1) {
      totalStream = merge(totalStream, streams[i]);
    }

    return totalStream;
  }

  function sanitizeForJson(rawString) {
    return rawString
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\\"')
        .replace(/\//g, '\\/')
        .replace(/\f/g, '\\f')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
  }
});

gulp.task('server', config.buildTasks, function () {
  return gulp.src(config.publicRoot)
      .pipe(plugins.webserver({
        host: config.host,
        port: config.port,
        fallback: config.examplePath + '/index.html',
        livereload: true,
        open: true
      }));
});

gulp.task('watch', function () {
  gulp.watch(config.allScriptsSrc, ['scripts']);
});

gulp.task('clean', function () {
  return gulp.src([config.distPath, config.exampleDistPath], {read: false})
      .pipe(plugins.clean());
});

gulp.task('default', ['clean'], function () {
  gulp.start('server');
});
