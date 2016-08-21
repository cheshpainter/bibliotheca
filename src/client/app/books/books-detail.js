(function() {
    'use strict';

    angular.module('biblio.books')
        .controller('BooksDetailCtrl', BooksDetailCtrl);

    BooksDetailCtrl.$inject = ['$scope', 'booksDetail'];

    function BooksDetailCtrl($scope, booksDetail) {

      console.log("loading Books Detail ctrl");

        var vm = this;

        vm.booksDetail = booksDetail;

    }

}());
