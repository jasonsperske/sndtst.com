const gulp = require('gulp')
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const flatten = require('gulp-flatten')
const concat = require('gulp-concat')
const rename = require('gulp-rename')

gulp.task('script', () => {
  return gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/popper.js/dist/umd/popper.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/jplayer/dist/jplayer/jquery.jplayer.js',
    'node_modules/typeahead.js/dist/typeahead.bundle.js',
    'src/js/clippy.js',
    'src/js/sndtst.js'], {base: '.'})
    .pipe(uglify())
    .pipe(concat('sndtst.min.js'))
    .pipe(gulp.dest('static/js/'))
})

gulp.task('style', () => {
  return gulp.src('src/style/sndtst.scss')
             .pipe(sass({
               paths: [ '.' ]
             }))
             .pipe(cleanCSS())
             .pipe(rename('sndtst.min.css'))
             .pipe(gulp.dest('static/css/'))
})

gulp.task('jplayer', () => {
  return gulp.src([
    'node_modules/jplayer/dist/jplayer/*.swf'], {base: './'})
    .pipe(flatten())
    .pipe(gulp.dest('static/js/'))
})

gulp.task('fonts', () => {
  return gulp.src([
    'node_modules/font-awesome/fonts/*'], {base: './'})
    .pipe(flatten())
    .pipe(gulp.dest('static/fonts/'))
})

gulp.task('watch', () => {
  gulp.watch('./src/js/*.js', ['script'])
  gulp.watch('./src/style/*.scss', ['style'])
})

gulp.task('default', ['script', 'style', 'fonts', 'jplayer'])
