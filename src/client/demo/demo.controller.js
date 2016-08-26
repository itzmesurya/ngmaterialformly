
(function () {
    'use strict';

    angular
        .module('demo')
        .controller('demoController', demoController);

    demoController.$inject = ['$scope', '$log', '$q', '$timeout', '$resource', '$sce', '$compile', '$mdDialog', '$uibModal', 'NgTableParams'];
    function demoController($scope, $log, $q, $timeout, $resource, $sce, $compile, $mdDialog, $uibModal, NgTableParams) {
        $scope.name = 'demoController';
        activate();
        var dc = this;
        dc.title = 'awesome title';
        dc.options = {
            formState: {
                killerDirective: true
            }
        }

        // $resource for ng-table
        dc.piggyBankResource = $resource('dummyData/piggyBank.json');
        dc.piggyBankAccounts = {};
        getPiggyBankDetails();
        dc.tableParams = null;

        function getPiggyBankDetails() {
            var accDetails = dc.piggyBankResource.get(function (response) {
                dc.piggyBankAccounts = response.data;
                dc.tableParams = new NgTableParams({}, {
                    dataset: response.data
                });
                dc.model["tableData"] = dc.tableParams;
                dc.model["trNgGridData"] = response.data;
            });
        }

        dc.model = {
            "title": "Gonzales weds York",
            "author": "Hayes Carney",
            "genre": "Romedy",
            "read": true,
            "tableData": dc.tableParams,
            "trNgGridData": '',
            "cars": [
                {
                    name: "Mini Cooper",
                    id: 0
                },
                {
                    name: "Lexus IS250",
                    id: 1
                }, {
                    name: "Ford F150",
                    id: 2
                }, {
                    name: "Toyota Prius",
                    id: 3
                }, {
                    name: "Porsche 911",
                    id: 4
                }, {
                    name: "Ferreri 488",
                    id: 5
                }]
        }


        dc.onSubmit = function () {
            console.log('submitted');
        }

        // md-autocomplete templateOptions
        dc.genres = loadAll();
        dc.querySearch = querySearch;
        dc.simulateQuery = true;
        ////////////////
        function activate() {
            console.log('demoController activated')
        }

        /*
         * Build `genres` list of key/value pairs
         */
        function loadAll() {
            var allGenres = 'Comedy,Romedy,Action,Drama,Documentary,Spoof';

            return allGenres.split(/,+/g).map(function (genre) {
                return {
                    value: genre.toLowerCase(),
                    display: genre
                };
            });
        }

        /*
        * Create filter function for a query string
        */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(genre) {
                return (genre.value.indexOf(lowercaseQuery) === 0);
            };

        }

        // ******************************
        // Internal methods
        // ******************************

        /**
         * Search for genres... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch(query) {
            var results = query ? dc.genres.filter(createFilterFor(query)) : dc.genres;
            var deferred;
            if (dc.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        dc.sItems = [
            {
                name: "Mini Cooper",
                id: 0
            },
            {
                name: "Lexus IS250",
                id: 1
            }, {
                name: "Ford F150",
                id: 2
            }, {
                name: "Toyota Prius",
                id: 3
            }, {
                name: "Porsche 911",
                id: 4
            }, {
                name: "Ferreri 488",
                id: 5
            }];
        dc.myItems = [dc.sItems[4], dc.sItems[5]];

        /** Create $uibModal for editing */
        /** Modal functions start */

        /* Configuring a ui bootstrap modal pop-up to open when the page loads */
        /** 1. setting the animation true for the modal*/
        dc.animatonsEnabled = true;
        /** 2. some 'items' to be placed in the modal */
        dc.modalItems = ['item1', 'item2', 'item3'];
        /** 3. setting the open function with 'size' as a param*/
        dc.openUibModal = function (row, size) {
            var modalInstance = $uibModal.open({
                /** setting the animation true */
                animation: dc.animatonsEnabled,
                /** setting the templateUrl to an html template file */
                templateUrl: 'templates/ng-table-edit-uibModal.html',
                /** assign a controller to the modal pop-up, file: "vanillaDemoPageLoadModal.controller.js" */
                controller: 'ngTableEditUibModalController',
                /** bind it to the controller objects */
                controllerAs: 'mc',
                /** setting the size of the modal pop-up */
                size: size,
                resolve: {
                    items: function () {
                        return dc.modalItems;
                    },
                    rowData: row
                }
            });

            /** setting up the result function */
            modalInstance.result.then(function (selectedItem) {
                dc.selectedItem = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        /** Modal functions end */

        dc.formFields = [
            {
                key: 'title',
                type: 'md-input',
                templateOptions: {
                    label: 'Title',
                    req: true,
                    maxlength: 3
                }
            },
            {
                key: 'author',
                type: 'md-input',
                templateOptions: {
                    label: 'Author'
                }
            },
            {
                key: 'genre',
                type: 'md-autocomplete',
                templateOptions: {
                    label: 'Genre',
                    querySearch: dc.querySearch,
                    searchText: '',
                    placeHolder: 'What is Genre?'
                }
            },
            {
                key: 'read',
                type: 'md-checkbox',
                templateOptions: {
                    label: 'Read?',
                    class: 'md-primary',
                    onChange: function () {
                        $log.info('on change fired');
                    }
                }
            },
            {
                type: 'md-checkbox',
                templateOptions: {
                    label: 'Simulate $q ?',
                    class: 'md-primary',
                    onChange: function () {
                        dc.simulateQuery = !dc.simulateQuery;
                    }
                },
                modelOptions: {
                    checked: true
                }
            }
            ,
            {
                key: 'tableData',
                type: 'ng-table',
                templateOptions: {
                    tableParams: dc.tableParams,
                    openDialog: function (row, ev) {
                        /** open the created $uibModal */
                        dc.openUibModal(row);
                    },
                    cols: [
                        {
                            'field': 'name',
                            'title': "Name",
                            'filter': { 'name': 'text' },
                            'sortable': 'name',
                            'getValue': function ($scope, row) {
                                var value = row[this.field];
                                var html = '<div align="center"><a href="https://www.google.co.uk/search?q=' + value + '" target="_blank"><em>' + value + '</em></a>';
                                return $sce.trustAsHtml(html);
                            }
                        },
                        {
                            'field': 'age',
                            'title': "Age",
                            'filter': { 'age': 'number' },
                            'sortable': 'age',
                            'getValue': function ($scope, row) {
                                var value = row[this.field];
                                var html = '<div align="center"><a href="https://www.google.co.uk/search?q=' + value + '" target="_blank"><em>' + value + '</em></a>';
                                return $sce.trustAsHtml(html);
                            }
                        },
                        {
                            'field': 'balance',
                            'title': "Balance",
                            'filter': { 'balance': 'number' },
                            'sortable': 'balance',
                            'getValue': function ($scope, row) {
                                var value = row[this.field];
                                var html = '<div align="center"><a href="https://www.google.co.uk/search?q=' + value + '" target="_blank"><em>' + value + '</em></a>';
                                return $sce.trustAsHtml(html);
                            }
                        }
                        // ,
                        // {
                        //     'field': 'action',
                        //     'title': 'Action',
                        //     'getValue': function ($scope, row) {
                        //         // var value = row[this.field];
                        //         // var editBtn = '<div align="center"><button type="button" class="btn btn-default f-edit" ng-click="openDialog()" >' +
                        //         //     '<span class="glyphicon glyphicon-edit" ></span></button></div>';
                        //         // var res = $sce.trustAsHtml(editBtn);
                        //         // return res;
                        //         return "<input type='button' class='form-control input-sm' ng-model='row[col.field]' />";
                        //     },
                        //     'clickFunc':function () {
                        //         alert('Hello');
                        //     }
                        // }
                    ]
                }
            }

        ];


    }
})();

/** md-dialog code */
// console.log(row);
                        // $mdDialog.show({
                        //     controller: DialogController,
                        //     templateUrl: 'templates/edit-dialog.html',
                        //     parent: angular.element(document.body),
                        //     targetEvent: ev,
                        //     clickOutsideToClose: false,
                        //     fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                        // }).then(function (answer) {
                        //     $scope.status = 'You said the information was "' + answer + '".';
                        //     console.log($scope.status);
                        // }, function () {
                        //     $scope.status = 'You cancelled the dialog.';
                        //     console.log($scope.status);
                        // });

                        // function DialogController($scope, $mdDialog) {

                        //     $scope.hide = function () {
                        //         $mdDialog.hide();
                        //     };

                        //     $scope.cancel = function () {
                        //         $mdDialog.cancel();
                        //     };

                        //     $scope.answer = function (answer) {
                        //         $mdDialog.hide(answer);
                        //     };
                        // }


/** trNgGrid code */
                           // ,
            // {
            //     key: 'trNgGridData',
            //     type: 'tr-ng-grid',
            //     templateOptions: {
            //         itemsPerPage: 10,
            //         getHtml: function (columns) {

            //             var htmlThFieldsString = '<tr>';//'<table tr-ng-grid items="model[options.key]" page-items="to.itemsPerPage"><thead>';
            //             columns.forEach(function (column) {
            //                 htmlThFieldsString = htmlThFieldsString + createFieldThString(column);
            //             }, this);

            //             /**helper functions */
            //             function createFieldThString(column) {
            //                 return '<th field-name="' + column.field + '" display-name="' + column.title + '" display-format="uppercase"></th>'
            //             }
            //             htmlThFieldsString = htmlThFieldsString + '</tr>';//'</thead></table>';
            //             //return $sce.trustAsHtml('<p>Hello</p><input type="text" name="firstname">');
            //             return $sce.trustAsHtml(htmlThFieldsString);
            //         },
            //         cols: [
            //             {
            //                 'field': 'name',
            //                 'title': "Name2",
            //                 'filter': { 'name': 'text' },
            //                 'sortable': 'name',
            //                 'getValue': function ($scope, row) {
            //                     var value = row[this.field];
            //                     var html = '<div align="center"><a href="https://www.google.co.uk/search?q=' + value + '" target="_blank"><em>' + value + '</em></a>';
            //                     return $sce.trustAsHtml(html);
            //                 }
            //             },
            //             {
            //                 'field': 'age',
            //                 'title': "Age",
            //                 'filter': { 'age': 'number' },
            //                 'sortable': 'age',
            //                 'getValue': function ($scope, row) {
            //                     var value = row[this.field];
            //                     var html = '<div align="center"><a href="https://www.google.co.uk/search?q=' + value + '" target="_blank"><em>' + value + '</em></a>';
            //                     return $sce.trustAsHtml(html);
            //                 }
            //             },
            //             {
            //                 'field': 'balance',
            //                 'title': "Balance",
            //                 'filter': { 'balance': 'number' },
            //                 'sortable': 'balance',
            //                 'getValue': function ($scope, row) {
            //                     var value = row[this.field];
            //                     var html = '<div align="center"><a href="https://www.google.co.uk/search?q=' + value + '" target="_blank"><em>' + value + '</em></a>';
            //                     return $sce.trustAsHtml(html);
            //                 }
            //             }
            //         ]
            //     }
            // }