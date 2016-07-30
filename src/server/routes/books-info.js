"use strict";

module.exports = (function () {

    var express = require('express');
    var router = express.Router();

    var models = require("../models"),
        Book = models.Book,
        Edition = models.Edition,
        Format = models.Format,
        Author = models.Author,
        sequelize = models.sequelize;

    router.get('/', function (req, res) {

        Book.findAll({
            include: [{
                model: Edition
            }, {
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
                return res.status(404).res.json({
                    status: 'null result',
                    message: "Books-info not found"
                });
            }

            var infos = mapDaoBooks(books);

            res.status(200)
                .json({
                    data: infos,
                    status: 'success',
                    message: 'Got all books-info'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).res.json({
                    status: 'error',
                    message: 'Could not retrieve book'
                });
            }
        });
    });

    router.get('/search', function (req, res, next) {

        if (req.query.title !== undefined &&
            req.query.title !== null) {

            req.criteria = {
                value: req.query.title,
                column: 'Book.title'
            };
            next();

        } else if (req.query.name !== undefined &&
            req.query.name !== null) {

            req.criteria = {
                value: req.query.name,
                column: 'writtenBy.name'
            };
            next();

        } else {
            return res.status(404).res.json({
                status: "error",
                message: "Invalid search query for books"
            });
        }
    }, function (req, res) {

        var criteria = req.criteria;

        Book.findAll({
            include: [{
                model: Edition
            }, {
                model: Author,
                as: 'writtenBy',
                through: {
                    attributes: []
                }
            }],
            where: sequelize.where(
                sequelize.fn("lower", sequelize.col(criteria.column)), {
                    like: criteria.value + '%'
                }
            )
        }).then(function (books) {
            // No results returned mean the object is not found
            if (books.length === 0) {
                // We are able to set the HTTP status code on the res object
                return res.status(404).json({
                    status: "error",
                    message: "Book not found"
                });
            }

            var infos = mapDaoBooks(books);

            res.status(200)
                .json({
                    data: infos,
                    status: 'success',
                    message: 'Got all books-info'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve books for search criteria"]
                });
            }
        });

    });

    router.get('/:id', function (req, res) {

        var bookId = req.params.id;

        Book.findById(bookId, {
            include: [{
                model: Edition
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
                return res.status(404).json({
                    status: "error",
                    message: "Book not found"
                });
            }

            var info = mapDaoBooks([book]);

            res.status(200)
                .json({
                    data: info,
                    status: 'success',
                    message: 'Got one books-info'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve book"]
                });
            }
        });

    });

    function mapDaoBooks(books) {

        var infos = [];

        books.forEach(function (book) {

            var info = {
                title: book.title,
                sortTitle: book.sortTitle,
                editions: book.Editions.length,
                authors: [],
                links: {
                    book: '/books/' + book.id
                }
            };

            book.writtenBy.forEach(function (author) {
                info.authors.push(author.name);
            });

            infos.push(info);

        });

        return infos;

    }

    return router;
})();
