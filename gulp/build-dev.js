'use strict';

import path from 'path';
import gulp from 'gulp';
import conf from './conf';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins({
	pattern: [ 'gulp-*', 'main-bower-files', 'uglify-save-license', 'del' ]
});

gulp.task('html-dev', [ 'inject' ], () => {
	// Copied from styles.js
	const injectFiles = gulp.src(
		[
			path.join(conf.paths.src, '/app/core/global-scss/**/*.scss'),
			path.join(conf.paths.src, '/app/core/**/*.scss'),
			path.join(conf.paths.src, '/app/**/*.scss'),
			path.join(
				'!' + conf.paths.src,
				'/app/core/global-scss/partials/**/*.scss'
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

	gulp
		.src([ path.join(conf.paths.src, '/app/index.scss') ])
		.pipe($.inject(injectFiles, injectOptions))
		.pipe(gulp.dest(path.join(conf.paths.dist, '/app/')));
	// End - Copied from styles.js

	const htmlFilter = $.filter('*.html', { restore: true });
	const appFilter = $.filter('**/app*.js', { restore: true });
	const vendorFilter = $.filter('**/vendor*.js', { restore: true });
	const cssFilter = $.filter('**/*.css', { restore: true });

	return gulp
		.src(path.join(conf.paths.tmp, '/serve/*.html'))
		.pipe($.useref())
		.pipe(appFilter)
		.pipe($.babel())
		.pipe($.ngAnnotate())
		.pipe(appFilter.restore)
		.pipe(vendorFilter)
		.pipe($.ngAnnotate())
		.pipe(vendorFilter.restore)
		.pipe(cssFilter)
		.pipe($.sourcemaps.init())
		.pipe($.sourcemaps.write('maps'))
		.pipe(cssFilter.restore)
		.pipe(gulp.dest(path.join(conf.paths.dist, '/')))
		.pipe(
			$.size({
				title: path.join(conf.paths.dist, '/'),
				showFiles: true
			})
		);
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts-dev', () =>
	gulp
		.src($.mainBowerFiles())
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')))
);

gulp.task('other-dev', () => {
	const fileFilter = $.filter(file => {
		return file.stat.isFile();
	});

	return gulp
		.src([
			path.join(conf.paths.src, '/**/*'),
			path.join('!' + conf.paths.src, '/**/*.{css}'),
			path.join('!' + conf.paths.src, '/app/index.scss')
		])
		.pipe(fileFilter)
		.pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', () =>
	$.del([ path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/') ])
);

gulp.task('build:dev', [ 'html-dev', 'fonts-dev', 'other-dev' ]);
