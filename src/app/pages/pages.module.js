(() => {
	'use strict';

	angular.module('app.pages', []).config($urlRouterProvider => {
		$urlRouterProvider.otherwise('/app/home');
	});
})();
