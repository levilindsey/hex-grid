
var srcPath = 'src',
    scriptsSrcPath = srcPath + '/**/*.js',
    distPath = 'dist',

    gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

gulp.task('scripts', function () {
  return gulp.src(scriptsSrcPath)
      .pipe(plugins.plumber())
      .pipe(plugins.concat('hex-grid.js'))
      .pipe(gulp.dest(distPath))
      .pipe(plugins.filesize())
      .pipe(plugins.rename({ suffix: '.min' }))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(distPath))
      .pipe(plugins.filesize());
//      .pipe(plugins.livereload());
});

gulp.task('clean', function () {
  return gulp.src([distPath], {read: false})
      .pipe(plugins.clean());
});

gulp.task('default', ['clean'], function () {
  gulp.start('server', 'scripts', 'watch');
});

gulp.task('watch', function () {
  gulp.watch(scriptsSrcPath, ['scripts']);

  plugins.livereload.listen();
  gulp.watch(scriptsSrcPath).on('change', plugins.livereload.changed);
});

gulp.task('server', function () {
//  var tinyLRServer = require('tiny-lr')();
//
//  tinyLRServer.listen(35729);
  plugins.nodemon({script: 'example/main.js'});
});
