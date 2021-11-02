var config = require('../../gulp/config');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

// ---  --- //

gulp.task('example-styles', ['hg-styles'], function () {
  return gulp.src(config.exampleStylesSrc)
    .pipe(plugins.plumber())
    .pipe(plugins.autoprefixer('last 2 version'))
    .pipe(plugins.rename({basename: 'hex-grid-example'}))
    .pipe(gulp.dest(config.exampleDistPath))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest(config.exampleDistPath));
});
