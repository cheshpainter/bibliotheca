(function() {
    'use strict';

    angular.module('biblio.books')
        .controller('UpdateBookCtrl', UpdateBookCtrl);

    UpdateBookCtrl.$inject = ['$scope'];

    function UpdateBookCtrl($scope) {

        console.log("loading Update Book ctrl");

        var vm = this;

    }

}());
