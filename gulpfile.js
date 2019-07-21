'use strict';

// GULP
const gulp 			= require('gulp');

//HTML
const htmlMin		= require('gulp-htmlmin');
const htmlReplace 	= require('gulp-html-replace');

//CSS
const sass 			= require('gulp-sass');
const cssnano 		= require('gulp-cssnano');
const autoprefixer 	= require('gulp-autoprefixer');

// JS
const concat 		= require('gulp-concat');
const babel 		= require('gulp-babel');

// UTILITY
const sourcemaps 	= require('gulp-sourcemaps');
const watch 		= require('gulp-watch');
const browserSync	= require('browser-sync');
const changed 		= require('gulp-changed');
const sequence 		= require('run-sequence');

//IMAGES
const imagemin 		= require('gulp-imagemin')

// use gulp-plumber in case of errors crashing

const dirs = {
	nodeModules: './node_modules',
	src: './src',
	dist: './dist'
};

gulp.task('sass', () => {
	return gulp.src(dirs.src + '/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
				outputStyle: 'compressed',
				errLogToConsole: true
			})
			.on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 3 versions']
		}))
		.pipe(concat('style.min.css'))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest(dirs.dist + '/css'))
		.pipe(browserSync.stream());

});

gulp.task('js', () => {
	return gulp.src(dirs.src + '/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('scripts.min.js'))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest(dirs.dist + '/js'));
});

gulp.task('styles-dependencies', () => {
	return gulp.src([
			// list of css dependencies
			dirs.nodeModules + '/bootstrap/dist/css/bootstrap.min.css',
			dirs.nodeModules + '/@fortawesome/fontawesome-free/css/all.css',
		])
		.pipe(cssnano({
			discardComments: {
				removeAll: true
			}
		}))
		.pipe(concat('dependencies.min.css'))
		.pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('scripts-dependencies', () => {
	return gulp.src([
			//list of js dependencies
			dirs.nodeModules + '/jquery/dist/jquery.min.js',
			dirs.nodeModules + '/popper.js/dist/umd/popper.min.js',
			dirs.nodeModules + '/bootstrap/dist/js/bootstrap.min.js',
		])
		.pipe(concat('dependencies.min.js'))
		.pipe(gulp.dest(dirs.dist + '/js'));
});


gulp.task('img', () => {
	return gulp.src(dirs.src + '/images/**/*.{jpg,jpeg,png,gif,svg,ico}')
		.pipe(changed(dirs.dist + '/images'))
		.pipe(imagemin({
			svgoPlugins: [{
				inlineStyles: true,
				removeComments: true,
				removeTitle: true,
				removeDesc: true,
				removeDimensions: true
			}]
		}))
		.pipe(gulp.dest(dirs.dist + '/images'));
});


gulp.task('html', function () {
	return gulp.src(dirs.src + '/**/*.html')
		.pipe(htmlMin({
			sortAttributes: true,
			sortClassName: true,
			collapseWhitespace: true
		}))
		.pipe(htmlReplace({
			'css': './css/style.min.css',
			'js': './js/scripts.min.js'
		}))
		.pipe(gulp.dest(dirs.dist));
});


gulp.task('fonts', function () {
	return gulp.src([
			dirs.src + '/fonts/**/*',
			dirs.nodeModules + '/@fortawesome/fontawesome-free/webfonts/**/*'
		])
		.pipe(gulp.dest(dirs.dist + '/webfonts'));
});

gulp.task('serve', () => {

	const hosts = 'example.com';

	browserSync.init({
		server: "dist/",
		// proxy: hosts, //use proxy or server
		// host: hosts,
		// open: 'external',
		// port: 3333,
	});

	watch(dirs.src + '/scss/**/*.scss', () => gulp.start('sass'));
	watch(dirs.src + '/js/**/*.js', () => {
		gulp.start('js');
		browserSync.reload();
	});
	watch(dirs.src + '/images/**/*.{jpg,jpeg,png,gif,svg}', () => gulp.start('img'));
	watch(dirs.src + '/fonts/**/*.**', () => gulp.start('fonts'));
	watch('./**/*.html', () => {
		gulp.start('html');
		browserSync.reload();
	}).unwatch('./node_modules');
});


gulp.task('default', () => sequence(['html', 'styles-dependencies', 'scripts-dependencies', 'sass', 'js', 'img', 'fonts'], 'serve'));