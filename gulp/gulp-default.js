var config = require('./config');
var gulp = require('gulp');

gulp.task('default', gulp.series('clean', 'server'));

