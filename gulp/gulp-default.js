var config = require('./config');
var gulp = require('gulp');

gulp.task('default', ['clean'], function () {
  gulp.start('server');
});
