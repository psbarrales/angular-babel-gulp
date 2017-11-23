'use strict';

import gutil from 'gulp-util';

export default {
	paths: {
		src: 'src',
		dist: 'dist',
		tmp: '.tmp',
		e2e: 'e2e'
	},
	wiredep: {
		directory: 'bower_components'
	},
	errorHandler: title => err => {
		gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
		this.emit('end');
	}
};
