(function () {
    'use strict';

    angular.module('biblio.view2', [])
        .controller('View2Ctrl', View2Ctrl);

    View2Ctrl.$inject = ['$scope'];

    function View2Ctrl($scope) {

      console.log("loading view2 ctrl");

        var vm = this;

    }

}());

// (function() {
//     'use strict';
//
//     angular.module('biblio.view2', ['ngRoute'])
//
//     .config(['$routeProvider', function($routeProvider) {
//         $routeProvider.when('/view2', {
//             templateUrl: '/src/client/app/view2/view2.html',
//             controller: 'View2Ctrl'
//         });
//     }])
//
//     .controller('View2Ctrl', [function() {
//
//     }]);
//
// }());
