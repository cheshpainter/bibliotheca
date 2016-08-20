(function() {
    'use strict';

    angular.module('biblio.view1', ['ui.grid'])
        .controller('View1Ctrl', View1Ctrl);

    View1Ctrl.$inject = ['$scope', 'booksInfo'];

    function View1Ctrl($scope, booksInfo) {

        var vm = this;

        console.log("loading view1 ctrl");

        angular.forEach(booksInfo, function(row) {
            row.getJointAuthors = function() {
                return this.authors.join(', ');
            }
        });

        vm.gridOptions = {
            data: booksInfo,
            columnDefs: [{
                name: 'Title',
                field: 'title'
            }, {
                name: 'Author(s)',
                field: 'getJointAuthors()'
            }, {
                name: 'Edition(s)',
                field: 'editionCount'
            }]
        };

        //        vm.gridOptions.multiSelect = false;
        //        vm.gridOptions.enableRowSelection = true;
        //        vm.gridOptions.enableRowHeaderSelection = false;

        //        vm.gridOptions.onRegisterApi = function (gridApi) {
        //            vm.gridApi = gridApi;
        //            vm.gridApi.selection.on.rowSelectionChanged($scope, edit);
        //        };
    }

}());
