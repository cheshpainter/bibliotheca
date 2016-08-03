module.exports = (function () {

    var Promise = require("bluebird");
    var express = require('express');
    var router = express.Router();

    var models = require("../models"),
        Book = models.Book,
        Author = models.Author,
        sequelize = models.sequelize;

    router.route('/').put(updateOneAuthorship);

    function updateOneAuthorship(req, res) {

        var bookId = req.query.bookid;
        var authorId = req.query.authorid;

        Promise.all([Book.findAll({
            where: [{
                id: bookId
            }]
        }), Author.findAll({
            where: [{
                id: authorId
            }]
        })]).spread(function (books, authors) {

            if (books.length === 0 || authors.length === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "Authorship participants not found"
                });
            }

            books[0].addWrittenBy(authors[0]);
            books[0].save().then(function () {
                return res.status(200).json({
                    data: {
                        books: ['/books/' + bookId],
                        authors: [/authors/ + authorId]
                    },
                    status: "success",
                    message: "Update one authorship"
                });
            });
        });
    }

    return router;
})();
