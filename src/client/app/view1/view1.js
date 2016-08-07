(function () {
    'use strict';

    angular.module('myApp.view1', ['ui.grid'])
        .controller('View1Ctrl', View1Ctrl);

    View1Ctrl.$inject = ['$scope'];

    function View1Ctrl($scope) {

        var vm = this;

        vm.gridOptions = {
            data: []
        };

        vm.gridOptions.columnDefs = [
            {
                name: 'firstName'
            },
            {
                name: 'lastName'
            }
        ];

        //        vm.gridOptions.multiSelect = false;
        //        vm.gridOptions.enableRowSelection = true;
        //        vm.gridOptions.enableRowHeaderSelection = false;

        //        vm.gridOptions.onRegisterApi = function (gridApi) {
        //            vm.gridApi = gridApi;
        //            vm.gridApi.selection.on.rowSelectionChanged($scope, edit);
        //        };

        vm.gridOptions.data = [{
            "firstName": "Cox",
            "lastName": "Carney"
        }];
    }

}());
