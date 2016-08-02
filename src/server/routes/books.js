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
                    statue: "error",
                    message: ["Books not found"]
                });
            }

            var pojos = [];

            books.forEach(function (book) {

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

                pojos.push(pojo);

            });

            res.status(200)
                .json({
                    data: pojos,
                    status: 'success',
                    message: 'Retrieved all books'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not retrieve books'
                });
            }
        });

    }

    function createOneBook(req, res) {

        var book = req.body;

        Book.create(book).then(function (book) {

            res.status(200)
                .json({
                    data: {
                        links: {
                            books: ['/books/' + book.id]
                        }
                    },
                    status: 'success',
                    message: 'Created one book'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not create book'
                });
            }
        });
    }

    function findAllEditions(req, res) {

        var bookId = req.params.bookid;

        //        {
        //            include: [{
        //                attributes: ['id'],
        //                model: Format
        //            }, {
        //                attributes: ['id'],
        //                model: Book,
        //                where: [{
        //                    id: bookId
        //                }]
        //            }]
        //        }

        Edition.findAll({
            include: [{
                attributes: ['id'],
                model: Format
            }],
            where: [{
                BookId: bookId
            }]
        }).then(function (editions) {
            // No results returned mean the object is not found
            if (editions.length === 0) {
                // We are able to set the HTTP status code on the res object
                return res.status(404).json({
                    status: 'error',
                    message: "Editions not found"
                });
            }

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
                    pojo.links.formats.push('/books/' + bookId + '/editions/' + edition.id + '/formats/' + format.id);
                });

                pojos.push(pojo);

            });

            res.status(200)
                .json({
                    data: pojos,
                    status: 'error',
                    message: 'Rretrieved all editions for one book'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not retrieve editions'
                });
            }
        });
    }

    function createOneEdition(req, res) {

        var bookId = req.params.bookid;
        var edition = req.body;

        Book.findAll({
            where: [{
                id: bookId
            }]
        }).then(function (books) {
            Edition.create(edition).then(function (edition) {

                var book = books[0];

                book.addEdition(edition);
                book.save({
                    fields: ['Editions']
                }).then(function () {
                    res.status(200)
                        .json({
                            data: {
                                links: {
                                    editions: ['/books/' + bookId + '/editions/' + edition.id]
                                }
                            },
                            status: 'success',
                            message: 'Created one edition'
                        });
                });
            });
        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not create edition'
                });
            }
        });
    }

    function findAllFormats(req, res) {

        var bookId = req.params.bookid;
        var editionId = req.params.editionid;

        //        {
        //            include: [{
        //                attributes: ['id'],
        //                model: Edition,
        //                where: [{
        //                    id: editionId
        //                    }],
        //                include: [{
        //                    model: Book,
        //                    where: [{
        //                        id: bookId
        //                    }]
        //                }]
        //            }]
        //        }

        Format.findAll({
            where: [{
                EditionId: editionId
            }]
        }).then(function (formats) {
            // No results returned mean the object is not found
            if (formats === null) {
                // We are able to set the HTTP status code on the res object
                return res.status(404).json({
                    status: 'null result',
                    message: "Formats not found"
                });
            }

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
                    message: 'Retrieved all formats for one edition'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not retrieve formats'
                });
            }
        });
    }

    function createOneFormat(req, res) {

        var bookId = req.params.bookid;
        var editionId = req.params.editionid;
        var format = req.body;

        Edition.findAll({
            where: [{
                id: editionId
            }]
        }).then(function (editions) {

            Format.create(format).then(function (format) {

                var edition = editions[0];

                edition.addFormat(format);
                edition.save({
                    fields: ['Formats']
                }).then(function () {
                    res.status(200)
                        .json({
                            data: {
                                links: {
                                    formats: ['/books/' + bookId + '/editions/' + editionId + '/formats/' + format.id]
                                }
                            },
                            status: 'success',
                            message: 'Created one format'
                        });
                });
            });
        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not create one format'
                });
            }
        });
    }

    function findOneBook(req, res) {

        var bookId = req.params.bookid;

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
            }],
            where: [{
                id: bookId
            }]
        }).then(function (books) {

            // No results returned mean the object is not found
            if (books.length === 0) {
                // We are able to set the HTTP status code on the res object
                return res.status(404).json({
                    status: 'error',
                    message: "Book not found"
                });
            }

            var book = books[0];

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
                    message: 'Retrieved one book'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    status: "error",
                    message: "Could not retrieve book"
                });
            }
        });
    }

    function updateOneBook(req, res) {

        var bookId = req.params.bookid;
        var book = req.body;

        Book.update(book, {
            where: [{
                id: bookId
            }]
        }).then(function (book) {

            res.status(200)
                .json({
                    data: {
                        links: {
                            books: ['/books/' + bookId]
                        }
                    },
                    status: 'success',
                    message: 'Updated one book'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    status: "error",
                    message: "Could not update book"
                });
            }
        });
    }

    function findOneEdition(req, res) {

        var bookId = req.params.bookid;
        var editionId = req.params.editionid;

        //        {
        //            include: [{
        //                model: Edition,
        //                where: {
        //                    id: editionId
        //                },
        //                include: [{
        //                    model: Format
        //                }]
        //            }

        Edition.findAll({
            include: [{
                attributes: ['id'],
                model: Format
            }],
            where: [{
                id: editionId
            }]
        }).then(function (editions) {
            // No results returned mean the object is not found
            if (editions.length === 0) {
                // We are able to set the HTTP status code on the res object
                return res.status(404).json({
                    status: 'null result',
                    message: "Edition not found"
                });
            }

            var edition = editions[0];

            var pojo = edition.get({
                plain: true
            });

            delete(pojo.Formats);
            delete(pojo.BookId);

            pojo.links = {
                formats: []
            };

            edition.Formats.forEach(function (format) {
                pojo.links.formats.push('/books/' + bookId + '/editions/' + editionId + '/formats/' + format.id);
            });

            res.status(200)
                .json({
                    data: pojo,
                    status: 'success',
                    message: 'Retrieved one edition'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: "error",
                    message: "Could not retrieve edition"
                });
            }
        });
    }

    function updateOneEdition(req, res) {

        var bookId = req.params.bookid;
        var editionId = req.params.editionid;
        var edition = req.body;

        Edition.update(edition, {
            where: [{
                id: editionId
            }]
        }).then(function (edition) {

            res.status(200)
                .json({
                    data: {
                        links: {
                            editions: ['/books/' + bookId + '/editions/' +
                                edition.id]
                        }
                    },
                    status: 'success',
                    message: 'Updated one edition'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: "error",
                    message: "Could not update edition"
                });
            }
        });
    }

    function findOneFormat(req, res) {

        var bookId = req.params.bookid;
        var editionId = req.params.editionid;
        var formatId = req.params.formatid;

        Format.findAll({
            where: [{
                id: formatId
            }]
        }).then(function (formats) {
            // No results returned mean the object is not found
            if (formats.length === 0) {
                // We are able to set the HTTP status code on the res object
                return res.status(404).json({
                    status: 'error',
                    message: "Format not found"
                });
            }

            var format = formats[0];

            var pojo = format.get({
                plain: true
            });

            delete(pojo.EditionId);

            pojo.links = {};

            res.status(200)
                .json({
                    data: pojo,
                    status: 'success',
                    message: 'Retrieved one format'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: "error",
                    message: "Could not retrieve format"
                });
            }
        });

    }

    function updateOneFormat(req, res) {

        var bookId = req.params.bookid;
        var editionId = req.params.editionid;
        var formatId = req.params.formatid;
        var format = req.body;

        Format.update(format, {
            where: [{
                id: formatId
            }]
        }).then(function (format) {

            res.status(200)
                .json({
                    data: {
                        links: {
                            formats: ['/books/' + bookId + '/editions/' +
                                editionId + '/formats/' + format.id]
                        }
                    },
                    status: 'success',
                    message: 'Update one format'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: "error",
                    message: "Could not update format"
                });
            }
        });
    }

    return router;
})();
