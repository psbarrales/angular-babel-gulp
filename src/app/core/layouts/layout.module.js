(() => {
	'use strict';

	angular.module('app.layouts', []).config($stateProvider => {
		$stateProvider.state('app', {
			abstract: true,
			url: '/app',
			templateUrl: 'app/core/layouts/templates/layout.tmpl.html'
		});
	});
})();
