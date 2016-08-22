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

        console.log('eidx: ' + vm.eidx + ', fidx: ' + vm.fidx);

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

        var jointAuthors = '';
        angular.forEach(booksDetail.writtenBy, function(author, index) {
            if (index > 0) {
                jointAuthors += ', ';
            }
            jointAuthors += author.name;
        });

        // Don't add to a resource
        // booksDetail.jointAuthors = jointAuthors;
        vm.jointAuthors = jointAuthors;

        vm.links = links;
        vm.booksDetail = booksDetail;

        console.log(vm.links);
        console.log(vm.booksDetail);

    }

}());
