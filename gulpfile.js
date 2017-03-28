'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var inject = require('gulp-inject');
var runSequence = require('run-sequence');
var angularFilesort = require('gulp-angular-filesort');
var del = require('del');

var temp = '.tmp/';

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
