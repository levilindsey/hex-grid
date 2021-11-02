var config = require('./config');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('hg-styles', function () {
  return gulp.src(config.hgStylesSrc)
    .pipe(plugins.plumber())
    .pipe(plugins.autoprefixer('last 2 version'))
    .pipe(plugins.rename({basename: 'hex-grid'}))
    .pipe(gulp.dest(config.hgDistPath))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest(config.hgDistPath));
});
