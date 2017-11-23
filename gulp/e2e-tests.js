'use strict';

import path from 'path';
import gulp from 'gulp';
import conf from './conf';

import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor(done) {
	const params = process.argv;
	const args = params.length > 3 ? [ params[3], params[4] ] : [];

	gulp
		.src(path.join(conf.paths.e2e, '/**/*.js'))
		.pipe($.babel())
		.pipe(
			$.protractor.protractor({
				configFile: 'protractor.conf.js',
				args: args
			})
		)
		.on('error', err => {
			// Make sure failed tests cause gulp to exit non-zero
			throw err;
		})
		.on('end', () => {
			// Close browser sync server
			browserSync.exit();
			done();
		});
}

gulp.task('protractor', [ 'protractor:src' ]);
gulp.task('protractor:src', [ 'serve:e2e', 'webdriver-update' ], runProtractor);
gulp.task(
	'protractor:dist',
	[ 'serve:e2e-dist', 'webdriver-update' ],
	runProtractor
);
