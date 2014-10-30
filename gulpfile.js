var config = {};

config.srcPath = 'src';
config.distPath = 'dist';
config.examplePath = 'example';
config.publicRoot = './';

config.scriptsSrc = config.srcPath + '/**/*.js';

config.scriptDistFileName = 'hex-grid.js';

config.host = '0.0.0.0';
config.port = '3000';

config.buildTasks = ['scripts', 'watch'];

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

// ---  --- //

gulp.task('scripts', function () {
  return gulp.src(config.scriptsSrc)
      .pipe(plugins.plumber())
      .pipe(plugins.concat(config.scriptDistFileName))
      .pipe(gulp.dest(config.distPath))
      .pipe(plugins.size({title: 'Scripts before minifying'}))
      .pipe(plugins.rename({suffix: '.min'}))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(config.distPath))
      .pipe(plugins.size({title: 'Scripts after minifying'}));
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
  gulp.watch(config.scriptsSrc, ['scripts']);
});

gulp.task('clean', function () {
  return gulp.src([config.distPath], {read: false})
      .pipe(plugins.clean());
});

gulp.task('default', ['clean'], function () {
  gulp.start('server');
});
