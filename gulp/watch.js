'use strict';

import path from 'path';
import gulp from 'gulp';
import gulpWatch from 'gulp-watch';
import conf from './conf';

import browserSync from 'browser-sync';

function isOnlyChange(event) {
	return event.event === 'change';
}

gulp.task('watch', [ 'inject' ], () => {
	gulpWatch([ path.join(conf.paths.src, '/*.html'), 'bower.json' ], () => {
		gulp.start('inject-reload');
	});

	gulpWatch(
		[
			path.join(conf.paths.src, '/app/**/*.css'),
			path.join(conf.paths.src, '/app/**/*.scss')
		],
		event => {
			if (isOnlyChange(event)) {
				gulp.start('styles-reload');
			} else {
				gulp.start('inject-reload');
			}
		}
	);

	gulpWatch(path.join(conf.paths.src, '/app/**/*.js'), event => {
		if (isOnlyChange(event)) {
			gulp.start('scripts-reload');
		} else {
			gulp.start('inject-reload');
		}
	});

	gulpWatch(
		[
			path.join(conf.paths.src, '/app/**/*.json'),
			path.join(conf.paths.src, '/app/**/*.html')
		],
		event => {
			browserSync.reload(event.path);
		}
	);
});
