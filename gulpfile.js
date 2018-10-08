const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
  gulp.src(['api/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});