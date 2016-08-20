(function() {
    'use strict';

    angular
        .module('biblio')
        // .config(['$resourceProvider', function($resourceProvider) {
        //     // Don't strip trailing slashes from calculated URLs
        //     $resourceProvider.defaults.stripTrailingSlashes = false;
        // }])
        .constant('API_END_POINT', 'http://localhost:7203')
        .factory('booksInfoResource', function($resource, API_END_POINT) {
            return $resource(API_END_POINT + '/api/books-info/:bookid');
        })
        .factory('booksResource', function($resource, API_END_POINT) {
            return $resource(API_END_POINT + '/api/books/:bookid');
        })
        .factory('editionsResource', function($resource, API_END_POINT) {
            return $resource(API_END_POINT + '/api/books/:bookid/editions/:editionid');
        })
        .factory('formatsResource', function($resource, API_END_POINT) {
            return $resource(API_END_POINT + '/api/books/:bookid/editions/:editionid/formats/:formatid');
        });

}());
