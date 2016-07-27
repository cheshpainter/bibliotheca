"use strict";

module.exports = (function () {

    var express = require('express');
    var books = express.Router();



    var models = require("../models"),
        Book = models.Book,
        Edition = models.Edition,
        Format = models.Format,
        Author = models.Author,
        sequelize = models.sequelize;

    var allBooks = function (req, res, next) {

        Book.findAll({
            include: [{
                model: Author,
                as: 'writtenBy',
                through: {
                    attributes: []
                }
            }]

        }).then(function (books) {
            // No results returned mean the object is not found
            if (books.length === 0) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Books not found"]
                });
            }
            req.books = books;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve books"]
                });
            }
        });
    };

    var getOneBook = function (req, res, next) {

        console.log('BOOK,BOOK,BOOK');

        var bookId = req.params.id;

        Book.findById(bookId, {
            include: [{
                model: Edition,
                include: [{
                    model: Format
                }]
            }, {
                model: Author,
                as: 'writtenBy',
                through: {
                    attributes: []
                }
            }]

        }).then(function (book) {
            // No results returned mean the object is not found
            if (book === null) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Book not found"]
                });
            }
            req.book = book;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve book"]
                });
            }
        });
    };

    var getAllAuthorsForOneBook = function (req, res, next) {

        var bookId = req.params.id;

        Author.findAll({
            include: [{
                model: Book,
                as: 'hasWritten',
                attributes: ['id'],
                through: {
                    attributes: []
                },
                where: {
                    id: bookId
                }
            }]
        }).then(function (authors) {
            // No results returned mean the object is not found
            if (authors.length === 0) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Authors not found"]
                });
            }
            req.authors = authors;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve authors"]
                });
            }
        });

    };

    var hasValidSearchCriteria = function (req, res, next) {

        console.log('hasValidSearchCriteria');

        if (req.query.title === undefined ||
            req.query.title === null) {
            return res.json({
                errors: ["Invalid search query for books."]
            });
        } else {
            next();
        }

    };

    var getBooksBySearchCriteria = function (req, res, next) {

        // books/search?title=Dark%20Orbit

        // sequelize.fn('lower', sequelize.col('title'))

        console.log('getBooksBySearchCriteria for ' + req.query.title);

        var title = req.query.title;

        Book.findAll({
            include: [{
                model: Author,
                as: 'writtenBy',
                through: {
                    attributes: []
                }
            }],
            where: {
                title: {
                    $like: sequelize.fn('lower', sequelize.col('title')) + '%'
                }
            }
        }).then(function (books) {
            // No results returned mean the object is not found
            if (books.length === 0) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Books not found"]
                });
            }
            req.books = books;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve books"]
                });
            }
        });

        next();
    };

    books.get('/', [allBooks], function (req, res) {
        res.json(req.books);
    });

    books.get('/:id', [getOneBook], function (req, res) {
        res.json(req.book);
    });

    books.get('/search', [getBooksBySearchCriteria], function (req, res) {
        res.json(req.books);
    });

    return books;
})();
