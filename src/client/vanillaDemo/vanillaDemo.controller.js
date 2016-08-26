(function () {
    'use strict';

    angular
        .module('vanilla.demo')
        .controller('vanillaDemoController', vanillaDemoController);

    vanillaDemoController.$inject = ['$log', '$q', '$timeout', '$resource', '$uibModal', 'NgTableParams'];
    function vanillaDemoController($log, $q, $timeout, $resource, $uibModal, NgTableParams) {
        var vdc = this;


        /* Configuring a ui bootstrap modal pop-up to open when the page loads */
        /** 1. setting the animation true for the modal*/
        vdc.animatonsEnabled = true;
        /** 2. some 'items' to be placed in the modal */
        vdc.modalItems = ['item1', 'item2', 'item3'];
        /** 3. setting the open function with 'size' as a param*/
        vdc.openUibModal = function (size) {
            var modalInstance = $uibModal.open({
                /** setting the animation true */
                animation: vdc.animatonsEnabled,
                /** setting the templateUrl to an html template file */
                templateUrl: 'templates/vdcPageLoadModalContent.html',
                /** assign a controller to the modal pop-up, file: "vanillaDemoPageLoadModal.controller.js" */
                controller: 'vanillaDemoPageLoadControllerController',
                /** bind it to the controller objects */
                controllerAs: 'mc',
                /** setting the size of the modal pop-up */
                size: size,
                resolve: {
                    items: function () {
                        return vdc.modalItems;
                    }
                }
            });

            /** setting up the result function */
            modalInstance.result.then(function (selectedItem) {
                vdc.selectedItem = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        vdc.openUibModal();

        vdc.simulateQuery = false;
        vdc.isDisabled = false;

        // list of `state` value/display objects
        vdc.genres = loadAll();
        vdc.querySearch = querySearch;
        vdc.selectedItemChange = selectedItemChange;
        vdc.searchTextChange = searchTextChange;
        vdc.newState = newState;

        // $resource
        vdc.piggyBankResource = $resource('dummyData/piggyBank.json');
        vdc.piggyBankAccounts = {};
        getPiggyBankDetails();

        function getPiggyBankDetails() {
            var accDetails = vdc.piggyBankResource.get(function (response) {
                vdc.piggyBankAccounts = response.data;
                vdc.tableParams = new NgTableParams({}, {
                    dataset: response.data
                });
            });

        }

        // /**column configuration of ng-table */
        // vdc.tableCols = [{
        //     field: "name",
        //     title: "Name",
        //     show: true,
        //     getValue: htmlValue
        // }];

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

        //// Multi-Select code

        vdc.sItems = [
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
        vdc.myItems = [vdc.sItems[4], vdc.sItems[5]];


        // md-chips
        // 0. Seeting the selected vegetables to an empty array
        vdc.selectedVegetables = [];
        // 1. This step would load all the vegetables into the 
        // md-chips directive
        vdc.vegetables = loadVegetables();
        // 2. Transform expression
        vdc.transformMdChips = function ($chip) {
            console.log($chip);
        }
        // 2. Setting selectedItem for the autocomplete
        vdc.selectedVegetableItem = null;
        // 3. Setting the searchTextChange
        vdc.vegetableSearchText = null;
        // 4. setting the items into autocomplete
        vdc.querySearchVeggies = function (query) {
            var results = query ? vdc.vegetables.filter(createFilterCallBackFunction(query)) : [];
            return results;
        }

        function createFilterCallBackFunction(query) {
            // get the query in lowercase
            var lowercaseQuery = angular.lowercase(query);
            // return the call back function
            return function (vegetable) {
                // return the matching items from the array
                return (vegetable._lowername.indexOf(lowercaseQuery) === 0) ||
                    vegetable._lowertype.indexOf(lowercaseQuery) === 0
            }
        }

        function loadVegetables() {
            var veggies = [
                {
                    'name': 'Broccoli',
                    'type': 'Brassica'
                },
                {
                    'name': 'Cabbage',
                    'type': 'Brassica'
                },
                {
                    'name': 'Carrot',
                    'type': 'Umbelliferous'
                },
                {
                    'name': 'Lettuce',
                    'type': 'Composite'
                },
                {
                    'name': 'Spinach',
                    'type': 'Goosefoot'
                }
            ];

            return veggies.map(function (veg) {
                veg._lowername = veg.name.toLowerCase();
                veg._lowertype = veg.type.toLowerCase();
                return veg;
            });
        }

    }
})();