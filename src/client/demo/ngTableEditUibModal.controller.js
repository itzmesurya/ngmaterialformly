(function () {
    'use strict';

    angular
        .module('demo')
        .controller('ngTableEditUibModalController', ngTableEditUibModalController);

    ngTableEditUibModalController.$inject = ['$uibModalInstance', '$scope', 'resolveData'];
    function ngTableEditUibModalController($uibModalInstance, $scope, resolveData) {
        var $ctrl = this;

        /** Existing pop-up code - DO NOT TOUCH!!!! */
        $ctrl.rowData = angular.copy(resolveData.rowData);
        $ctrl.rowDataFormatted = [];
        resolveData.columns.forEach(function (column) {
            $ctrl.rowDataFormatted.push({ label: column.title(), field: column.field, value: resolveData.rowData[column.field] });
        });

        $ctrl.ok = function () {
            $uibModalInstance.close($ctrl.rowData);
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();