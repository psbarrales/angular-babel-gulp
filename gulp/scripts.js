'use strict';

import path from 'path';
import gulp from 'gulp';
import conf from './conf';

import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

gulp.task('scripts-reload', () => buildScripts().pipe(browserSync.stream()));

gulp.task('scripts', () => buildScripts());

function buildScripts() {
	return (
		gulp
			.src(path.join(conf.paths.src, '/app/**/*.js'))
			.pipe(
				$.babel()
			)
			// Enable the following two lines if you want linter
			// to check your code every time the scripts reloaded
			//.pipe($.eslint())
			//.pipe($.eslint.format())
			.pipe($.size())
	);
}
