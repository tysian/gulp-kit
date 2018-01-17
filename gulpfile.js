var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReaplce = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');
var php = require('gulp-connect-php');
var babili = require("gulp-babili");


var config = {
  dist: 'dist/',
  src: 'src/',
  cssin: 'src/css/**/*.css',
  jsin: 'src/js/**/*.js',
  imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
  htmlin: 'src/*.html',
  phpin: 'src/*.php',
  scssin: 'src/scss/**/*.scss',
  cssout: 'dist/css/',
  jsout: 'dist/js/',
  imgout: 'dist/img/',
  htmlout: 'dist/',
  scssout: 'src/css/',
  cssoutname: 'style.css',
  jsoutname: 'script.js',
  docsin: 'src/docs/*.pdf',
  docsout: 'dist/docs',
  cssreplaceout: 'css/style.css',
  jsreplaceout: 'js/script.js'
};

// setup php server
gulp.task('php', function () {
  php.server({
    base: 'src',
    port: 8010,
    keepalive: true
  });
});

// browsersync reload
gulp.task('reload', function () {
  browserSync.reload();
});

gulp.task('serve', ['sass', 'php'], function () {
  browserSync({
    cors: true,
    open: false,
    proxy: "127.0.0.1:8010",
    port: '8080'
  });

  gulp.watch([config.htmlin, config.jsin, config.phpin], ['reload']);
  gulp.watch(config.scssin, ['sass']);
});

gulp.task('sass', function () {
  return gulp.src(config.scssin)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scssout))
    .pipe(browserSync.stream());
});

gulp.task('css', function () {
  return gulp.src(config.cssin)
    .pipe(concat(config.cssoutname))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.cssout));
});

gulp.task('js', function () {
  return gulp.src(config.jsin)
    .pipe(concat(config.jsoutname))
    .pipe(babili())
    .pipe(gulp.dest(config.jsout));
});

gulp.task('img', function () {
  return gulp.src(config.imgin)
    .pipe(changed(config.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout));
});

gulp.task('html', function () {
  return gulp.src(config.htmlin)
    .pipe(htmlReaplce({
      'css': config.cssreplaceout,
      'js': config.jsreplaceout
    }))
    .pipe(htmlMin({
      sortAttributes: true,
      sortClassName: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(config.dist));
});

gulp.task('clean', function () {
  return del([config.dist]);
});

gulp.task('docs', function () {
  return gulp.src(config.docsin)
    .pipe(gulp.dest(config.docsout));
});

gulp.task('movephp', function () {
  return gulp.src([config.phpin, 'src/*.txt', ])
    .pipe(gulp.dest(config.htmlout));
});
gulp.task('move', function () {
  return gulp.src(['src/lib/**/*.*'])
    .pipe(gulp.dest('dist/lib/'));
});

gulp.task('build', function () {
  sequence('clean', ['html', 'js', 'css', 'img', 'move', 'movephp', 'docs']);
});

gulp.task('default', ['serve']);
