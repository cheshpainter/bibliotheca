var models = require("./models");
var Promise = require("bluebird");

var Book = models.Book;
var Edition = models.Edition;
var Format = models.Format;
var Author = models.Author;

var one = {
    title: 'Dark Orbit',
    sort_title: 'Dark Orbit',
    description: null,
    Editions: [{
        isbn: '0765336294',
        isbn13: null,
        publisher: 'Tor Books (Macmillan)',
        published: '2015-07-14',
        pages: 303,
        edition: '1',
        editionLanguage: 'English',
        Formats: [{
            format: 'Hardcover'
            }]
        }, {
        isbn: null,
        isbn13: null,
        publisher: 'Tor Books',
        published: '2015-07-14',
        pages: 304,
        edition: '2',
        editionLanguage: 'English',
        Formats: [{
            format: 'Kindle Edition'
            }]
        }, {
        isbn: '0765336308',
        isbn13: null,
        publisher: 'Tor Books',
        published: '2016-05-10',
        pages: 0,
        edition: '3',
        editionLanguage: 'English',
        Formats: [{
            format: 'Paperback'
            }]
        }]
};

var books = [{
    title: 'Dark Orbit',
    sort_title: 'Dark Orbit',
    description: null,
    Editions: [{
        isbn: '0765336294',
        isbn13: null,
        publisher: 'Tor Books (Macmillan)',
        published: '2015-07-14',
        pages: 303,
        edition: '1',
        editionLanguage: 'English',
        Formats: [{
            format: 'Hardcover'
            }]
        }, {
        isbn: null,
        isbn13: null,
        publisher: 'Tor Books',
        published: '2015-07-14',
        pages: 304,
        edition: '2',
        editionLanguage: 'English',
        Formats: [{
            format: 'Kindle Edition'
            }]
        }, {
        isbn: '0765336308',
        isbn13: null,
        publisher: 'Tor Books',
        published: '2016-05-10',
        pages: 0,
        edition: '3',
        editionLanguage: 'English',
        Formats: [{
            format: 'Paperback'
            }]
        }]
    }, {
    title: 'The Color of Magic (Discworld #1)',
    sort_title: 'Color of Magic',
    description: null,
    Editions: [{
        isbn: '0060855924',
        isbn13: '9780060855925',
        publisher: 'Harper',
        published: '2005-09-13',
        pages: 288,
        edition: '1',
        editionLanguage: 'English',
        Formats: [{
            format: 'Hardcover'
            }]
        }, {
        isbn: '0061020702',
        isbn13: '9780061020704',
        publisher: 'HarperTorch',
        published: '2000-02-02',
        pages: 241,
        edition: '2',
        editionLanguage: 'English',
        Formats: [{
            format: 'Mass Market Paperback'
            }]
        }, {
        isbn: '0060855908',
        isbn13: '9780060855901',
        publisher: 'Harper Perennial',
        published: '2005-09-13',
        pages: 288,
        edition: '3',
        editionLanguage: 'English',
        Formats: [{
            format: 'Paperback'
            }]
        }]
    }, {
    title: 'The Documents in the Case',
    sort_title: 'Documents in the Case',
    description: null,
    Editions: [{
        isbn: '0061043605',
        isbn13: '9780061043604',
        publisher: 'HarperTorch',
        published: '1995-07-11',
        pages: 272,
        edition: '1',
        editionLanguage: 'English',
        Formats: [{
            format: 'Paperback'
            }, {
            format: 'Hardcover'
            }]
        }]
    }, {
    title: 'Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch',
    sort_title: 'Good Omens',
    description: null,
    Editions: [{
        isbn: '0060853980',
        isbn13: '9780060853983',
        publisher: 'HarperTorch',
        published: '1990-05-01',
        pages: 430,
        edition: '1',
        editionLanguage: 'English',
        Formats: [{
            format: 'Paperback'
            }]
        }]
    }];
var authors = [{
    name: 'Carolyn Ives Gilman'
}, {
    name: 'Terry Pratchett'
}, {
    name: 'Dorothy L. Sayers'
}, {
    name: 'Robert Eustace'
}, {
    name: 'Neil Gaiman'
}];
var authorships = [{
    authorName: 'Terry Pratchett',
    authoredBooks: ['Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch',
                   'The Color of Magic (Discworld #1']
}]

// Force sync all models
models.sequelize.sync({
    force: true
}).then(function () {
    console.log('Successfully sync\'d');

    var mBooks = Promise.map(books, function (book) {
        return Book.create(book, {
            include: [{
                model: Edition,
                include: [Format]
                    }]
        });
    });

    var mAuthors = Promise.map(authors, function (author) {
        return models.Author.create(author);
    });

    Promise.join(mBooks, mAuthors, function (iBooks, iAuthors) {

        // foreach authorship find author, find books

        var iBooksm = new Map();
        iBooks.map(function (ib) {
            iBooksm.put(ib.title, ib)
        });
        var iAuthorsm = new Map();
        iAuthorsm.map(function (ia) {
            iAuthorsm.put(ia.title, ia)
        });


        return Promise.map(authorships, function (authorship) {

            var ab = {
                author: {},
                books: [{}],
                associate: function () {
                    author.setHasWritten(books);
                    author.save();
                }
            };

            //            var ia = iAuthors.find(function (iAuthor) {
            //                return iAuthor.name === authorship.authorName;
            //            });
            //
            //            authorship.authoredBooks.forEach(function (title) {
            //
            //                console.log('Add' + title);
            //
            //                var ib = iBooks.find(function (iBook) {
            //                    return iBook.title === title;
            //                });
            //
            //                ia.addHasWritten(ib);
            //                ia.save();
            //
            //            });

            //            iAuthors[0].addHasWritten(iBooks[0]);
            //            iAuthors[0].addHasWritten(iBooks[1]);
            //            iAuthors[0].save();

            return ab;

        });

    });


    //Load the data.

}).catch(function (error) {
    console.log('Error encountered; cannot sync.' + error);
});
