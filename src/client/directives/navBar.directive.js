(function () {
    'use strict';

    angular
        .module('directives')
        .directive('navBar', navBar);


    function navBar() {
        // Usage():
        //
        // Creates: Bootstrap navBar
        //
        var directive = {
            bindToController: true,
            templateUrl: 'directives/navbar.html',
            controller: navBarController,
            controllerAs: 'nbc',
            link: link,
            restrict: 'AE',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }
    navBarController.$inject = [];
    /* @ngInject */
    function navBarController() {

    }
})();