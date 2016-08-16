(function() {
    'use strict';

    angular.module('biblio.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: '/src/client/app/view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', [function() {

        console.log('Loading View1Ctrl');

    }]);

}());
