'use strict';

// Declare app level module which depends on views, and components
angular.module('biblio', [
  'ngRoute',
  'biblio.view1',
  'biblio.view2',
  'biblio.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
