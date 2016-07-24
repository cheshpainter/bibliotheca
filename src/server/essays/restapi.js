"use strict";

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('books.db');

var express = require('express');
var restapi = express();

restapi.get('/books', function (req, res) {

    db.serialize(function () {

        var books = [];
        var lookup = new Map();

        db.all("select * from books b order by b.sort_title", function (err, rows) {

            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve book"]
                });
            }
            // No results returned mean the object is not found
            if (rows.length === 0) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Book not found"]
                });
            }

            rows.forEach(function (row) {

                var book = {
                    id: row.id,
                    title: row.title,
                    authors: []
                }
                books.push(book);
                lookup.set(row.id, book);
            });
        });

        db.all("select a.id as aid, a.name, ba.book_id from books b join books_authors ba on (b.id = ba.book_id) join authors a on (ba.author_id = a.id) order by a.name", function (err, rows) {
            rows.forEach(function (row) {

                var book = lookup.get(row.book_id);

                book.authors.push({
                    id: row.aid,
                    name: row.name
                });

            });
            res.json(books);
        });
    });
});

restapi.get('/books/:id', function (req, res) {

    db.serialize(function () {

        var book;

        // These two queries will run sequentially.
        db.all("select b.id as bid, b.title, b.sort_title, e.id as eid, e.isbn, e.isbn13, e.publisher, e.published, e.pages, f.id as fid, f.format from books b join editions e on (b.id = e.book_id) join formats f on (e.id = f.edition_id) where b.id = ? order by b.sort_title, e.edition, f.format", req.params.id, function (err, rows) {

            var bid, edition, eid, fid;

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
        });

        db.all("select a.id as aid, a.name from books b join books_authors ba on (b.id = ba.book_id) join authors a on (ba.author_id = a.id) where b.id = ? order by a.name", req.params.id, function (err, rows) {
            rows.forEach(function (row) {

                book.authors.push({
                    id: row.aid,
                    name: row.name
                });

            });
            res.json(book);
        });
    });
    // res.json(book);
});

restapi.get('/authors', function (req, res) {

    db.all("select a.id as aid, a.name from books b join books_authors ba on (b.id = ba.book_id) join authors a on (ba.author_id = a.id) order by a.name", function (err, rows) {

        var authors = [];

        rows.forEach(function (row) {

            authors.push({
                id: row.aid,
                name: row.name
            });

        });
        res.json(authors);
    });

});

restapi.listen(3000);

console.log("Submit GET or POST to http://localhost:3000/books/1");
