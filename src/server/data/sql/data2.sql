
-- Carolyn Ives Gilman

insert into books (title, sort_title, description)
  values ('Dark Orbit', 'Dark Orbit', null);

insert into editions (isbn, isbn13, publisher, published, pages, edition, edition_language, book_id)
  select '0765336294', null, 'Tor Books (Macmillan)', '2015-07-14', 303, '1', 'English', b.id from books b where b.title = 'Dark Orbit';
  
insert into formats (format, edition_id)
  select 'Hardcover', e.id from editions e join books b on (b.id = e.book_id) where b.title = 'Dark Orbit' and e.edition = '1';   
  
insert into editions (isbn, isbn13, publisher, published, pages, edition, edition_language, book_id)
  select null, null, 'Tor Books', '2015-07-14', 304, '2', 'English', b.id from books b where b.title = 'Dark Orbit';
  
insert into formats (format, edition_id)
  select 'Kindle Edition', e.id from editions e join books b on (b.id = e.book_id) where b.title = 'Dark Orbit' and e.edition = '2';
  
insert into editions (isbn, isbn13, publisher, published, pages, edition, edition_language, book_id)
  select '0765336308', null, 'Tor Books', '2016-05-10', 304, '3', 'English', b.id from books b where b.title = 'Dark Orbit';
  
insert into formats (format, edition_id)
  select 'Paperback', e.id from editions e join books b on (b.id = e.book_id) where b.title = 'Dark Orbit' and e.edition = '3';
  
insert into authors (name)
  values ('Carolyn Ives Gilman');

insert into books_authors (book_id, author_id)
  select b.id, a.id from books b join authors a where b.title = 'Dark Orbit' and a.name = 'Carolyn Ives Gilman';
  
-- Terry Pratchett

insert into books (title, sort_title, description)
  values ('The Color of Magic (Discworld #1)', 'Color of Magic', null);
  
insert into editions (isbn, isbn13, publisher, published, pages, edition, edition_language, book_id)
   select '0060855924', '9780060855925', 'Harper', '2005-09-13', 288, '1', 'English', b.id from books b where b.title = 'The Color of Magic (Discworld #1)';
  
insert into formats (format, edition_id)
  select 'Hardcover', e.id from editions e join books b on (b.id = e.book_id) where b.title = 'The Color of Magic (Discworld #1)' and e.edition = '1';
  
insert into editions (isbn, isbn13, publisher, published, pages, edition, edition_language, book_id)
  select '0061020702', '9780061020704', 'HarperTorch', '2000-02-02', 241, '2', 'English', b.id from books b where b.title = 'The Color of Magic (Discworld #1)';
  
insert into formats (format, edition_id)
  select 'Mass Market Paperback', e.id from editions e join books b on (b.id = e.book_id) where b.title = 'The Color of Magic (Discworld #1)' and e.edition = '2';
  
insert into editions (isbn, isbn13, publisher, published, pages, edition,  edition_language, book_id)
  select '0060855908', '9780060855901', 'Harper Perennial', '2005-09-13', 288, '3', 'English', b.id from books b where b.title = 'The Color of Magic (Discworld #1)';
  
insert into formats (format, edition_id)
  select 'Paperback', e.id from editions e join books b on (b.id = e.book_id) where b.title = 'The Color of Magic (Discworld #1)' and e.edition = '3';
  
insert into authors (name)
  values ('Terry Pratchett');
  
insert into books_authors (book_id, author_id)
  select b.id, a.id from books b join authors a where b.title in ('The Color of Magic (Discworld #1)', 'The Light Fantastic (Discworld #2)', 'Equal Rites (Discworld #3)') and a.name = 'Terry Pratchett';
  
--  Dorothy L. Sayers, Robert Eustace
  
insert into books (title, sort_title, description)
  values ('The Documents in the Case', 'Documents in the Case', null);
  
insert into editions (isbn, isbn13, publisher, published, pages, edition, edition_language, book_id)
 select '0061043605', '9780061043604', 'HarperTorch', '1995-07-11', 272, '1', 'English', b.id from books b where b.title = 'The Documents in the Case';
  
insert into formats (format, edition_id)
  select 'Paperback', e.id from editions e join books b on (b.id = e.book_id) where b.title = 'The Documents in the Case' and e.edition = '1';
  
insert into formats (format, edition_id)
  select 'Hardcover', e.id from editions e join books b on (b.id = e.book_id) where b.title = 'The Documents in the Case' and e.edition = '1';
  
insert into authors (name)
  values ('Dorothy L. Sayers');
  
insert into authors (name)
  values ('Robert Eustace');
  
insert into books_authors (book_id, author_id)
  select b.id, a.id from books b join authors a where
  b.title = 'The Documents in the Case' and a.name in ('Dorothy L. Sayers', 'Robert Eustace');  
  
-- Terry Pratchett, Neil Gaiman

insert into books (title, sort_title, description)
  values ('Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch', 'Good Omens', null);
  
insert into editions (isbn, isbn13, publisher, published, pages, edition, edition_language, book_id)
  select '0060853980', '9780060853983', 'HarperTorch', '1990-05-01', 430, '1', 'English', b.id from books b where b.title = 'Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch';
  
insert into formats (format, edition_id)
  select 'Paperback', e.id from editions e join books b on (b.id = e.book_id) where b.title = 'Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch' and e.edition = '1';

insert into authors (name)
  values ('Neil Gaiman');
  
insert into books_authors (book_id, author_id)
  select b.id, a.id from books b join authors a where
  b.title = 'Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch' and a.name in ('Neil Gaiman', 'Terry Pratchett');
  
