'use strict';

import path from 'path';
import gulp from 'gulp';
import conf from './conf';

import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import * as _ from 'lodash';
import w from 'wiredep';

const $ = gulpLoadPlugins();

const wiredep = w.stream;

gulp.task('inject-reload', [ 'inject' ], () => {
	browserSync.reload();
});

gulp.task('inject', [ 'scripts', 'styles' ], () => {
	const injectStyles = gulp.src(
		[
			path.join(conf.paths.tmp, '/serve/app/**/*.css'),
			path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
		],
		{ read: false }
	);

	const injectScripts = gulp
		.src([
			path.join(conf.paths.src, '/app/**/*.module.js'),
			path.join(conf.paths.src, '/app/**/*.js'),
			path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
			path.join('!' + conf.paths.src, '/app/**/*.mock.js')
		])
		.pipe($.babel())
		.pipe($.angularFilesort())
		.on('error', conf.errorHandler('AngularFilesort'));

	const injectOptions = {
		ignorePath: [ conf.paths.src, path.join(conf.paths.tmp, '/serve') ],
		addRootSlash: false
	};

	return gulp
		.src(path.join(conf.paths.src, '/*.html'))
		.pipe($.inject(injectStyles, injectOptions))
		.pipe($.inject(injectScripts, injectOptions))
		.pipe(wiredep(_.extend({}, conf.wiredep)))
		.pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
