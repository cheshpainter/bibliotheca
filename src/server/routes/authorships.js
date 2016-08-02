module.exports = (function () {

    var Promise = require("bluebird");
    var express = require('express');
    var router = express.Router();

    var models = require("../models"),
        Book = models.Book,
        Author = models.Author,
        sequelize = models.sequelize;

    router.route('/').put(updateOneAuthorship);

    function updateNothing(req, res) {
        res.status(200).json({

            status: "success",
            message: "Update nothing"
        });
    }

    function updateOneAuthorship(req, res) {

        var bookId = req.query.bookid;
        var authorId = req.query.authorid;

        Promise.all([Book.findAll({
            where: [{
                id: bookId
            }]
        }), Author.findAll({
            where: [{
                id: authorId
            }]
        })]).spread(function (books, authors) {

            books[0].addWrittenBy(authors[0]);
            books[0].save().then(function () {
                res.status(200).json({
                    data: {},
                    status: "success",
                    message: "Update nothing"
                });
            });
        });
    }

    return router;
})();
