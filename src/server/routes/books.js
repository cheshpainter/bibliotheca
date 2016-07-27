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

    var getAllBooks = function (req, res, next) {

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

    var hasValidSearchCriteria = function (req, res, next) {

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
            return res.json({
                errors: ["Invalid search query for books."]
            });
        }
    };

    var getBooksBySearchCriteria = function (req, res, next) {

        console.log('getBooksBySearchCriteria for ' + req.query.title);

        var criteria = req.criteria;

        Book.findAll({
            include: [{
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
                res.statusCode = 404;
                return res.json({
                    errors: ["Books not found for search criteria"]
                });
            }
            //books.push({
            //matching: criteria.value
            //});
            req.books = books;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve books for search criteria"]
                });
            }
        });
    };

    books.get('/search', [hasValidSearchCriteria, getBooksBySearchCriteria], function (req, res) {
        res.json(req.books);
    });

    books.get('/', [getAllBooks], function (req, res) {
        res.json(req.books);
    });

    books.get('/:id', [getOneBook], function (req, res) {
        res.json(req.book);
    });

    return books;
})();
