var gulp = require('gulp');
var glob = require('glob');

var gulpTasksSrc = [
  './gulp/gulp-hg-scripts.js',
  './gulp/gulp-hg-styles.js',
  './example/gulp/gulp-data-tasks.js',
  './example/gulp/gulp-example-scripts.js',
  './example/gulp/gulp-example-styles.js',
  './gulp/gulp-clean.js',
  './gulp/gulp-watch.js',
  './gulp/gulp-server.js',
  './gulp/gulp-default.js',
];

loadTasks(gulpTasksSrc);

// ---  --- //

function loadTasks(includes) {
  includes
    // Expand the glob to get an array of the actual file paths
    .reduce(function (paths, include) {
      return paths.concat(glob.sync(include));
    }, [])
    // Register each task with gulp
    .forEach(function (path) {
      require(path);
    });
}
