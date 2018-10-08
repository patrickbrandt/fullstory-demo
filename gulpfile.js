const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
  gulp.src(['api/**/*.js',
    'feedback-portal/src/*.js',
    'homesite/src/**/*.js',
    '!feedback-portal/src/serviceWorker.js',
    '!feedback-portal/src/index.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
