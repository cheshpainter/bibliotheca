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

    router.route('/:bookid').get(findOne);

    function findAll(req, res) {
        return res.status(403);
    }

    function findOne(req, res) {

        var bookId = req.params.bookid;
'createdAt', 'updatedAt'
        Book.findById(bookId, {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [{
                model: Edition,
                attributes: { exclude: ['BookId', 'createdAt', 'updatedAt'] },
                include: {
                    model: Format,
                    attributes: { exclude: ['EditionId', 'createdAt', 'updatedAt'] },
                }
            }, {
                model: Author,
                as: 'writtenBy',
                through: {
                    attributes: []
                },
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }],
            where: [{
                id: bookId
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

            var pojo = book.get({
                plain: true
            });

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
                return res.statu(500);
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
