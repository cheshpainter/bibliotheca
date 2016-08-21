(function() {
    'use strict';

    angular.module('biblio.books')
        .controller('BooksDetailCtrl', BooksDetailCtrl);

    BooksDetailCtrl.$inject = ['$scope', 'booksDetail', '$stateParams'];

    function BooksDetailCtrl($scope, booksDetail, $stateParams) {

        console.log("loading Books Detail ctrl");

        var vm = this;

        vm.eidx = $stateParams.eidx;
        vm.fidx = $stateParams.fidx;

        var links = [];
        angular.forEach(booksDetail.Editions, function(edition, eindex) {
            angular.forEach(edition.Formats, function(format, findex) {
                if (vm.eidx !== eindex || vm.fidx !== findex) {
                    links.push({
                        edition: edition.edition,
                        published: edition.published,
                        eidx: eindex,
                        format: format.format,
                        fidx: findex
                    });
                }
            });
        });

        vm.links = links;
        vm.booksDetail = booksDetail;

    }

}());
