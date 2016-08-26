(function () {
    'use strict';

    angular
        .module('demo')
        .controller('ngTableEditUibModalController', ngTableEditUibModalController);

    ngTableEditUibModalController.$inject = ['$uibModalInstance', '$scope', 'resolveData'];
    function ngTableEditUibModalController($uibModalInstance, $scope, resolveData) {
        var $ctrl = this;
        $ctrl.dialogTitle = '';
        if (resolveData.dialogTitle === '') {
            $ctrl.dialogTitle = 'Edit row ' + resolveData.rowData.index;
        } else {
            $ctrl.dialogTitle = resolveData.dialogTitle;
        }
        $ctrl.model = angular.copy(resolveData.rowData);
        $ctrl.fields = resolveData.editFormlyFields;
        $ctrl.options = {};
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