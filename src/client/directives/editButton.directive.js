(function () {
    'use strict';

    angular
        .module('directives')
        .directive('editButton', editButton);


    function editButton() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: editButtonController,
            templateUrl: 'directives/editButton.html',
            controllerAs: 'ebc',
            link: link,
            restrict: 'EA',
            scope: {
                clicke: '&'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            console.log('link from ebc');
        }
    }
    /* @ngInject */
    editButtonController.$inject = ['$mdDialog', '$scope'];
    function editButtonController($mdDialog, $scope) {
        var ebc = this;
        ebc.click = function (rowdata, ev) {
            $mdDialog.show({
                controller: DialogController,
                template: getTemplate(rowdata),
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            }).then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        }

        function getTemplate(rowData) {
            var result = '<md-dialog layout-padding="">';
            for (var key in rowData) {
                if (rowData.hasOwnProperty(key))
                    result += '<b>' + key + '</b><span>' + rowData[key] + "</span>";
            }
            result += '</md-dialog>';
            return result;
            // return '<md-dialog layout-padding="">' +
            //     '<h2>Pre-Rendered Dialog</h2>' +
            //     '<p>' + 'This is a pre-rendered dialog, which means that <code>$mdDialog</code> doesn\'t compile its template on each opening.' +
            //     '<br><br>' +
            //     'The Dialog Element is a static element in the DOM, which is just visually hidden.<br>' +
            //     'Once the dialog opens, we just fetch the element from the DOM into our dialog and upon close' +
            //     'we restore the element back into its old DOM position.' +
            //     '</p>' +
            //     '</md-dialog>';
        }

        function DialogController($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }
    }

})();