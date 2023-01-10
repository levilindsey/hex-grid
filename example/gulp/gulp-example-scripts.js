var config = require('../../gulp/config');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var merge = require('merge-stream');

config.vendorAndHgScriptsNonMinSrc = config.exampleVendorScriptsSrc.slice(0);
config.vendorAndHgScriptsNonMinSrc.push(config.hgScriptsDistNonMinFilePath);

config.vendorAndHgScriptsMinSrc = config.exampleVendorScriptsSrc.slice(0);
config.vendorAndHgScriptsMinSrc.push(config.hgScriptsDistMinFilePath);

gulp.task('example-scripts', gulp.series('hg-scripts', function () {
  // The goal of this function is to generate two versions of the concatenated scripts: one with the minified example
  // source, and one with non-minified. However, both need to have the unadulterated version of the vendor code.

  // TODO: do some more research about streams and whether there is a better way to do this

  var exampleStreamNonMin = gulp.src(config.exampleScriptsSrc)
    .pipe(plugins.plumber())
    .pipe(plugins.concat(config.exampleScriptDistFileName))
    .pipe(plugins.size({title: 'Example scripts before minifying'}));
  var exampleStreamMin = gulp.src(config.exampleScriptsSrc)
    .pipe(plugins.plumber())
    .pipe(plugins.concat(config.exampleScriptDistFileName))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.uglify())
    .pipe(plugins.size({title: 'Example scripts after minifying'}));

  var vendorStreamNonMin = gulp.src(config.vendorAndHgScriptsNonMinSrc)
    .pipe(plugins.plumber())
    .pipe(plugins.concat(config.exampleScriptDistFileName))
    .pipe(plugins.size({title: 'Example vendor scripts'}));
  var vendorStreamMin = gulp.src(config.vendorAndHgScriptsMinSrc)
    .pipe(plugins.plumber())
    .pipe(plugins.concat(config.exampleScriptDistFileName));

  var combinedStreamNonMin = merge(exampleStreamNonMin, vendorStreamNonMin)
    .pipe(plugins.concat(config.exampleScriptDistFileName))
    .pipe(plugins.size({title: 'Combined scripts without minification'}))
    .pipe(gulp.dest(config.exampleDistPath));
  var combinedStreamMin = merge(exampleStreamMin, vendorStreamMin)
    .pipe(plugins.concat(config.exampleScriptDistFileName))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.size({title: 'Combined scripts with minification'}))
    .pipe(gulp.dest(config.exampleDistPath));

  return merge(combinedStreamNonMin, combinedStreamMin);
}));

gulp.task('scripts', gulp.series('example-scripts'));
