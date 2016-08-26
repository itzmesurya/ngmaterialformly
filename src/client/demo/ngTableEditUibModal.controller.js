(function () {
    'use strict';

    angular
        .module('demo')
        .controller('ngTableEditUibModalController', ngTableEditUibModalController);

    ngTableEditUibModalController.$inject = ['$uibModalInstance', '$scope', 'resolveData'];
    function ngTableEditUibModalController($uibModalInstance, $scope, resolveData) {
        var $ctrl = this;
        $ctrl.model = angular.copy(resolveData.rowData);
        $ctrl.fields = resolveData.editFormlyFields;
        $ctrl.options = {};
        /** Existing pop-up code - DO NOT TOUCH!!!! */
        $ctrl.rowData = angular.copy(resolveData.rowData);
        $ctrl.rowDataFormatted = [];
        if (resolveData.columns)
            resolveData.columns.forEach(function (column) {
                $ctrl.rowDataFormatted.push({ label: column.title(), field: column.field, value: resolveData.rowData[column.field] });
            });

        $ctrl.ok = function () {
            $uibModalInstance.close($ctrl.model);
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();