"use strict";

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/books.db');

var express = require('express');
var app = express();

// Create the express router object for Photos
var booksRouter = express.Router();

// A GET to the root of a resource returns a list of that resource
booksRouter.get('/', lookupAllBooks, function (req, res) {
    res.json(req.books);
});

// A POST to the root of a resource should create a new object
booksRouter.post('/', function (req, res) {});

// We specify a param in our path for the GET of a specific object
booksRouter.get("/:id", lookupOneBook, lookupAllAuthorsForOneBook, function (req, res) {
    req.authors.forEach(function (author) {
        req.book.authors.push({
            id: author.id,
            name: author.name
        })
    });
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

    db.all("select b.id as book_id, b.title, b.sort_title, a.name, a.id as author_id from books b inner join books_authors ba on (b.id = ba.book_id) inner join authors a on (ba.author_id = a.id) order by b.sort_title", function (err, rows) {

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
        var book, book_id, author_id;

        rows.forEach(function (row) {
            if (row.book_id !== book_id) {
                book = {
                    id: row.bid,
                    title: row.title,
                    sortTitle: row.sort_title,
                    authors: []
                };
                books.push(book);
                author_id = undefined;
                book_id = row.book_id;
            }
            if (row.author_id !== author_id) {
                book.authors.push({
                    id: row.author_id,
                    name: row.name
                });
                author_id = row.author_id;
            }
        });

        req.books = books;
        next();
    });

}

function lookupOneBook(req, res, next) {

    // We access the ID param on the request object
    var bookId = req.params.id;

    // Build an SQL query to select the resource object by ID
    db.all("select b.id as book_id, b.title, b.sort_title,\
e.id as edition_id, e.isbn, e.isbn13, e.published, e.publisher, e.pages, e.edition, e.edition_language\
f.id as format_id, f.format\
from books b\
inner join editions e on(b.id = e.book_id)\
inner join formats f on(e.id = f.edition_id)\
where b.id = ?\
order by b.sort_title, e.edition, f.format, a.name", bookId, function (err, rows) {

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
        var book_id, edition_id, format_id, author_id;

        rows.forEach(function (row) {

            if (row.book_id !== book_id) {
                book = {
                    id: row.book_id,
                    title: row.title,
                    sortTitle: row.sort_title,
                    editions: [],
                    authors: []
                };
                edition_id = undefined;
                author_id = undefined;
                book_id = row.book_id;
            }

            if (row.edition_id !== edition_id) {
                edition = {
                    id: row.edition_id,
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
                edition_id = row.edition_id;
                format_id = undefined;
            }

            if (row.format_id !== format_id) {
                edition.formats.push({
                    id: row.format_id,
                    format: row.format
                });
                format_id = row.format_id;
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

    db.all("select a.id as author_id, a.name, b.id as book_id from books b join books_authors ba on (b.id = ba.book_id) join authors a on (ba.author_id = a.id) where b.id = ? order by a.name", bookId, function (err, rows) {

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
                name: row.name,
                bookId: row.book_id
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
