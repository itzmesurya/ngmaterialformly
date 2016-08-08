(function () {
    'use strict';

    angular.module('main', [
        'ngRoute',
        'ngMaterial',
        'directives',
        'demo'
    ]);

    angular.module('main').config(function ($routeProvider) {
        $routeProvider.when('/demo', {
            templateUrl: 'demo/demo.html',
            controller: 'demoController as dc'
        });
    });

})();