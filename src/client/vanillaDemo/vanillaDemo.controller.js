(function () {
    'use strict';

    angular
        .module('vanilla.demo')
        .controller('vanillaDemoController', vanillaDemoController);

    vanillaDemoController.$inject = ['$log', '$q','$timeout'];
    function vanillaDemoController($log, $q) {
        var vdc = this;

        vdc.simulateQuery = false;
        vdc.isDisabled = false;

        // list of `state` value/display objects
        vdc.genres = loadAll();
        vdc.querySearch = querySearch;
        vdc.selectedItemChange = selectedItemChange;
        vdc.searchTextChange = searchTextChange;

        vdc.newState = newState;

        function newState(state) {
            alert("Sorry! You'll need to create a Constituion for " + state + " first!");
        }

        // ******************************
        // Internal methods
        // ******************************

        /**
         * Search for states... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch(query) {
            var results = query ? vdc.genres.filter(createFilterFor(query)) : vdc.genres,
                deferred;
            if (vdc.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
        }

        /**
         * Build `states` list of key/value pairs
         */
        function loadAll() {
            var allGenres = 'Romedy,Comedy,Drama,Action,Documentary,Spoof';

            return allGenres.split(/,+/g).map(function (genre) {
                return {
                    value: genre.toLowerCase(),
                    display: genre
                };
            });
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };

        }
    }
})();