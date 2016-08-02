'use strict';

module.exports = (function () {

    var express = require('express');
    var router = express.Router();

    var models = require("../models"),
        Book = models.Book,
        Edition = models.Edition,
        Format = models.Format,
        Author = models.Author,
        sequelize = models.sequelize;

    router.route('/').get(findAll).post(createOne);

    router.route('/:authorid').get(findOne).put(updateOne);

    function findAll(req, res) {

        Author.findAll().then(function (authors) {
            // No results returned mean the object is not found
            if (authors.length === 0) {
                // We are able to set the HTTP status code on the res object
                res.status(404).json({
                    status: "error",
                    message: "Authors not found"
                });
            }

            var pojos = [];

            authors.forEach(function (author) {

                var pojo = author.get({
                    plain: true
                });

                pojo.links = {};

                pojos.push(pojo);

            });

            res.status(200)
                .json({
                    data: pojos,
                    status: 'success',
                    message: 'Retrieved all authors'
                });


        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    status: "error",
                    message: "Could not retrieve authors"
                });
            }
        });
    }

    function createOne(req, res) {

        var author = req.body;

        Author.findAll({
            attributes: ['id'],
            where: [{
                name: author.name
            }]
        }).then(function (authors) {

            if (authors.length === 0) {

                Author.create(author).then(function (author) {
                    res.status(200)
                        .json({
                            data: {
                                links: {
                                    authors: ['/authors/' + author.id]
                                }
                            },
                            status: 'success',
                            message: 'Created one author'
                        });
                });

            } else {

                var author = authors[0];
                return res.status(404).json({
                    data: {
                        links: {
                            books: ['/author/' + author.id]
                        }
                    },
                    status: 'error',
                    message: "Author not created; resource already exists"
                });
            }
        }).catch(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not create author'
                });
            }
        });

    }

    function findOne(req, res) {

        var authorId = req.params.authorid;

        Author.findAll({
            where: [{
                id: authorId
            }]
        }).then(function (authors) {
            // No results returned mean the object is not found
            if (authors.length === 0) {
                // We are able to set the HTTP status code on the res object
                res.status(404).json({
                    status: "error",
                    message: "Author not found"
                });
            }

            var author = authors[0];

            var pojo = author.get({
                plain: true
            });

            pojo.links = {};

            res.status(200)
                .json({
                    data: pojo,
                    status: 'success',
                    message: 'Retrieved one author'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    status: "error",
                    message: "Could not retrieve author"
                });
            }
        });
    }

    function updateOne(req, res) {

        var authorId = req.params.authorid;
        var author = req.body;

        Author.update(author, {
            where: [{
                id: authorId
            }]
        }).then(function (author) {

            res.status(200)
                .json({
                    data: {
                        links: {
                            books: ['/authors/' + authorId]
                        }
                    },
                    status: 'success',
                    message: 'Updated one author'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    status: "error",
                    message: "Could not update author"
                });
            }
        });
    }

    return router;
})();
