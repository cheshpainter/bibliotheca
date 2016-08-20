'use strict';

// Declare app level module which depends on views, and components
angular.module('biblio', [
        'ui.router',
        'ngResource',
        'biblio.books',
        'biblio.view2',
        'biblio.version'
    ]).config(function($stateProvider, $urlRouterProvider) {

        console.log("loading app.js");

        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/books");
        //
        // Now set up the states
        $stateProvider
            .state('books', {
                url: "/books",
                templateUrl: "/src/client/app/books/books.list.html",
                controller: 'BooksListCtrl',
                controllerAs: 'listCtrl',
                resolve: {
                    booksInfo: function (booksInfoResource) {
                        return booksInfoResource.query().$promise;
                    }
                }
            })
            .state('view2', {
                url: "/view2",
                templateUrl: "/src/client/app/view2/view2.html",
                controller: 'View2Ctrl',
                controllerAs: 'view2Ctrl'
            });
    });
