var config = require('./config');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('server', gulp.series('data', 'scripts', 'styles', 'watch', () => {
  plugins.connect.server({
    root: "./",
    livereload: true,
    host: config.host,
    port: config.port,
    fallback: config.exampleDistPath + '/index.html',
  })
}));
