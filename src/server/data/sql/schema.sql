create table if not exists book
(
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  sort_title TEXT NOT NULL,
  isbn TEXT UNIQUE,
  isbn13 TEXT UNIQUE,
  publisher TEXT,
  published TEXT,
  pages INTEGER,
  format TEXT,
  edition TEXT NOT NULL,
  description TEXT,
  edition_language TEXT,
  UNIQUE(title, edition)
);

create table if not exists author
(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

create table if not exists book_author
(
  -- id INTEGER PRIMARY KEY,
  book_id INTEGER,
  author_id INTEGER,
  PRIMARY KEY(book_id, author_id)
  -- FOREIGH KEY(book) REFERENCES book(id),
  -- FOREIGH KEY(author) REFERENCES author(id)
);