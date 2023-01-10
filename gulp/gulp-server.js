var config = require('./config');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('server', gulp.series('data', 'scripts', 'styles', 'watch', () => {
  return gulp.src(config.publicRoot, {allowEmpty: true})
    .pipe(plugins.webserver({
      host: config.host,
      port: config.port,
      fallback: config.exampleDistPath + '/index.html',
      livereload: true,
      open: true
    }));
}));
