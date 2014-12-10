var config = {};

config.examplePath = 'example';
config.exampleDataPath = config.examplePath + '/data';
config.exampleDistPath = config.examplePath + '/dist';

config.metadataSrc = config.exampleDataPath + '/**/metadata.json';
config.collectionMetadataSrc = config.exampleDataPath + '/collection-metadata.json';
config.injectedMetadataDist = config.exampleDistPath + '/data';
config.injectedMetadataSrc = config.injectedMetadataDist + '/**/*';
config.combinedDataFilePath = config.exampleDistPath + '/data.min.json';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var merge = require('merge-stream');
var glob = require('glob');
var fs = require('fs');
var Q = require('q');

// ---  --- //

gulp.task('data', ['merge-data']);

gulp.task('merge-data', ['inject-data-descriptions'], function () {
  var metadataPromises = [];
  var metadataArray = [];
  var collectionMetadata;

  glob.sync(config.injectedMetadataSrc)
      .forEach(readInjectedDescription.bind(this, metadataPromises, metadataArray));

  readCollectionMetadata(metadataPromises);

  return Q.all(metadataPromises)
    .then(sortMetadata.bind(this, metadataArray))
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

  function readCollectionMetadata(metadataPromises) {
    var deferred = Q.defer();

    // Read the metadata from the given file
    fs.readFile(config.collectionMetadataSrc, function (err, data) {
      if (err) {
        deferred.reject(err);
      } else {
        collectionMetadata = JSON.parse(data);
        deferred.resolve();
      }
    });

    metadataPromises.push(deferred.promise);
  }

  function sortMetadata(metadataArray) {
    metadataArray.sort(timeStringComparator);

    // ---  --- //

    function timeStringComparator(a, b) {
      return dateToNumber(b.date) - dateToNumber(a.date);
    }

    function dateToNumber(d) {
      var dateParts;
      var dateString = typeof d === 'object' ? d.end : d;

      if (dateString.toLowerCase() === 'present') {
        return Number.MAX_VALUE;
      } else {
        dateParts = dateString.split('/');

        switch (dateParts.length) {
          case 1:
            return parseInt(dateParts[0]);
          case 2:
            return parseInt(dateParts[1]) + parseInt(dateParts[0]) * 0.01;
          case 3:
            return parseInt(dateParts[2]) + parseInt(dateParts[1]) * 0.01 + parseInt(dateParts[0]) * 0.0001;
          default:
            throw new Error('Invalid date string format: ' + dateString);
        }
      }
    }
  }

  function writeMergedMetadata(metadataArray) {
    var deferred = Q.defer();

    var combinedMetadataObject = {
      collectionMetadata: collectionMetadata,
      posts: metadataArray
    };

    var combinedMetadataString = JSON.stringify(combinedMetadataObject);

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

gulp.task('inject-data-descriptions', ['clean-data'], function () {
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

gulp.task('clean-data', function () {
  return gulp.src([config.exampleDistPath], {read: false})
      .pipe(plugins.clean());
});
