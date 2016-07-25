var models = require("./models");
var Promise = require("bluebird");

var testd = require('./data/test-data.js');

var books = testd.books;
var authors = testd.authors;
var authorships = testd.authorships;

var Book = models.Book;
var Edition = models.Edition;
var Format = models.Format;
var Author = models.Author;

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

        return Promise.map(iAuthors, function (iAuthor) {
            authorships[iAuthor.name].forEach(function (bookTitle) {
                var iBook = iBooks.find(function (aBook) {
                    return aBook.title === bookTitle;
                });
                iAuthor.addHasWritten(iBook);
            });
            return iAuthor.save();
        });

        //        iAuthors.forEach(function (iAuthor) {
        //            authorships[iAuthor.name].forEach(function (bookTitle) {
        //                var iBook = iBooks.find(function (aBook) {
        //                    return aBook.title === bookTitle;
        //                });
        //                iAuthor.addHasWritten(iBook);
        //            });
        //            iAuthor.save();
        //        });

    });

}).catch(function (error) {
    console.log('Error encountered; cannot sync.' + error);
});
