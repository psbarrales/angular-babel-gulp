(() => {
	'use strict';

	angular
		.module('app', [ 'ui.router', 'ngMaterial', 'app.core', 'app.pages' ])
		.run($log => {
			$log.debug(
				`%cA%cngular%cJS v${angular.version.full}`,
				'background: #dd1c16; font-weight: bold; color: white; padding-right: 3px; padding-left: 3px;',
				'background: white; color: #0d0d0d; padding-left: 2px;',
				'background: white; color: #a6120c; padding-right: 2px;'				
			);

			$log.debug(
				`%cLo%cDash v${_.VERSION}`,
				'background: white; font-weight: bold; color: #0d0d0d; border-bottom: 3px solid #3491ff',
				'background: white; color: #0d0d0d;'
			);
		});
})();
