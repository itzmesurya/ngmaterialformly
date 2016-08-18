(function () {
    'use strict';

    angular.module('main', [
        /* Vendor modules */
        'ngRoute',
        'ngResource',
        'ngMaterial',
        'formly',
        'md.chips.select',
        'ngTable',

        /*Custom modules */
        'directives',
        'vanilla.demo',
        'demo'
    ]);

    var mainApp = angular.module('main');

    mainApp.config(function ($routeProvider) {
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
                console.log(scope);
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
                console.log(scope.to);
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

        formlyConfigProvider.setType({
            name: 'ng-table',
            template: ' <table ng-table="model[options.key]" class="table table-bordered">\
                        <tbody>\
                            <tr ng-repeat="row in $data">\
                                <td data-title="\'Name\'" filter="{name: \'text\'}" sortable="\'name\'">{{row.name}}</td>\
                                <td data-title="\'Age\'" filter="{age: \'number\'}" sortable="\'age\'">{{row.age}}</td>\
                                <td data-title="\'Balance\'" filter="{balance: \'number\'}" sortable="\'balance\'">{{row.balance}}</td>\
                                <td></td>\
                            </tr>\
                        </tbody>\
                    </table>',
            link: function (scope, el, attr) {
                console.log(scope.to);
            },
            controller: function () {
                var t = 0;
            }
        });

    });

})();