var gulp = require('gulp');
var glob = require('glob');

var gulpTasksSrc = [
  './gulp/**/*.js',
  '!./gulp/**/config.js',
  './example/gulp/**/*.js',
  '!./example/gulp/**/config.js'
];

loadTasks(gulpTasksSrc);

gulp.task('scripts', ['example-scripts']);
gulp.task('styles', ['example-styles']);

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
