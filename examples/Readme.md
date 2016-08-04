https://codeplanet.io/principles-good-restful-api-design/
http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api

GET /books: List all Books (ID, title)
POST /books: Create a new Book
GET /books/BID: Retrieve an entire Book object
PUT /books/BID: Update a Book (entire object)
PATCH /books/BID: Update a Book (partial object)
DELETE /books/BID: Delete a Book

GET /books/BID/authors: Retrieve a listing of Authors (ID and name).
GET /authors: List all Authors (ID and name).
POST /authors: Create a new Author
GET /authors/AID: Retrieve an Author object
PUT /authors/AID: Update an Author (entire object)
PATCH /authors/AID: Update an Author (partial object)

/books?title=The Color of Magic
/books?author=Terry Pratchett
/authors?alpha=A

-- 

BUT...

GET /books
lookupAllBooks
    { id: "", 
      title: "",
      authors: [ { id: "", name: "" } ] 
    }
select b.id as book_id, a.id as author_id from books b
  inner join books_authors ba on (b.id = ba.book_id)
  inner join authors a on (ba.author_id = a.id);
    
GET /books/id
lookupOneBook
    { id: "", 
      title: "", 
      description: "",
      editions: [ { id: ""
                    isbn: "",
                    isbn13: "",
                    publisher: "",
                    published: "",
                    pages: "",
                    edition: "",
                    edition_language: ""
                    formats: [ { id: "",
                                 format: ""
                               } ]
                   } ],
      authors: [ { id: "", 
                   name: "" 
                 } ] 
    }
select b.id as book_id, e.id as edition_id, f.id as format_id, a.id as author_id from books b
  inner join editions e on (b.id = e.book_id)
  inner join formats f on (e.id = f.edition_id)
  inner join books_authors ba on (b.id = ba.book_id)
  inner join authors a on (ba.author_id = a.id) where b.id = '1';
  
Or
lookupOneBook
select b.id as book_id, e.id as edition_id, f.id as format_id, a.id as author_id from books b
  inner join editions e on (b.id = e.book_id)
  inner join formats f on (e.id = f.edition_id)
  where b.id = '1';
lookupAllAuthorsForOneBook
    
GET /authors
lookupAllAuthors
    { id: "", 
      name: ""
    }
select a.id, a.name from authors a;

GET /authors/:id
lookupOneAuthor
    { id: "", 
      name: "",
    }
select a.id, a.name from authors a where a.id = id;

GET /books/:id/authors
lookupAllAuthorsForOneBook
    { id: "", 
      name: "", 
      bookId: ""]
    }   
select a.id as author_id, a.name, b.id as book_id from books b
  inner join books_authors ba on (b.id = ba.book_id)
  inner join authors a on (ba.author_id = a.id) where b.id = '1' 

GET /authors/:id/books
lookupAllBooksForOneAuthor
    { id: "", 
      title: ""
      authorId: ""
    }  
select b.id as book_id, b.title, a.id as author_id from authors a
  inner join books_authors ba on (a.id = ba.author_id)
  inner join books b on (ba.book_id = b.id) where a.id = '1' 
    
###########################################
    
GET /books/:bookid

select b.id as bid, b.title, b.sort_title, e.id as eid, e.isbn, e.isbn13, e.publisher, e.published, e.pages, f.id as fid, f.format from books b join editions e on (b.id = e.book_id) join formats f on (e.id = f.edition_id) where b.id = ? order by b.id, e.id, f.id

put book into req.book

GET /books/:bookid/author

select a.id as aid, a.name from books b join books_authors ba on (b.id = ba.book_id) join authors a on (ba.author_id = a.id) where b.id = ? order by a.name

push book into req.author

E.g.,

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/demodb02');

var express = require('express');
var restapi = express();

restapi.get('/books', function(req, res){
    db.all("SELECT id, title, edition FROM books", function(err, row){
    
        var list = [];
        for (var i = 0; i < rows.length; i++) {
            list[i] = { 'id': rows[i].id, 'title': rows[i].title, 'edition': rows[i].edition }
        }
    
        res.status(200).json(list);
    });
});

restapi.get('/books/:bookId', function(req, res){
    db.get("SELECT * FROM books WHERE id = ?",  req.params.bookId, function(err, row){
    
        res.status(200).json({ 'id': row.id, 
            'title': row.title, 
            'edition': row.edition,
            'isbn': row.isbn,
            'isbn13': row.isbn13 });
    });
});

restapi.all('/books/:bookId/authors', function(req, res){
    db.all("SELECT a.id, a.name FROM authors a JOIN books_authors ba ON (ba.author_id = a.id) JOIN books a ON (ba.book_id = b.id) WHERE b.id = ?", req.params.bookId, function(err, row){
    
        var list = [];
        for (var i = 0; i < rows.length; i++) {
            list[i] = { 'id': rows[i].id, 'name': rows[i].name }
        }
    
        res.status(200).json(list);
    });
});

restapi.get('/authors', function(req, res){
    db.all("SELECT id, name FROM authors", function(err, rows){
    
        var list = [];
        for (var i = 0; i < rows.length; i++) {
            list[i] = { 'id': rows[i].id, 'name': rows[i].name }
        }
    
        res.status(200).json(list);
    });
});


restapi.listen(3000);

console.log("Submit GET or POST to http://localhost:3000/data");
