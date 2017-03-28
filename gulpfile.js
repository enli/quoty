'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var inject = require('gulp-inject');
var runSequence = require('run-sequence');
var angularFilesort = require('gulp-angular-filesort');
var del = require('del');

var mainBowerFiles = require('gulp-main-bower-files');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var csso = require('gulp-csso');

var temp = '.tmp/';
var dist = './dist/';

gulp.task('clean', function () {
  del.sync(temp);
});

gulp.task('build', function () {
  runSequence(
    'clean',
    ['scss-compile', 'copy-html'],
    'inject'
  );
});

gulp.task('serve', ['build', 'watch'], function () {
  browserSync.init({
    server: {
      baseDir: '.tmp',
      routes: {
        '/bower_components': 'bower_components',
        '/src': 'src',
        '/app': 'src/js/app'
      }
    }
  });
});

gulp.task('watch', function () {
  return gulp.watch(['src/**/*.html', 'src/**/*.scss', 'src/**/*.js'],
    function () {
      runSequence(
        ['scss-compile', 'copy-html'],
        'inject',
        '_browserSyncReload'
      );
    });
});

gulp.task('scss-compile', function () {
  return gulp.src(['src/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({dirname: 'css'}))
    .pipe(gulp.dest(temp));
});

gulp.task('copy-html', function () {
  return gulp.src(['src/**/*.html'])
    .pipe(gulp.dest(temp));
});

gulp.task('_browserSyncReload', function (cb) {
  // without timeout, was getting inconsistent index.html
  setTimeout(function () {
    browserSync.reload();
    cb();
  }, 150);
});

gulp.task('inject', function () {
  var target = gulp.src('./src/index.html');
  var cssFiles = gulp.src([temp + '**/*.css']);
  var jsFiles = gulp.src(['src/js/app/**/*.js']);

  // target.pipe(inject(cssFiles))
  //   .pipe(rename({dirname: ''}))
  //   .pipe(gulp.dest(temp));

  return target
    .pipe(inject(jsFiles.pipe(angularFilesort())))
    .pipe(gulp.dest(temp));
});

gulp.task('package', function () {
  runSequence([
    'package:bower-js',
    'package:bower-css',
    'package:app-js',
    'package:app-css',
    'package:app-templates',
    'package:app-json',
    'package:app-index'
  ]);
});

gulp.task('package:bower-js', function () {
  var filterJS = gulpFilter('**/*.js', {restore: true});

  gulp.src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(filterJS)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(filterJS.restore)
    .pipe(gulp.dest(dist + 'js/'));
});

gulp.task('package:bower-css', function () {
  gulp.src('./bower_components/bootstrap/dist/css/*min.css')
    .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('package:app-js', function() {
  gulp.src(['src/js/**/*.js'])
    .pipe(angularFilesort())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist + 'js/'));
});

gulp.task('package:app-css', function() {
  return gulp.src(['src/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(csso())
    .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('package:app-templates', function () {
  var templateCache = require('gulp-angular-templatecache');

  return gulp.src('src/js/**/*.html')
    .pipe(templateCache({module: 'quoty'}))
    .pipe(concat('templates.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist + 'js/'));
});

gulp.task('package:app-json', function () {
  return gulp.src('./src/js/**/*.json')
    .pipe(gulp.dest(dist));
});

gulp.task('package:app-index', function () {
  var rename = require('gulp-rename');

  return gulp.src('./src/index_release.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest(dist));
});
