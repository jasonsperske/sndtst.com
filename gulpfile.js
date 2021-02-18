const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const flatten = require('gulp-flatten');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

function javascript() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/popper.js/dist/umd/popper.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/jplayer/dist/jplayer/jquery.jplayer.js',
    'node_modules/typeahead.js/dist/typeahead.bundle.js',
    'src/js/clippy.js',
    'src/js/sndtst.js'], { base: '.' })
    .pipe(uglify())
    .pipe(concat('sndtst.min.js'))
    .pipe(gulp.dest('static/js/'));
}

function css() {
  return gulp.src('src/style/sndtst.scss')
    .pipe(sass({
      paths: [ '.' ]
    }))
    .pipe(cleanCSS())
    .pipe(rename('sndtst.min.css'))
    .pipe(gulp.dest('static/css/'));
}

function jplayer() {
  return gulp.src([
    'node_modules/jplayer/dist/jplayer/*.swf'], { base: './' })
    .pipe(flatten())
    .pipe(gulp.dest('static/js/'));
}

function fonts() {
  return gulp.src([
    'node_modules/font-awesome/fonts/*'], { base: './' })
    .pipe(flatten())
    .pipe(gulp.dest('static/fonts/'));
}

exports.default = gulp.series(javascript, css, fonts, jplayer);
exports.watch = function() {
  gulp.watch(['src/js/*.js', 'src/css/*.scss'], gulp.series(javascript, css, fonts));
}
