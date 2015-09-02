var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var ghPages = require('gulp-gh-pages');

var merge = require('merge-stream');

gulp.task('default', function () {
  var scripts = gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));

  var pages = gulp.src('src/public/**')
    .pipe(gulp.dest('build'));

  merge.apply(this, [
    scripts,
    pages
  ]);
});

 
gulp.task('deploy', function() {
  // must push to `master` branch for root domains, such as:
  // consolecowboys.github.io 
  // or push to `gh-pages` for sub-sites, such as:
  // consolecowboys.github.io/sub-site-name
  return gulp.src('build/**/*').pipe(ghPages({ branch: 'master' }));
});
