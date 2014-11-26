var config = require('./config');
var gulp = require('gulp');

gulp.task('watch', function () {
  gulp.watch(config.allScriptsSrc, ['scripts']);
  gulp.watch(config.allStylesSrc, ['styles']);
});
