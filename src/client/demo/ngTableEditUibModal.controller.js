(function () {
    'use strict';

    angular
        .module('demo')
        .controller('ngTableEditUibModalController', ngTableEditUibModalController);

    ngTableEditUibModalController.$inject = ['$uibModalInstance', '$scope', 'resolveData'];
    function ngTableEditUibModalController($uibModalInstance, $scope, resolveData) {
        var mic = this;
        mic.dialogTitle = '';
        if (resolveData.dialogTitle === '') {
            mic.dialogTitle = 'Edit row ' + resolveData.rowData.index;
        } else {
            mic.dialogTitle = resolveData.dialogTitle;
        }
        mic.model = angular.copy(resolveData.rowData);
        mic.fields = resolveData.editFormlyFields;
        mic.options = {};
        mic.rowData = angular.copy(resolveData.rowData);
        mic.rowDataFormatted = [];
        if (resolveData.columns)
            resolveData.columns.forEach(function (column) {
                mic.rowDataFormatted.push({ label: column.title(), field: column.field, value: resolveData.rowData[column.field] });
            });

        /** Resolving the data for the modal pop-up.
         * TODO:
         * Need to pass following tab data for each tab
         * to create multiple formly forms in the modal:
         *      a. Model.
         *      b. Options.
         *      c. Form.
         */
        /** multiple tabs  */
        mic.tabData = [];
        /** resolvedData for tab fields resolveData.editFormlyFieldsForTabs 
         * NOTE: it contains objects divided as tabs ie., each object in the 
         * array is one formly form
        */
        if (resolveData.editFormlyFieldsForTabs && resolveData.editFormlyFieldsForTabs.length > 0) {
            resolveData.editFormlyFieldsForTabs.forEach(function (tabObj) {
                var modelObj = {};
                /** pick the fields from the tabObj and create the model*/
                if (tabObj.fields && tabObj.fields) {
                    tabObj.fields.forEach(function (field) {
                        modelObj[field.key] = resolveData.rowData[field.key];
                    });
                }
                /** Once the model is created from the fields
                 * for a given tab, assign it to the model of 
                 * tabData
                 */
                mic.tabData.push(
                    {
                        heading: tabObj.heading,
                        model: modelObj,
                        fields: tabObj.fields
                    }
                )
            });
        }
        console.log(mic.tabData);
        /**!!!TODO!!!: Now that the TabData is ready, we need to create a field on the modal
         * using the bootstrap-tabset template of the formly, but as of now, we are going to 
         * place the bootstrap tab ui on the modal and try!!
         */


        mic.ok = function () {
            /** loop thru tabData to get the model back */
            mic.tabData.forEach(function (tabObj) {
                for (var key in tabObj.model) {
                    if (tabObj.model.hasOwnProperty(key)) {
                        mic.model[key] = tabObj.model[key];
                    }
                }
            });
            $uibModalInstance.close(mic.model);
        };

        mic.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();