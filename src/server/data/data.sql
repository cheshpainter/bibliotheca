
-- Carolyn Ives Gilman

insert into book (title, sort_title, isbn, isbn13, publisher, published, pages, format, edition,  description, edition_language)
  values ('Dark Orbit', 'Dark Orbit', '0765336294', null, 'Tor Books (Macmillan)', '2015-07-14', 303, 'Hardcover', '1', null, 'English');
  
insert into book (title, sort_title, isbn, isbn13, publisher, published, pages, format, edition,  description, edition_language)
  values ('Dark Orbit', 'Dark Orbit', null, null, 'Tor Books', '2015-07-14', 304, 'Kindle Edition', '2', null, 'English');
  
insert into book (title, sort_title, isbn, isbn13, publisher, published, pages, format, edition,  description, edition_language)
  values ('Dark Orbit', 'Dark Orbit', '0765336308', null, 'Tor Books', '2016-05-10', 304, 'Paperback', '3', null, 'English');
  
insert into author (name) 
  values ('Carolyn Ives Gilman');

insert into book_author (book_id, author_id)
select b.id, a.id from book b join author a where b.title = 'Dark Orbit' and a.name = 'Carolyn Ives Gilman';
  
-
  
--  Dorothy L. Sayers, Robert Eustace
  
insert into book (title, sort_title, isbn, isbn13, publisher, published, pages, format, edition,  description, edition_language)
  values ('The Documents in the Case', 'Documents in the Case', '0061043605', '9780061043604', 'HarperTorch', '1995-07-11', 272, 'Paperback', '1', null, 'English');
  
insert into author (name)
  values ('Dorothy L. Sayers');
  
insert into author (name)
  values ('Robert Eustace');
  
insert into book_author (book_id, author_id)
  select b.id, a.id from book b join author a where
  b.title = 'The Documents in the Case' and a.name in ('Dorothy L. Sayers', 'Robert Eustace');
  
-- Terry Pratchett, Neil Gaiman

insert into book (title, sort_title, isbn, isbn13, publisher, published, pages, format, edition,  description, edition_language)
  values ('Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch', 'Good Omens', '0060853980', '9780060853983', 'HarperTorch', '1990-05-01', 430, 'Paperback', '1', null, 'English');

insert into author (name)
  values ('Neil Gaiman');
  
insert into book_author (book_id, author_id)
  select b.id, a.id from book b join author a where
  b.title = 'Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch' and a.name in ('Neil Gaiman', 'Terry Pratchett');
  
  
  

