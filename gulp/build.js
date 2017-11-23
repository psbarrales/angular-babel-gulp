'use strict';

import path from 'path';
import gulp from 'gulp';
import conf from './conf';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins({
	pattern: [ 'gulp-*', 'main-bower-files', 'uglify-save-license', 'del' ]
});

gulp.task('partials', () =>
	gulp
		.src([
			path.join(conf.paths.src, '/app/**/*.html'),
			path.join(conf.paths.tmp, '/serve/app/**/*.html')
		])
		.pipe(
			$.htmlmin({
				collapseWhitespace: true,
				maxLineLength: 120,
				removeComments: true
			})
		)
		.pipe(
			$.angularTemplatecache('templateCacheHtml.js', {
				module: 'app',
				root: 'app'
			})
		)
		.pipe(gulp.dest(conf.paths.tmp + '/partials/'))
);

gulp.task('html', [ 'inject', 'partials' ], () => {
	const partialsInjectFile = gulp.src(
		path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'),
		{ read: false }
	);
	const partialsInjectOptions = {
		starttag: '<!-- inject:partials -->',
		ignorePath: path.join(conf.paths.tmp, '/partials'),
		addRootSlash: false
	};

	const cssFilter = $.filter('**/*.css', { restore: true });
	const appFilter = $.filter('**/app*.js', { restore: true });
	const vendorFilter = $.filter('**/vendor*.js', { restore: true });
	const htmlFilter = $.filter('*.html', { restore: true });

	return gulp
		.src(path.join(conf.paths.tmp, '/serve/*.html'))
		.pipe($.inject(partialsInjectFile, partialsInjectOptions))
		.pipe($.useref())
		.pipe(appFilter)
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe($.ngAnnotate())
		.pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
		.on('error', conf.errorHandler('Uglify'))
		.pipe($.rev())
		.pipe($.sourcemaps.write('maps'))
		.pipe(appFilter.restore)
		.pipe(vendorFilter)
		.pipe($.sourcemaps.init())
		.pipe($.ngAnnotate())
		.pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
		.on('error', conf.errorHandler('Uglify'))
		.pipe($.rev())
		.pipe($.sourcemaps.write('maps'))
		.pipe(vendorFilter.restore)
		.pipe(cssFilter)
		.pipe($.sourcemaps.init())
		.pipe($.cleanCss())
		.pipe($.rev())
		.pipe($.sourcemaps.write('maps'))
		.pipe(cssFilter.restore)
		.pipe($.revReplace())
		.pipe(htmlFilter)
		.pipe(
			$.htmlmin({
				collapseWhitespace: true,
				maxLineLength: 120,
				removeComments: true
			})
		)
		.pipe(htmlFilter.restore)
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
gulp.task('fonts', () =>
	gulp
		.src($.mainBowerFiles())
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')))
);

gulp.task('other', () => {
	const fileFilter = $.filter(file => file.stat.isFile());

	return gulp
		.src([
			path.join(conf.paths.src, '/**/*'),
			path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
		])
		.pipe(fileFilter)
		.pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', () =>
	$.del([ path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/') ])
);

gulp.task('build', [ 'html', 'fonts', 'other' ]);
