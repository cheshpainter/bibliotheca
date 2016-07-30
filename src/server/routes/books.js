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

    router.route('/').get(findAllBooks).post(createOneBook);

    router.route('/:bookid/editions').get(findAllEditions).post(createOneEdition);

    router.route('/:bookid/editions/:editionid/formats').get(findAllFormats).post(createOneFormat);

    router.route('/:bookid').get(findOneBook).put(updateOneBook);

    router.route('/:bookid/editions/:editionid').get(findOneEdition).put(updateOneEdition);

    router.route('/:bookid/editions/:editionid/formats/:formatid').get(findOneFormat).put(updateOneFormat);

    function findAllBooks(req, res) {

        Book.findAll({
            include: [{
                attributes: ['id'],
                model: Edition
            }, {
                attributes: ['id'],
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
                res.code(404).json({
                    errors: ["Books not found"]
                });
            }

            var pojos = [];

            books.forEach(function (book) {

                var pojo = book.get({
                    plain: true
                });

                //console.log(raw);

                delete(pojo.Editions);
                delete(pojo.writtenBy);

                pojo.links = {
                    editions: [],
                    authors: []
                };

                book.Editions.forEach(function (edition) {
                    pojo.links.editions.push('/books/' + book.id + '/editions/' + edition.id);
                });

                book.writtenBy.forEach(function (author) {
                    pojo.links.authors.push('/books/' + book.id + '/authors/' + author.id);
                });

                pojos.push(pojo);

            });

            res.status(200)
                .json({
                    data: pojos,
                    status: 'success',
                    message: 'Got one books-info'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Got one books-info'
                });
            }
        });

    }

    function createOneBook(req, res) {
        res.json('Not implemented');
    }

    function findAllEditions(req, res) {

        var bookId = req.params.bookid;

        Book.findById(bookId, {
            include: [{
                model: Edition,
                include: [{
                    model: Format
                }]
            }]
        }).then(function (book) {
            // No results returned mean the object is not found
            if (book === null) {
                // We are able to set the HTTP status code on the res object
                return res.status(404).json({
                    status: 'null result',
                    message: "Books-info not found"
                });
            }

            var editions = book.Editions;
            var pojos = [];

            editions.forEach(function (edition) {

                var pojo = edition.get({
                    plain: true
                });

                delete(pojo.Formats);
                delete(pojo.BookId);

                pojo.links = {
                    formats: []
                };

                var formats = edition.Formats;

                formats.forEach(function (format) {
                    pojo.links.formats.push('/books/' + book.id + '/editions/' + edition.id + '/formats/' + format.id);
                });

                pojos.push(pojo);

            });

            res.status(200)
                .json({
                    data: pojos,
                    status: 'success',
                    message: 'Got all books-info'
                });
        });
    }

    function createOneEdition(req, res) {
        res.send('Not implemented');
    }

    function findAllFormats(req, res) {


        var bookId = req.params.bookid;
        var editionId = req.params.editionid;

        Book.findById(bookId, {
            include: [{
                model: Edition,
                include: [{
                    model: Format
                }],
                where: [{
                    id: editionId
                }]
            }]
        }).then(function (book) {
            // No results returned mean the object is not found
            if (book === null) {
                // We are able to set the HTTP status code on the res object
                return res.status(404).json({
                    status: 'null result',
                    message: "Books-info not found"
                });
            }

            var edition = book.Editions[0];
            var formats = edition.Formats;
            var pojos = [];

            formats.forEach(function (format) {

                var pojo = format.get({
                    plain: true
                });

                delete(pojo.EditionId);

                pojo.links = {};

                pojos.push(pojo);

            });

            res.status(200)
                .json({
                    data: pojos,
                    status: 'success',
                    message: 'Got all books-info'
                });
        });
    }

    function createOneFormat(req, res) {
        res.send('Not implemented');
    }

    function findOneBook(req, res) {

        var bookId = req.params.bookid;

        Book.findById(bookId, {
            include: [{
                attributes: ['id'],
                model: Edition
            }, {
                attributes: ['id'],
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
                    status: 'null result',
                    message: "Books-info not found"
                });
            }

            var pojo = book.get({
                plain: true
            });

            delete(pojo.Editions);
            delete(pojo.writtenBy);

            pojo.links = {
                editions: [],
                authors: []
            };

            book.Editions.forEach(function (edition) {
                pojo.links.editions.push('/books/' + book.id + '/editions/' + edition.id);
            });

            book.writtenBy.forEach(function (author) {
                pojo.links.authors.push('/books/' + book.id + '/authors/' + author.id);
            });

            res.status(200)
                .json({
                    data: pojo,
                    status: 'success',
                    message: 'Got all books-info'
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
    }

    function updateOneBook(req, res) {
        res.send('Not implemented');
    }

    function findOneEdition(req, res) {

        var bookId = req.params.bookid;
        var editionId = req.params.editionid;

        Book.findById(bookId, {
            include: [{
                model: Edition,
                where: {
                    id: editionId
                },
                include: [{
                    model: Format
                }]
            }]
        }).then(function (book) {
            // No results returned mean the object is not found
            if (book === null) {
                // We are able to set the HTTP status code on the res object
                return res.status(404).json({
                    status: 'null result',
                    message: "Books-info not found"
                });
            }

            var edition = book.Editions[0];

            var pojo = edition.get({
                plain: true
            });

            delete(pojo.Formats);
            delete(pojo.BookId);

            pojo.links = {
                formats: []
            };

            edition.Formats.forEach(function (format) {
                pojo.links.formats.push('/books/' + book.id + '/editions/' + edition.id + '/formats/' + format.id);
            });

            res.status(200)
                .json({
                    data: pojo,
                    status: 'success',
                    message: 'Got all books-info'
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
    }

    function updateOneEdition(req, res) {
        res.send('Not implemented');
    }

    function findOneFormat(req, res) {

        var bookId = req.params.bookid;
        var editionId = req.params.editionid;
        var formatId = req.params.formatid;

        Book.findById(bookId, {
            include: [{
                model: Edition,
                where: {
                    id: editionId
                },
                include: [{
                    model: Format,
                    where: [{
                        id: formatId
                    }]
                }]
            }]
        }).then(function (book) {
            // No results returned mean the object is not found
            if (book === null) {
                // We are able to set the HTTP status code on the res object
                return res.status(404).json({
                    status: 'null result',
                    message: "Books-info not found"
                });
            }

            var edition = book.Editions[0];
            var format = edition.Formats[0];

            var pojo = format.get({
                plain: true
            });

            delete(pojo.EditionId);

            pojo.links = {};

            res.status(200)
                .json({
                    data: pojo,
                    status: 'success',
                    message: 'Got all books-info'
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

    }

    function updateOneFormat(req, res) {
        res.send('Not implemented');
    }

    return router;
})();
