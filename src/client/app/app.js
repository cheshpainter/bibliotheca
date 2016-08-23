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
                booksInfo: function(booksInfoResource) {
                    return booksInfoResource.query().$promise;
                }
            },
            params: {
              eidx: 0,
              fidx: 0
            }
        })
        .state('books.detail', {
            url: "^/:bookid",
            views: {
                'detail': {
                    templateUrl: "/src/client/app/books/books.detail.html",
                    controller: 'BooksDetailCtrl',
                    controllerAs: 'detailCtrl',
                    resolve: {
                        booksDetail: function (booksDetailResource, $stateParams) {
                            return booksDetailResource.get({bookid: $stateParams.bookid}).$promise;
                        }
                    }
                }
            }
        })
        .state('books.detail.updateBook', {
            url: "^/updateBook",
            views: {
                'updateBook': {
                    templateUrl: "/src/client/app/books/update-book.html",
                    controller: 'UpdateBookCtrl',
                    controllerAs: 'editCtrl',
                }
            }
        })
        .state('books.detail.updateEdition', {
            url: "^/updateEdition",
            views: {
                'updateEdition': {
                    templateUrl: "/src/client/app/books/update-edition.html",
                    controller: 'UpdateEditionCtrl',
                    controllerAs: 'editCtrl',
                }
            }
        })
        .state('books.detail.createEdition', {
            url: "^/createEdition",
            views: {
                'createEdition': {
                    templateUrl: "/src/client/app/books/create-edition.html",
                    controller: 'CreateEditionCtrl',
                    controllerAs: 'editCtrl',
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
