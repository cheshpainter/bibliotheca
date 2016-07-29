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

    books.post('/', function (req, res) {
        res.json({});
    });

    books.post('/:id/editions', function (req, res) {
        res.json({});
    });

    books.post('/:id/editions/:id/formats', function (req, res) {
        res.json({});
    });

    books.put('/:id', function (req, res) {
        res.json({});
    });

    books.put('/:id/editions/:id', function (req, res) {
        res.json(req.book);
    });

    books.put('/:id/editions/:id/formats/:id', function (req, res) {
        res.json({});
    });

    books.get('/', function (req, res) {

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
                res.statusCode = 404;
                return res.json({
                    errors: ["Books not found"]
                });
            }

            var books = mapDaoBooks(books);

            res.status(200)
                .json({
                    data: books,
                    status: 'success',
                    message: 'Got one books-info'
                });

        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve books"]
                });
            }
        });
    });

    books.get('/:id', function (req, res) {

        var bookId = req.params.id;

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
                return res.status(404).res.json({
                    status: 'null result',
                    message: "Books-info not found"
                });
            }

            var daoBooks = mapDaoBooks([book])

            res.status(200)
                .json({
                    data: daoBooks[0],
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

    });

    // create instance method on Book : asDao

    function mapDaoBooks(books) {

        var daoBooks = [];

        books.forEach(function (book) {

            var daoBook = {
                title: book.title,
                sortTitle: book.sortTitle,
                description: book.description,
                links: {
                    editions: [],
                    authors: []
                }
            };

            book.Editions.forEach(function (edition) {
                daoBook.links.editions.push('/books/' + book.id + '/editions/' + edition.id);
            });

            book.writtenBy.forEach(function (author) {
                daoBook.links.authors.push('/books/' + book.id + '/authors/' + author.id);
            });

            daoBooks.push(daoBook);

        });

        return daoBooks;

    }

    return books;
})();
