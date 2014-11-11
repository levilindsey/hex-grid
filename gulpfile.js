var config = {};

config.srcPath = 'src';
config.distPath = 'dist';
config.examplePath = 'example';
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

config.scriptDistFileName = 'hex-grid.js';

config.gulpDataTasksPath = './' + config.examplePath + '/gulp-data-tasks';

config.host = '0.0.0.0';
config.port = '3000';

config.buildTasks = ['scripts', 'data', 'watch'];

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var merge = require('merge-stream');

require(config.gulpDataTasksPath);

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
  return gulp.src([config.distPath], {read: false})
      .pipe(plugins.clean());
});

gulp.task('default', ['clean'], function () {
  gulp.start('server');
});
