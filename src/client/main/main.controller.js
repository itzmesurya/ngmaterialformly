(function () {
    'use strict';

    angular
        .module('main')
        .controller('mainController', mainController);

    mainController.$inject = ['$scope', '$mdSidenav'];
    function mainController($scope, $mdSidenav) {
        var vm = this;
        activate();
        function activate() {
            console.log('mainController activated!');
        }
        $scope.openLeftMenu = function () {
            $mdSidenav('left').toggle();
        };
    }
})();