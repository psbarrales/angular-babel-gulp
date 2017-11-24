(() => {
    'use strict';

    angular.module('app.pages').controller('HomeController', HomeController);

    function HomeController($log) {
        $log.debug('HomeController')
    }
})();