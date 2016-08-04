"use strict";

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/books.db');

var express = require('express');
var app = express();

// Create the express router object for Photos
var booksRouter = express.Router();

// A GET to the root of a resource returns a list of that resource
booksRouter.get('/', lookupAllBooks, lookupAllAuthors, function (req, res) {

    var books = req.books;
    var authors = req.authors;

    authors.forEach(function (author) {

        author.bookIds.forEach(function (bookId) {

            var book = books.find(function (book) {
                return book.id === bookId;
            });

            book.authors.push({
                id: author.id,
                name: author.name
            });

        });
    });

    res.json(books);
});

// A POST to the root of a resource should create a new object
booksRouter.post('/', function (req, res) {});

// We specify a param in our path for the GET of a specific object
booksRouter.get("/:id", lookupOneBook, lookupAllAuthorsForOneBook, function (req, res) {
    req.book.authors = req.authors;
    res.json(req.book);
});

booksRouter.get("/:id/authors", lookupAllAuthorsForOneBook, function (req, res) {
    res.json(req.authors);
});

// Similar to the GET on an object, to update it we can PATCH
booksRouter.patch('/:id', lookupOneBook, function (req, res) {});

// Delete a specific object
booksRouter.delete('/:id', lookupOneBook, function (req, res) {});

// Attach the routers for their respective paths
app.use('/books', booksRouter);

var authorsRouter = express.Router();

authorsRouter.get('/', lookupAllAuthors, function (req, res) {
    res.json(req.authors);
});

authorsRouter.post('/', function (req, res) {});

authorsRouter.get('/:id', function (req, res) {
    res.json(req.author);
});

authorsRouter.patch('/:id', function (req, res) {});

authorsRouter.delete('/:id', function (req, res) {});

app.use('/authors', authorsRouter);

module.exports = app;


function lookupAllBooks(req, res, next) {

    db.all("select * from books b order by b.sort_title", function (err, rows) {

        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ["Could not retrieve books"]
            });
        }
        // No results returned mean the object is not found
        if (rows.length === 0) {
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json({
                errors: ["Books not found"]
            });
        }

        var books = [];

        rows.forEach(function (row) {

            books.push({
                id: row.id,
                title: row.title,
                authors: []
            });

        });

        req.books = books;
        next();
    });

}

function lookupOneBook(req, res, next) {

    // We access the ID param on the request object
    var bookId = req.params.id;

    // Build an SQL query to select the resource object by ID
    db.all("select b.id as bid, b.title, b.sort_title, e.id as eid, e.isbn, e.isbn13, e.publisher, e.published, e.pages, f.id as fid, f.format from books b join editions e on (b.id = e.book_id) join formats f on (e.id = f.edition_id) where b.id = ? order by b.sort_title, e.edition, f.format", bookId, function (err, rows) {

        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Could not retrieve photo']
            });
        }

        // No results returned mean the object is not found
        if (rows.length === 0) {
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json({
                errors: ['Book not found']
            });
        }

        var book, edition;
        var bid, eid, fid;

        rows.forEach(function (row) {

            if (row.bid !== bid) {
                book = {
                    id: row.bid,
                    title: row.title,
                    sortTitle: row.sort_title,
                    editions: [],
                    authors: []
                };
                eid = undefined;
                bid = row.bid;
            }

            if (row.eid !== eid) {
                edition = {
                    id: row.eid,
                    isbn: row.isbn,
                    isbn13: row.isbn13,
                    publisher: row.publisher,
                    published: row.published,
                    pages: row.pages,
                    edition: row.edition,
                    language: row.edition_language,
                    formats: []
                };
                book.editions.push(edition);
                eid = row.eid;
                fid = undefined;
            }

            if (row.fid !== fid) {
                edition.formats.push({
                    id: row.fid,
                    format: row.format
                });
                fid = row.fid;
            }

        });
        // By attaching a Book property to the request
        // Its data is now made available in our handler function
        req.book = book;
        next();
    });
}

function lookupAllAuthors(req, res, next) {

    db.all("select a.id as aid, a.name, ba.book_id from books b join books_authors ba on (b.id = ba.book_id) join authors a on (ba.author_id = a.id) order by a.name", function (err, rows) {

        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Could not retrieve authors']
            });
        }

        // No results returned mean the object is not found
        if (rows.length === 0) {
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json({
                errors: ['Authors not found']
            });
        }

        var authors = [];
        var author;
        var aid;

        rows.forEach(function (row) {

            if (row.aid !== aid) {

                author = {
                    id: row.aid,
                    name: row.name,
                    bookIds: [row.book_id]
                };
                authors.push(author);

            } else {

                author.bookIds.push(row.book_id);

            }
            aid = row.aid;

        });

        req.authors = authors;
        next();
    });
}

function lookupOneAuthor(req, res, next) {

    var authorId = req.params.id;

    db.get("select * from author a where a.id = ?", authorId, function (err, row) {

        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Could not retrieve author']
            });
        }

        // No results returned mean the object is not found
        if (rows.length === 0) {
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json({
                errors: ['Author not found']
            });
        }

        req.author = {
            id: row.id,
            name: row.name
        };
        next();

    });
}

function lookupAllAuthorsForOneBook(req, res, next) {

    // We access the ID param on the request object
    var bookId = req.params.id;

    db.all("select a.id as aid, a.name from books b join books_authors ba on (b.id = ba.book_id) join authors a on (ba.author_id = a.id) where b.id = ? order by a.name", bookId, function (err, rows) {

        var authors = [];

        if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.json({
                errors: ['Could not retrieve authors']
            });
        }

        // No results returned mean the object is not found
        if (rows.length === 0) {
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json({
                errors: ['Authors not found']
            });
        }

        rows.forEach(function (row) {

            authors.push({
                id: row.aid,
                name: row.name
            });

        });
        // By attaching a Book property to the request
        // Its data is now made available in our handler function
        req.authors = authors;
        next();
    });

}

app.listen(7200);

console.log("Submit GET or POST to http://localhost:7200/books");
