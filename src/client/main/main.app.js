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
                    editFormlyFields: $scope.to.editFormlyFields,
                    editFormlyFieldsForTabs: $scope.to.editFormlyFieldsForTabs,
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

        /** bootstrap tab strip template */
        function bootStrapTabSetController($scope, $log) {
            $log.info('bootStrapTabSet-controller loaded');
            $scope.selectCallBack = function () {
                $log.info('selectCallBack function for bootstrap tabset called');
            }
        }
        bootStrapTabSetController.$inject = ['$scope', '$log'];
        formlyConfigProvider.setType({
            name: 'bootstrap-tabset',
            templateUrl: 'templates/bootstrap-tabset.html',
            link: function (scope, el, attr) {
                console.log('bootStrapTabSet-link function called');
            },
            controller: bootStrapTabSetController
        });

        /** bootstrap tabset with resource calls */
        function bootStrapTabsController($scope, $http) {
            /** initialise a tabs array */
            $scope.tabs = [];
            /** set all the tab objects 
             * a. model
             * b. fields
             * c. options
             * d. form
            */
            for (var index = 0; index < $scope.to.tabUrls.length; index++) {
                /** Creating a tabObj and pushing it into array */
                $scope.tabs.push({
                    url: $scope.to.tabUrls[index],
                    tabName: $scope.model[$scope.options.key][index],
                    heading: $scope.model[$scope.options.key][index],
                    index: index
                });
            }
            /** Get the data of the first tab */
            $http.get($scope.tabs[0].url).then(function (response) {
                console.log(response.data);
                $scope.tabs[0].model = response.data.model;
                $scope.tabs[0].fields = response.data.fields;
            }, function (response) {
                console.log('Error: ' + response.data);
            });

            /** Setting up the select function */
            $scope.select = function ($event, tab) {
                /** get the data for the current tab */
                $http.get(tab.url).then(function (response) {
                    tab.model = response.data.model;
                    tab.fields = response.data.fields;
                    console.log('tab data fetched: ');
                    console.log(tab);
                }, function (response) {
                    console.log('Error: ' + response.data);
                });
            }
        }
        bootStrapTabsController.$inject = ['$scope', '$http'];
        formlyConfigProvider.setType({
            name: 'bootstrap-tabs',
            templateUrl: 'templates/bootstrap-tabs.html',
            link: function (scope, el, attr) {
            },
            controller: bootStrapTabsController
        });

        /** bootstrap tabstrip with resource calls */
        function bootStrapTabStripController($scope, $http) {

            /** initialise a tabs array */
            $scope.tabs = [];

            /** set all the tab objects 
             * a. model
             * b. fields
             * c. options
             * d. form
            */
            // for (var index = 0; index < $scope.to.tabs.length; index++) {
            //     /** Creating a tabObj and pushing it into array */
            //     $scope.tabs.push({
            //         url: $scope.to.tabUrls[index],
            //         tabName: $scope.model[$scope.options.key][index],
            //         heading: $scope.model[$scope.options.key][index],
            //         index: index
            //     });
            // }

            /** initiate tab index */
            // var index = 0;

            // $scope.to.tabs.forEach(function (tab) {
            //     $scope.tabs.push({
            //         heading: tab.heading,
            //         formName: tab.formName,
            //         index: angular.copy(index)
            //     });
            //     /** increment the index */
            //     index++;
            // });

            for (var index = 0; index < $scope.to.tabs.length; index++) {
                /** Creating a tabObj and pushing it into array */
                 $scope.tabs.push({
                    heading: $scope.to.tabs[index].heading,
                    formName: $scope.to.tabs[index].formName,
                    index: index
                });
            }

            /** Get the data of the first tab */
            $http.get('dummyData/' + $scope.tabs[0].formName).then(function (response) {
                console.log(response.data);
                $scope.tabs[0].model = response.data.model;
                $scope.tabs[0].fields = response.data.fields;
            }, function (response) {
                console.log('Error: ' + response.data);
            });

            /** Setting up the select function */
            $scope.select = function ($event, tab) {
                /** get the data for the current tab */
                $http.get('dummyData/' + tab.formName).then(function (response) {
                    tab.model = response.data.model;
                    tab.fields = response.data.fields;
                    console.log('tab data fetched: ');
                    console.log(tab);
                }, function (response) {
                    console.log('Error: ' + response.data);
                });
            }
        }
        bootStrapTabStripController.$inject = ['$scope', '$http'];
        formlyConfigProvider.setType({
            name: 'bootstrap-tabstrip',
            templateUrl: 'templates/bootstrap-tabstrip.html',
            link: function (scope, el, attr) {
            },
            controller: bootStrapTabStripController
        });

    });

})();