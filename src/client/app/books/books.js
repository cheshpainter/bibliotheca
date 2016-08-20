(function() {
    'use strict';

    angular.module('biblio.books', ['ui.grid', 'ui.grid.selection'])
        .controller('BooksListCtrl', BooksListCtrl);

    BooksListCtrl.$inject = ['$scope', 'booksInfo'];

    function BooksListCtrl($scope, booksInfo) {

        var vm = this;

        console.log("loading Books List ctrl");

        angular.forEach(booksInfo, function(row) {
            row.getJointAuthors = function() {
                return this.authors.join(', ');
            }
        });

        vm.gridOptions = {
            data: booksInfo,
            columnDefs: [{
                displayName: 'Title',
                field: 'title'
            }, {
                displayName: 'Author(s)',
                field: 'getJointAuthors()'
            }, {
                displayName: 'Edition(s)',
                field: 'editionCount'
            }]
        };

        console.log(vm.gridOptions);

        vm.gridOptions.multiSelect = false;
        vm.gridOptions.enableRowSelection = true;
        vm.gridOptions.enableRowHeaderSelection = false;

        vm.gridOptions.onRegisterApi = function(gridApi) {
            vm.gridApi = gridApi;
            vm.gridApi.selection.on.rowSelectionChanged($scope, function(row) {
              console.log(row);
            });
        };
    }

}());
