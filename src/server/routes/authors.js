'use strict';

var express = require('express');
var models = require("../models");

module.exports = (function () {

    var authors = express.Router();

    authors.get('/', getAllAuthors, function (req, res) {
        res.json(req.authors);
    });

    authors.get('/:id', getOneAuthor, function (req, res) {
        res.json(req.author);
    });

    authors.get('/:id/books', getAllBooksForOneAuthor, function (req, res) {
        res.json(req.books);
    });

    var Book = models.Book;
    var Edition = models.Edition;
    var Format = models.Format;
    var Author = models.Author;

    function getAllAuthors(req, res, next) {

        Author.findAll().then(function (authors) {
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

    function getOneAuthor(req, res, next) {

        var authorId = req.params.id;

        Author.findById(authorId).then(function (author) {
            // No results returned mean the object is not found
            if (author === null) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Author not found"]
                });
            }
            req.author = author;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve author"]
                });
            }
        });
    }

    function getAllBooksForOneAuthor(req, res, next) {

        var authorId = req.params.id;

        Book.findAll({
            include: [{
                model: Author,
                as: 'writtenBy',
                attributes: ['id'],
                through: {
                    attributes: []
                },
                where: {
                    id: authorId
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

    return authors;
})();
