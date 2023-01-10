var config = require('./config');
var gulp = require('gulp');

gulp.task('watch', (done) => {
  gulp.watch(config.allScriptsSrc, gulp.series('scripts'));
  gulp.watch(config.allStylesSrc, gulp.series('styles'));
  done();
});
