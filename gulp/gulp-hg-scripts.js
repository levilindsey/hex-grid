var config = require('./config');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var merge = require('merge-stream');

gulp.task('hg-scripts', function () {
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

  var vendorStream1 = gulp.src(config.hgVendorScriptsSrc)
    .pipe(plugins.plumber())
    .pipe(plugins.concat(config.scriptDistFileName))
    .pipe(plugins.size({title: 'hex-grid vendor scripts'}));
  var vendorStream2 = gulp.src(config.hgVendorScriptsSrc)
    .pipe(plugins.plumber())
    .pipe(plugins.concat(config.scriptDistFileName));

  var combinedStreamNonMin = merge(hgStreamNonMin, vendorStream1)
    .pipe(plugins.concat(config.scriptDistFileName))
    .pipe(plugins.size({title: 'Combined scripts without minification'}))
    .pipe(gulp.dest(config.hgDistPath));
  var combinedStreamMin = merge(hgStreamMin, vendorStream2)
    .pipe(plugins.concat(config.scriptDistFileName))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.size({title: 'Combined scripts with minification'}))
    .pipe(gulp.dest(config.hgDistPath));

  return merge(combinedStreamNonMin, combinedStreamMin);
});
