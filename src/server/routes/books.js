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


            //            res.status(200)
            //                .json({
            //                    status: 'success',
            //                    message: 'Inserted one puppy'
            //                });

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

    var createOneBook = function (req, res, next) {

        var book = req.body;

        console.log(book);

        Book.create(book, {
            include: [{
                model: Edition,
                include: [Format]
                    }, {
                model: Author,
                as: 'writtenBy'
            }]
        }).then(function (book) {
            // No results returned mean the object is not found
            if (book === null) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Unsuccessful"]
                });
            }
            req.book = book;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Error"]
                });
            }
        });
    }

    //GET books-info  -- book title + authors' names + number of editions
    //GET books-info/:id -- book title + authors' names + number of editions 
    //GET books-info/search?title=title
    //GET books-info/search?name=name

    //GET books/:id -- book + edition urls
    //GET books/:id/edition/:id edition + format urls
    //GET books/:id/edition/:id/format/:id - format

    //book-infos
    //    {
    //        data: { title: '', 
    //            sortTitle: '', 
    //            authors: [''], 
    //            editions: '2'},
    //        book: ['books/1'],
    //        message: 'One book retrieved',
    //        status: 200
    //    }
    //    
    //    {
    //        data: { title: '', sortTitle: '', authors: [''], editions: '1' },
    //        message: 'All books retrieved',
    //        status: 200
    //    }
    //
    //books
    //    {
    //        data: {},
    //        editions: ['books/1/edition/1', 'books/1/edition/2'],
    //        authors: ['authors/1', 'authors/2'],
    //        message: 'One book retrieved',
    //        status: 200
    //    }
    //    
    //    {
    //        data: {},
    //        formats: ['books/1/editiona/1/formats/1', 'books/1/editiona/2/formats/2'],
    //        message: 'One book retrieved',
    //        status: 200
    //    }

    //POST books -- book; return book url
    //POST books/:id/editions -- edition; return edition urls
    //POST books/:id/editions/:id/formats -- format; return form url

    //    {
    //        book: ['books/1'],
    //        message: 'One book created',
    //        status: 200
    //    }

    //    {
    //        edition: ['books/1/editions/1'],
    //        message: 'One book created',
    //        status: 200
    //    }

    //PUT books/:id -- book; return book url
    //PUT books/:id/editions/id -- edition; return edition urls
    //PUT books/:id/editions/:id/formats/:id -- format; return form url

    var createOneEdition = function (req, res, next) {

        var edition = req.body;

        Edition.create(edition, {
            include: [Format]
        }).then(function (edition) {
            // No results returned mean the object is not found
            if (book === null) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Unsuccessful"]
                });
            }
            req.edition = edition;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Error"]
                });
            }
        });
    }

    var createOneFormat = function (req, res, next) {

        var format = req.body;

        Format.create(format).then(function (format) {
            // No results returned mean the object is not found
            if (book === null) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Unsuccessful"]
                });
            }
            req.format = format;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Error"]
                });
            }
        });
    }

    var updateOneBook = function (req, res, next) {
        next();
    }

    var updateOneEdition = function (req, res, next) {
        next();
    }

    var updateOneFormat = function (req, res, next) {
        next();
    }

    books.post('/', [createOneBook], function (req, res) {
        res.json(req.book);
    });

    books.post('/:id/editions', [createOneEdition], function (req, res) {
        res.json(req.book);
    });

    books.post('/:id/editions/:id/formats', [createOneFormat], function (req, res) {
        res.json(req.book);
    });

    books.put('/:id', [updateOneBook], function (req, res) {
        res.json(req.book);
    });

    books.put('/:id/editions/:id', [updateOneEdition], function (req, res) {
        res.json(req.book);
    });

    books.put('/:id/editions/:id/formats/:id', [updateOneFormat], function (req, res) {
        res.json(req.book);
    });

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
