'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/view1");
    //
    // Now set up the states
    $stateProvider
        .state('view1', {
            url: "/view1",
            templateUrl: "view1/view1.html",
            controller: 'View1Ctrl',
            controllerAs: 'view1Ctrl'
        })
        .state('view2', {
            url: "/view2",
            templateUrl: "view2/view2.html",
            controller: 'View2Ctrl',
            controllerAs: 'view2Ctrl'
        });
});
