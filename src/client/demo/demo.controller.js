(function() {
'use strict';

    angular
        .module('demo')
        .controller('demoController', demoController);

    demoController.$inject = ['$scope'];
    function demoController($scope) {
        var dc = this;
        dc.title = 'awesome title';
        activate();
        ////////////////
        function activate() {
            console.log('demoController activated')
         }
    }
})();