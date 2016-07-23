

select a.name from author a where a.id = (select ba.author from book_author ba where ba.book = (select b.id from book b where b.title = 'title'));


select r.id as recipe_id, r.name, ri.ingredient_id 
from recipes r 
join recipe_ingredients ri on (r.id = ri.recipe_id);

select r.id as recipe_id, r.name, ri.ingredient_id, i.item
from recipes r
join recipe_ingredients ri on (r.id = ri.recipe_id)
join ingredients i on (ri.ingredient_id = i.id);

select r.id as recipe_id, r.name, ri.ingredient_id, i.item 
from recipes r 
left join recipe_ingredients ri on (r.id = ri.recipe_id)
left join ingredients i on (ri.ingredient_id = i.id);

select b.id, b.title, ba.author, a.name
from book b
join book_author ba on (b.id = ba.book_id)
join author a on (ba.author_id = a.id);

-- given a book's title what is the author's name?

select distinct a.name
from book b
join book_author ba on (b.id = ba.book_id)
join author a on (ba.author_id = a.id)
where b.title = 'Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch';

select distinct a.name
from book b
join book_author ba on (b.id = ba.book_id)
join author a on (ba.author_id = a.id)
where b.title = 'The Color of Magic (Discworld #1)';

-- given an author's name what is the book's title?

select distinct b.title
from author a
join book_author ba on (a.id = ba.author_id)
join book b on (ba.book_id = b.id)
where a.name = 'Terry Pratchett';

