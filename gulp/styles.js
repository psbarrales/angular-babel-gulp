'use strict';

import path from 'path';
import gulp from 'gulp';
import conf from './conf';

import browserSync from 'browser-sync';

import gulpLoadPlugins from 'gulp-load-plugins';
import * as w from 'wiredep';
import * as _ from 'lodash';

const $ = gulpLoadPlugins();

const wiredep = w.stream;

gulp.task('styles-reload', [ 'styles' ], () =>
	buildStyles().pipe(browserSync.stream())
);

gulp.task('styles', () => buildStyles());

function buildStyles() {
	const sassOptions = {
		style: 'expanded'
	};

	const injectFiles = gulp.src(
		[
			path.join(conf.paths.src, '/app/core/scss/**/*.scss'),
			path.join(conf.paths.src, '/app/core/**/*.scss'),
			path.join(conf.paths.src, '/app/**/*.scss'),
			path.join(
				'!' + conf.paths.src,
				'/app/main/components/material-docs/demo-partials/**/*.scss'
			),
			path.join(
				'!' + conf.paths.src,
				'/app/core/scss/partials/**/*.scss'
			),
			path.join('!' + conf.paths.src, '/app/index.scss')
		],
		{ read: false }
	);

	const injectOptions = {
		transform: filePath => {
			filePath = filePath.replace(conf.paths.src + '/app/', '');
			return '@import "' + filePath + '";';
		},
		starttag: '// injector',
		endtag: '// endinjector',
		addRootSlash: false
	};

	return gulp
		.src([ path.join(conf.paths.src, '/app/index.scss') ])
		.pipe($.inject(injectFiles, injectOptions))
		.pipe(wiredep(_.extend({}, conf.wiredep)))
		.pipe($.sourcemaps.init())
		.pipe($.sass(sassOptions))
		.on('error', conf.errorHandler('Sass'))
		.pipe($.autoprefixer())
		.on('error', conf.errorHandler('Autoprefixer'))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
}
