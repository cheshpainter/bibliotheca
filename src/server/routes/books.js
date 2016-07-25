"use strict";

var express = require('express');
var models = require("../models");

module.exports = (function () {

    var books = express.Router();

    books.get('/', getAllBooks, function (req, res) {
        res.json(req.books);
    });

    books.get('/:id', getOneBook, function (req, res) {
        res.json(req.book);
    });

    books.get('/:id/authors', getAllAuthorsForOneBook, function (req, res) {
        res.json(req.authors);
    });

    var Book = models.Book;
    var Edition = models.Edition;
    var Format = models.Format;
    var Author = models.Author;

    function getAllBooks(req, res, next) {

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
    }

    function getOneBook(req, res, next) {

        var bookId = req.params.id;

        Book.findById(bookId, {
            include: [{
                model: Edition,
                include: [Format]
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
    }

    function getAllAuthorsForOneBook(req, res, next) {

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

    }

    return books;
})();
