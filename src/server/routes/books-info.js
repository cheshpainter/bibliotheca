"use strict";

module.exports = (function() {

    var express = require('express');
    var router = express.Router();

    var models = require("../models"),
        Book = models.Book,
        Edition = models.Edition,
        Format = models.Format,
        Author = models.Author,
        sequelize = models.sequelize;

    router.route('/').get(findAll);

    router.route('/search').get(validateSearchCriteria, findSomeBySearchCriteria);

    router.route('/:bookid').get(findOne);

    function findAll(req, res) {

        Book.findAll({
                attributes: ['id', 'title', 'sortTitle'],
                include: [{
                    model: Edition,
                    attributes: ['id']
                }, {
                    model: Author,
                    as: 'writtenBy',
                    through: {
                        attributes: []
                    },
                    attributes: ['name']
                }]
            }

        ).then(function(books) {
            // No results returned mean the object is not found
            if (books.length === 0) {
                // We are able to set the HTTP status code on the res object
                return res.status(404);
                // return res.status(404).json({
                //     status: 'null result',
                //     message: "Books-info not found"
                // });
            }

            var pojos = [];

            books.forEach(function(book) {
                pojos.push(createPojo(book));
            });

            // return res.status(200)
            // .json({
            //     data: pojos,
            //     status: 'success',
            //     message: 'Retrieved all books-info'
            // });
            return res.status(200)
                .json(pojos);

        }).catch(function(err) {
            if (err) {
                console.error(err);
                return res.status(500);
                // return res.status(500).json({
                //     status: 'error',
                //     message: 'Could not retrieve books-info'
                // });
            }
        });
    }

    function findOne(req, res) {

        var bookId = req.params.bookid;

        Book.findById(bookId, {
            attributes: ['id', 'title', 'sortTitle'],
            include: [{
                model: Edition
            }, {
                model: Author,
                as: 'writtenBy',
                through: {
                    attributes: []
                },
                attributes: ['name']
            }]
        }).then(function(book) {
            // No results returned mean the object is not found
            if (book === null) {
                // We are able to set the HTTP status code on the res object
                // return res.status(404).json({
                //     status: "error",
                //     message: "Books-info not found"
                // });
                return res.status(404);
            }

            var pojo = createPojo(book);

            // return res.status(200)
            //     .json({
            //         data: pojo,
            //         status: 'success',
            //         message: 'Retrieved one books-info'
            //     });
            return res.status(200).json(pojo);

        }).catch(function(err) {
            if (err) {
                console.error(err);
                // return res.statu(500).json({
                //     status: "error",
                //     message: "Could not retrieve books-info"
                // });
                return res.statu(500);
            }
        });
    }

    function validateSearchCriteria(req, res, next) {

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
            // return res.status(404).json({
            //     status: "error",
            //     message: "Invalid search criteria for books"
            // });
            return res.status(404);
        }
    }

    function findSomeBySearchCriteria(req, res) {

        var criteria = req.criteria;

        Book.findAll({
            attributes: ['id', 'title', 'sortTitle'],
            include: [{
                model: Edition
            }, {
                model: Author,
                as: 'writtenBy',
                through: {
                    attributes: []
                },
                attributes: ['name']
            }],
            where: sequelize.where(
                sequelize.fn("lower", sequelize.col(criteria.column)), {
                    like: criteria.value + '%'
                }
            )
        }).then(function(books) {
            // No results returned mean the object is not found
            if (books.length === 0) {
                // We are able to set the HTTP status code on the res object
                // return res.status(404).json({
                //     status: "error",
                //     message: "Books-info not found"
                // });
                return res.status(404);
            }

            var pojos = [];

            books.forEach(function(book) {
                pojos.push(createPojo(book));
            });

            // return res.status(200)
            //     .json({
            //         data: pojos,
            //         status: 'success',
            //         message: 'Retrieved all books-info matching criteria'
            //     });
            return res.status(200).json(pojos);

        }).catch(function(err) {
            if (err) {
                console.error(err);
                // return res.status(500).json({
                //     status: "error",
                //     message: "Could not retrieve books-info"
                // });
                return res.status(500);
            }
        });
    }

    function createPojo(book) {

        var pojo = {
            title: book.get('title'),
            sortTitle: book.get('sortTitle'),
            // editionCount: book.get('EditionCount'),
            editionCount: book.Editions.length,
            authors: [],
            links: {
                books: [book.get('id')]
            }
        };

        book.writtenBy.forEach(function(author) {
            pojo.authors.push(author.name);
        });

        return pojo;
    }

    return router;
})();
