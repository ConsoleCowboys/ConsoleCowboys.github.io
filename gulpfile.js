var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var ghPages = require('gulp-gh-pages');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

gulp.task('default', ['build']);
gulp.task('build', ['copy', 'scripts', 'templates']);
gulp.task('deploy', ['build', 'upload']); 

gulp.task('copy', function () {
  var pages = gulp.src('src/public/**').pipe(gulp.dest('build'));
})

gulp.task('scripts', function () {
  var scripts = gulp.src('src/scripts/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

gulp.task('templates', function() {
    var options = {
      //ignores the unknown footer2 partial in the handlebars template,
      //defaults to false 
      ignorePartials: true,
      // partials (hash table of strings)
      // TODO transition to files for next step's import
      partials : { footer : '<footer>the end</footer>' },
      // partials (directories to use for partials)
      batch : ['src/templates/'],
      helpers : {
        capitals : function(str){ return str && str.toUpperCase() || ''; }
      }
    };

    var templateData = { firstName: 'Kaanon' };
    gulp.src('src/templates/*.hbs')
      .pipe(handlebars(templateData, options))
      .pipe(rename(function (path) { path.extname = ".html" }))
      .pipe(gulp.dest('build'));
});
 
gulp.task('upload', function() {
  // must push to `master` branch for root domains, such as:
  // consolecowboys.github.io 
  // or push to `gh-pages` for sub-sites, such as:
  // consolecowboys.github.io/sub-site-name
  return gulp.src('build/**/*').pipe(ghPages({ branch: 'master' }));
});
