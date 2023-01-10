var config = require('./config');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('clean', function () {
  return gulp.src([config.hgDistPath], {read: false, allowEmpty: true})
    .pipe(plugins.clean({allowEmpty: true}));
});
