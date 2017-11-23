(() => {
	'use strict';

	angular.module('app.pages').config($stateProvider => {
		$stateProvider.state('app.home', {
			url: '/home',
			templateUrl: 'app/pages/home/home.tmpl.html',
			controller: 'HomeController'
		});
	});
})();
