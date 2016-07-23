create table if not exists books
(
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  sort_title TEXT NOT NULL,
  description TEXT
);

create table if not exists editions
(
  id INTEGER PRIMARY KEY,
  isbn TEXT,
  isbn13 TEXT,
  publisher TEXT,
  published TEXT,
  pages INTEGER,
  edition TEXT NOT NULL,
  edition_language TEXT,
  book_id INTEGER NOT NULL
);

create table if not exists formats
(
  id INTEGER PRIMARY KEY,
  format TEXT NOT NULL,
  edition_id INTEGER NOT NULL
);

create table if not exists authors
(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

create table if not exists books_authors
(
  -- id INTEGER PRIMARY KEY,
  book_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  PRIMARY KEY(book_id, author_id)
  -- FOREIGH KEY(book) REFERENCES book(id),
  -- FOREIGH KEY(author) REFERENCES author(id)
);