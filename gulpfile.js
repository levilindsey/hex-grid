
var srcPath = 'src',
    distPath = 'dist',

    gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

gulp.task('scripts', function () {
  return gulp.src(srcPath + '/**/*.js')
      .pipe(plugins.concat('hex-grid.js'))
      .pipe(gulp.dest(distPath))
      .pipe(plugins.filesize())
      .pipe(plugins.rename({ suffix: '.min' }))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(distPath))
      .pipe(plugins.filesize())
      .pipe(plugins.notify({ message: 'scripts task complete' }));
});

gulp.task('clean', function () {
  return gulp.src([distPath], {read: false})
      .pipe(plugins.clean());
});

gulp.task('default', ['clean'], function () {
  gulp.start('scripts');
});

gulp.task('watch', function () {
  gulp.watch(srcPath + '/**/*.js', ['scripts']);
});
