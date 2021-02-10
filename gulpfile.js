// Add our dependencies
const { src, dest, watch, parallel, series } = require("gulp");
const concat = require('gulp-concat'); // Gulp File concatenation plugin
const fileinclude = require('gulp-file-include');
const del = require('del');
const formatHtml = require('gulp-format-html');
const liveReload = require('gulp-livereload');
const removeCode = require('gulp-remove-code');


// Configuration
var configuration = {
	paths: {
		src: {
			html: './src/*.html',
			css: './src/css/*.css',
			js: './src/scripts/*.js',
			static: './src/static/**/*'
		},
		dist: './dist'
	}
}

function clean() {
	return del(['dist/**/*']);
};

// Gulp task to copy HTML files to output directory
function html(prod) {
	return src(configuration.paths.src.html)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(removeCode({ production: prod }))
		.pipe(formatHtml())
		.pipe(dest(configuration.paths.dist))
		.pipe(liveReload());
};

// Gulp task to concatenate our css files
function css() {
	return src(configuration.paths.src.css)
		.pipe(concat('site.css'))
		.pipe(dest(configuration.paths.dist + '/css'))
		.pipe(liveReload());
};

// Gulp task to concatenate our css files
function js() {
	return src(configuration.paths.src.js)
		.pipe(concat('site.js'))
		.pipe(dest(configuration.paths.dist + '/scripts'))
		.pipe(liveReload());
};

// Gulp task to concatenate our css files
function static() {
	return src(configuration.paths.src.static)
		.pipe(dest(configuration.paths.dist + '/'))
		.pipe(liveReload());
};

function watchall() {
	liveReload.listen({
		port: 8010,
	});

	return watch('./src/**/*', series(html, css, js, static));
};


exports.clean = clean;
exports.build = series(clean, () => html(false), css, js, static);
exports.publish = series(clean, () => html(true), css, js, static);
exports.watch = watchall;

exports.default = series(exports.build, watchall);