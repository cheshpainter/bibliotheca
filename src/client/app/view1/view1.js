(function() {
    'use strict';

    angular.module('biblio.view1', ['ui.grid'])
        .controller('View1Ctrl', View1Ctrl);

    View1Ctrl.$inject = ['$scope', 'BooksInfo'];

    function View1Ctrl($scope, BooksInfo) {

        var vm = this;

        vm.gridOptions = {
            data: [],
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

        console.log("loading view1 ctrl");

        // var booksInfo = BooksInfo.get({ bookid: 1 }, function() {
        //   console.log(booksInfo);
        // });

        BooksInfo.query(function(booksInfo) {

          console.log(booksInfo);

            angular.forEach(booksInfo, function(row) {
                row.getJointAuthors = function() {
                    return this.authors.join(', ');
                }
            });

            vm.gridOptions = {
                data: booksInfo
            };

            // vm.gridOptions = {
            //     data: booksInfo,
            //     columnDefs: [{
            //         name: 'Title',
            //         field: 'title'
            //     }, {
            //         name: 'Author(s)',
            //         field: 'getJointAuthors()'
            //     }, {
            //         name: 'Edition(s)',
            //         field: 'editionCount'
            //     }]
            // };

            //        vm.gridOptions.multiSelect = false;
            //        vm.gridOptions.enableRowSelection = true;
            //        vm.gridOptions.enableRowHeaderSelection = false;

            //        vm.gridOptions.onRegisterApi = function (gridApi) {
            //            vm.gridApi = gridApi;
            //            vm.gridApi.selection.on.rowSelectionChanged($scope, edit);
            //        };

        });
    }

}());

// (function() {
//     'use strict';
//
//     angular.module('biblio.view1', ['ngRoute'])
//
//     .config(['$routeProvider', function($routeProvider) {
//         $routeProvider.when('/view1', {
//             templateUrl: '/src/client/app/view1/view1.html',
//             controller: 'View1Ctrl'
//         });
//     }])
//
//     .controller('View1Ctrl', [function() {
//
//         console.log('Loading View1Ctrl');
//
//     }]);
//
// }());
