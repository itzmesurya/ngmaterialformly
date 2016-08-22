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
            compile: function (element, attributes) {

                return {
                    pre: function (scope, element, attributes, controller, transcludeFn) {
                        //console.log('pre');
                    },
                    post: function (scope, element, attributes, controller, transcludeFn) {
                        //console.log('post');
                    }
                }
            },
            restrict: 'AE',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {
            //console.log('link');
        }
    }
    navBarController.$inject = ['$element'];
    /* @ngInject */
    function navBarController($element) {

    }
})();