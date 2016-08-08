(function() {
'use strict';

    angular
        .module('main')
        .controller('mainController', mainController);

    mainController.$inject = ['$scope'];
    function mainController($scope) {
        var vm = this;
        activate();
        function activate() { 
            console.log('mainController activated!');
        }
    }
})();