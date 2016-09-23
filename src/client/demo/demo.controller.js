
(function () {
    'use strict';

    angular
        .module('demo')
        .controller('demoController', demoController);

    demoController.$inject = ['$scope', '$log', '$q', '$timeout', '$resource', '$sce', '$compile', '$mdDialog', '$uibModal', 'NgTableParams'];
    function demoController($scope, $log, $q, $timeout, $resource, $sce, $compile, $mdDialog, $uibModal, NgTableParams) {
        $scope.name = 'demoController';
        alert('Demo controller has been loaded!');

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
            "tabData": ["First Tab", "Second Tab"],
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
            },
            {
                key: 'tableData',
                type: 'ng-table',
                templateOptions: {
                    tableParams: dc.tableParams,
                    resourceUrl: 'dummyData/piggyBank.json',
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
                    ],
                    editFormlyFields: [
                        {
                            key: 'name',
                            type: 'md-input',
                            templateOptions: {
                                label: 'Name',
                                req: true,
                                maxlength: 150
                            }
                        },
                        {
                            key: 'balance',
                            type: 'md-input',
                            templateOptions: {
                                label: 'Balance',
                                req: true,
                                maxlength: 15
                            }
                        },
                        {
                            key: 'age',
                            type: 'md-input',
                            templateOptions: {
                                label: 'Age',
                                req: true,
                                maxlength: 3
                            }
                        }
                    ],
                    editFormlyFieldsForTabs: [
                        /** Divide objects as tabs */
                        {
                            heading: "First Tab",
                            fields: [{
                                key: 'name',
                                type: 'md-input',
                                templateOptions: {
                                    label: 'Name',
                                    req: true,
                                    maxlength: 150
                                }
                            },
                                {
                                    key: 'balance',
                                    type: 'md-input',
                                    templateOptions: {
                                        label: 'Balance',
                                        req: true,
                                        maxlength: 15
                                    }
                                }]
                        },
                        {
                            heading: "Second Tab",
                            fields: [
                                {
                                    key: 'age',
                                    type: 'md-input',
                                    templateOptions: {
                                        label: 'Age',
                                        req: true,
                                        maxlength: 3
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                key: 'trNgGridData',
                type: 'bootstrap-tabset'
            },
            {
                key: 'tabData',
                type: 'bootstrap-tabs',
                templateOptions: {
                    tabUrls: [
                        'dummyData/tab1.json',
                        'dummyData/tab2.json'
                    ]
                }
            },
            {
                template: '<div class="well well-sm"><strong>Below is tabstrip template where the title has been created using' +
                ' : <code>uib-tab-heading</code> element inside the <code>ui-tab</code> element</strong></div>'
            },
            {
                type: 'bootstrap-tabstrip',
                templateOptions: {
                    tabs: [
                        { heading: 'First Tab', formName: 'tab1.json' },
                        { heading: 'Second Tab', formName: 'tab2.json' }
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