
(function () {
    'use strict';

    angular
        .module('demo')
        .controller('demoController', demoController);

    demoController.$inject = ['$scope', '$log'];
    function demoController($scope, $log) {
        activate();
        var dc = this;
        dc.title = 'awesome title';
        dc.options = {
            formState: {
                killerDirective: true
            }
        }

        dc.model = {
            "title": "Gonzales weds York",
            "author": "Hayes Carney",
            "genre": "romedy",
            "read": true
        }


        dc.onSubmit = function () {
            console.log('submitted');
        }

        // md-autocomplete templateOptions
        dc.genres = loadAll();
        dc.querySearch = querySearch;

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

        ];


    }
})();