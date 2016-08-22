
(function () {
    'use strict';

    angular
        .module('demo')
        .controller('demoController', demoController);

    demoController.$inject = ['$scope', '$log', '$q', '$timeout', '$resource', '$sce', '$compile', '$mdDialog', 'NgTableParams'];
    function demoController($scope, $log, $q, $timeout, $resource, $sce, $compile, $mdDialog, NgTableParams) {
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
            });
        }

        dc.model = {
            "title": "Gonzales weds York",
            "author": "Hayes Carney",
            "genre": "Romedy",
            "read": true,
            "tableData": dc.tableParams,
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

        dc.editBtnClick = function () {
            alert('alert Fired!');
        }

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
                        //         var value = row[this.field];
                        //         var editBtn = '<div align="center"><button type="button" class="btn btn-default" ng-click="openDialog()" >' +
                        //             '<span class="glyphicon glyphicon-edit" ></span></button></div>';
                        //         var res = $sce.trustAsHtml(editBtn);
                        //         return res;
                        //     },
                        //     'openEditDialog': function () {
                        //         alert('alert fired!');
                        //     }
                        // }
                    ]
                }
            }
        ];


    }
})();