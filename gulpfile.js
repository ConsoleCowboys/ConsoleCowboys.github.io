var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var ghPages = require('gulp-gh-pages');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var fs = require('fs');
var htmlmin = require('gulp-htmlmin');
var templateData = require('./src/templates/data');
var options = {
  ignorePartials: true,
  batch : ['src/templates/pages', 'src/templates/partials'],
  helpers: require('./src/templates/helpers')
};

gulp.task('watch', function() {
  var watcher = gulp.watch([
    'src/**/*.js',
    'src/**/*.hbs',
  ], ['build']);
  watcher.on('change', function(event) {
    console.log(event.path + ' was ' + event.type + ', running tasks...');
  });
});

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
  fs.readdir('src/templates/pages', function (err, files) {
    if (err) return console.log(err);

    files.forEach(function(file) {
      file = file.split('.');
      file.pop(); // remove .ext
      file = file.join('.');
      gulp.src(['src/templates/index.hbs'])
        .pipe(handlebars(templateData[file], options))
        .pipe(rename(function (path) {
          path.basename = file;
          path.extname = ".html";
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('build'));
    });
  });
});
 
/* must push to `master` branch for root domains, such as:
 *   consolecowboys.github.io 
 * or push to `gh-pages` for sub-sites, such as:
 *   consolecowboys.github.io/sub-site-name */
gulp.task('upload', function() {
  return gulp.src('build/**/*').pipe(ghPages({ branch: 'master' }));
});
