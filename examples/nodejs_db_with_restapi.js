"use strict";

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('books.db');

var express = require('express');
var restapi = express();

restapi.get('/books/:id', function (req, res) {

    var book = {
        id: req.params.id
    };

    db.serialize(function () {
        // These two queries will run sequentially.
        db.get("select * from books b where b.id = ?", book.id, function (err, row) {

            book.title = row.title;
            book.sortTitle = row.sort_title;
            book.editions = [];
            book.authors = [];

            db.all("select * from editions e where e.book_id = ?", book.id, function (err, rows) {

                console.log("select editions callback");

                //                for (var i = 0; i < rows.length; i++) {
                //                    
                //                    book.editions.push({
                //                        id: rows[i].id,
                //                        isbn: rows[i].isbn,
                //                        isbn13: rows[i].isbn13,
                //                        formats: []
                //                    });
                //                    
                //                }

                rows.forEach(function (row) {

                    console.log("each edition callback");
                    
                    var edition = {
                        id: row.id,
                        isbn: row.isbn,
                        isbn13: row.isbn13,
                        formats: []
                    };

                    //book.editions.push(edition);

                    db.all("select * from formats f where f.edition_id = ?", edition.id, function (err, rows) {

                        rows.forEach(function (row) {
                            
                            console.log("each format callback");
                            
                            var format = {
                                id: row.id,
                                format: row.format
                            }
                            
                             console.log(format);

                            edition.formats.push(format);

                        });
                        
                        book.editions.push(edition);
                        // res.json(book);
                    });
                });

                res.json(book);
            });


        });

        //        db.all("select a.id, a.name from books b join books_authors ba on (b.id = ba.book_id) join authors a on (ba.author_id = a.id) where b.id = '?';", book.id, function (err, rows) {
        //
        //            rows.forEach(function (row) {
        //
        //                book.authors.push = {
        //                    id: row.id,
        //                    name: name
        //                };
        //            });
        //        });
    });
    // res.json(book);
});

restapi.listen(3000);

console.log("Submit GET or POST to http://localhost:3000/books/1");
