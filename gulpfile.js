
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
  gulp.start('demon');
});

gulp.task('watch', function () {
  plugins.livereload.listen();

  gulp.watch(distPath + '/**').on('change', plugins.livereload.changed);

  gulp.watch(srcPath + '/**/*.js', ['scripts']);
});

gulp.task('demon', function () {
  plugins.nodemon({
    script: 'example/main.js',
    ignore: [distPath],
    ext: 'js json html css',
    delay: 1.5
  })
      .on('start', ['watch'])
      .on('change', ['watch'])
      .on('restart', function () {
        console.log('Server restarted');
      });
});
