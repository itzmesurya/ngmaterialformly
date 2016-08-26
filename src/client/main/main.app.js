(function () {
    'use strict';

    angular.module('main', [
        /* Vendor modules */
        'ngRoute',
        'ngResource',
        'ngMaterial',
        'ngSanitize',
        'formly',
        'md.chips.select',
        'ngTable',
        'ui.bootstrap',
        'trNgGrid',

        /*Custom modules */
        'directives',
        'vanilla.demo',
        'demo'
    ]);

    var mainApp = angular.module('main');

    mainApp.config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'demo/demo.html',
            controller: 'demoController as dc'
        });
        $routeProvider.when('/demo', {
            templateUrl: 'demo/demo.html',
            controller: 'demoController as dc'
        });
        $routeProvider.when('/vanillaDemo', {
            templateUrl: 'vanillaDemo/vanillaDemo.html',
            controller: 'vanillaDemoController as vdc'
        });
    });

    mainApp.config(function (formlyConfigProvider) {
        formlyConfigProvider.setType({
            name: 'md-input',
            template: '<md-input-container>' +
            '<label>{{options.templateOptions.label}}</label>' +
            '<input type="text" ng-model="model[options.key]"' +
            ' ng-required=options.templateOptions.req' +
            ' ng-minlength={{options.templateOptions.minlength}}' +
            ' ng-maxlength={{options.templateOptions.maxlength}}>' +
            '</md-input-container>',
            link: function (scope, el, attr) {
                //console.log(scope);
            }
        });

        // md-autocomplete
        formlyConfigProvider.setType({
            name: 'md-autocomplete',
            template: '<md-autocomplete \
                        ng-disabled="to.isDisabled" \
                        md-no-cache="to.noCache" \
                        md-floating-label = "{{to.label}}"\
                        md-selected-item="model[options.key]" \
                        md-search-text-change="to.searchTextChange(vdc.searchText)" \
                        md-search-text="to.searchText" \
                        md-selected-item-change="to.selectedItemChange(item)" \
                        md-items="item in\ to.querySearch(to.searchText)"\
                        md-item-text="item.display" \
                        md-min-length="0" placeholder="{{to.placeHolder}}">\
                        <md-item-template>\
                        <span md-highlight-text="to.searchText" md-highlight-flags="^i">{{item.display}}</span>\
                        </md-item-template>\
                        <md-not-found>\
                            No states matching "{{vdc.searchText}}" were found.\
                            <a ng-click="to.newState(vdc.searchText)">Create a new one!</a>\
                        </md-not-found>\
                    </md-autocomplete>',
            link: function (scope, el, attr) {
                //console.log(scope.to);
            },
            controller: function () {
                var t = 0;
            }
        });

        // md-checkbox
        formlyConfigProvider.setType({
            name: 'md-checkbox',
            template: '<md-checkbox md-no-ink="false"\
                         ng-change="to.onChange()" \
                         ng-model="model[options.key]"\
                         ng-class="to.class"\>\
                        {{to.label}}\
                       </md-checkbox>'
        });

        formlyConfigProvider.setType({
            name: 'md-chips-select',
            template: '<md-chips-select \
                    ng-model="model[options.key]" \
                    select-items="to.selectItems" \
                    main-title="name">\
                    </md-chips-select>'
        });
        /** NG-TABEL STUFF */
        //// ng-table controller 
        var ngTableController = function ($scope, $compile, $resource, $log, $uibModal, NgTableParams) {
            /** create resource if needed */
            $scope.gridResource = null;
            if ($scope.to.resourceUrl)
                $scope.gridResource = $resource($scope.to.resourceUrl);
            /** Setting up edit pop-up */
            /** Create $uibModal for editing */
            /* Configuring a ui bootstrap modal pop-up to open when the page loads */
            /** 1. setting the animation true for the modal*/
            $scope.animatonsEnabled = true;
            /** 2. setting the open function with 'size' as a param*/
            $scope.openUibModal = function (data, row, columns, event) {
                var dialogTitle = '';
                if (!row)
                    dialogTitle = 'Add Record'
                var colDefs = [];
                /**3. Setting up the data for resolution */
                var resolveData = {
                    rowData: row,
                    columns: columns,
                    editFormlyFields: $scope.to.editFormlFields,
                    dialogTitle: dialogTitle
                }

                var modalInstance = $uibModal.open({
                    /** setting the animation true */
                    animation: $scope.animatonsEnabled,
                    /** setting the templateUrl to an html template file */
                    templateUrl: 'templates/ng-table-edit-uibModal.html',
                    /** assign a controller to the modal pop-up, file: "vanillaDemoPageLoadModal.controller.js" */
                    controller: 'ngTableEditUibModalController',
                    /** bind it to the controller objects */
                    controllerAs: 'mc',
                    resolve: {
                        resolveData: resolveData
                    }
                });



                /** setting up the result function */
                modalInstance.result.then(function (rowData) {
                    /** row is undefined while adding a new row item */
                    if (!row) {
                        /** as data is managed in memory array, we need to reload it 
                         * with new row sitting in it
                         */
                        $scope.gridResource.get(function (response) {
                            $scope.newArray = []
                            $scope.newArray = response.data;
                            $scope.newArray.push(rowData);
                            var dataArray = new NgTableParams({}, {
                                dataset: $scope.newArray
                            });
                            $scope.model[$scope.options.key] = dataArray;
                            alert('Data has been added to the grid.' +
                                'Please navigate to the last page, and final record must reflect the' +
                                ' newly added record');
                        });
                    } else {
                        for (var key in row) {
                            if (row.hasOwnProperty(key)) {
                                row[key] = rowData[key];
                            }
                        }
                    }
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }

            /** setting up the delete row */
            $scope.deleteRow = function (rowData) {
            }

        }
        ngTableController.$inject = ['$scope', '$compile', '$resource', '$log', '$uibModal', 'NgTableParams'];

        formlyConfigProvider.setType({
            name: 'ng-table',
            templateUrl: 'templates/ng-table.html',
            link: function (scope, el, attr) {

            },
            controller: ngTableController
        });

        // trNgGrid cnfiguration

        /**setting up the controller */
        var trNgGridController = function ($scope) {
        }
        trNgGridController.$inject = ['$scope'];

        formlyConfigProvider.setType({
            name: 'tr-ng-grid',
            templateUrl: 'templates/tr-ng-grid.html',
            link: function (scope, el, attr) {
                console.log('link funnction of trNgGrid fired from formlyConfig');

            },
            controller: trNgGridController
        });

    });

})();