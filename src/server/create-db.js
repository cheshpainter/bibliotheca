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

    var promisedBooks = Promise.map(books, function (book) {
        return Book.create(book, {
            include: [{
                model: Edition,
                include: [Format]
                    }]
        });
    });

    var promisedAuthors = Promise.map(authors, function (author) {
        return models.Author.create(author);
    });

    Promise.join(promisedBooks, promisedAuthors, function (bookInstances, authorInstances) {

        return Promise.map(authorInstances, function (authorInstance) {
            authorships[authorInstance.name].forEach(function (bookTitle) {
                var bookInstance = bookInstances.find(function (aBook) {
                    return aBook.title === bookTitle;
                });
                authorInstance.addHasWritten(bookInstance);
            });
            return authorInstance.save();
        });

        //        authorInstances.forEach(function (authorInstance) {
        //            authorships[authorInstance.name].forEach(function (bookTitle) {
        //                var bookInstance = bookInstances.find(function (aBook) {
        //                    return aBook.title === bookTitle;
        //                });
        //                authorInstance.addHasWritten(bookInstance);
        //            });
        //            authorInstance.save();
        //        });

    });

}).catch(function (error) {
    console.log('Error encountered; cannot sync.' + error);
});
