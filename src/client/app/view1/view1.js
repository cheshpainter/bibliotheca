(function() {
    'use strict';

    angular.module('biblio.view1', ['ui.grid'])
        .controller('View1Ctrl', View1Ctrl);

    View1Ctrl.$inject = ['$scope'];

    function View1Ctrl($scope) {

      console.log("loading view1 ctrl");

        var vm = this;

        vm.gridOptions = {
            data: []
        };

        vm.gridOptions.columnDefs = [{
            name: 'Title',
            field: 'title'
        }, {
            name: 'Author(s)',
            field: 'name'
        }, {
            name: 'Edition(s)',
            field: 'EditionCount'
        }];

        //        vm.gridOptions.multiSelect = false;
        //        vm.gridOptions.enableRowSelection = true;
        //        vm.gridOptions.enableRowHeaderSelection = false;

        //        vm.gridOptions.onRegisterApi = function (gridApi) {
        //            vm.gridApi = gridApi;
        //            vm.gridApi.selection.on.rowSelectionChanged($scope, edit);
        //        };

        vm.gridOptions.data = [{
            "title": "The Color of Magic (Discworld #1)",
            "name": "Terry Pratchett",
            "EditionCount": 3
        }];
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
