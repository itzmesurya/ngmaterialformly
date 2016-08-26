(function () {
    'use strict';

    angular
        .module('directives')
        .directive('bindCompiledHtml', bindCompiledHtml);

    bindCompiledHtml.$inject = ['$compile'];
    function bindCompiledHtml() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: bindCompiledDirectiveController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {
            // scope.$watch(function (scope) {
            //     return scope.$eval(attrs.bindCompiledHtml);
            // }, function (value) {
            //     element.html(value);
            //     $compile(element.contents())(scope);
            // })
        }
    }
    /* @ngInject */
    bindCompiledDirectiveController.$inject = ['$scope', '$element', '$attrs', '$compile'];
    function bindCompiledDirectiveController($scope, $element, $attrs, $compile) {
        // $scope.$watch($attrs.bindCompiledHtml, function (params) {
        //     var compiledElements = $compile(params)($scope);
        //     $element.append(compiledElements);
        // });
        // function compileHtml(html) {
        //     var compiledElements = $compile(html)($scope);
        //     $element.append(compiledElements);
        // }
    }
})();