"use strict";

var testd = {};

var books = [{
    title: 'Dark Orbit',
    sort_title: 'Dark Orbit',
    description: null,
    Editions: [{
        isbn: '0765336294',
        isbn13: null,
        publisher: 'Tor Books (Macmillan)',
        published: '2015-07-14',
        pages: 303,
        edition: '1',
        editionLanguage: 'English',
        Formats: [{
            format: 'Hardcover'
            }]
        }, {
        isbn: null,
        isbn13: null,
        publisher: 'Tor Books',
        published: '2015-07-14',
        pages: 304,
        edition: '2',
        editionLanguage: 'English',
        Formats: [{
            format: 'Kindle Edition'
            }]
        }, {
        isbn: '0765336308',
        isbn13: null,
        publisher: 'Tor Books',
        published: '2016-05-10',
        pages: 0,
        edition: '3',
        editionLanguage: 'English',
        Formats: [{
            format: 'Paperback'
            }]
        }]
    }, {
    title: 'The Color of Magic (Discworld #1)',
    sort_title: 'Color of Magic',
    description: null,
    Editions: [{
        isbn: '0060855924',
        isbn13: '9780060855925',
        publisher: 'Harper',
        published: '2005-09-13',
        pages: 288,
        edition: '1',
        editionLanguage: 'English',
        Formats: [{
            format: 'Hardcover'
            }]
        }, {
        isbn: '0061020702',
        isbn13: '9780061020704',
        publisher: 'HarperTorch',
        published: '2000-02-02',
        pages: 241,
        edition: '2',
        editionLanguage: 'English',
        Formats: [{
            format: 'Mass Market Paperback'
            }]
        }, {
        isbn: '0060855908',
        isbn13: '9780060855901',
        publisher: 'Harper Perennial',
        published: '2005-09-13',
        pages: 288,
        edition: '3',
        editionLanguage: 'English',
        Formats: [{
            format: 'Paperback'
            }]
        }]
    }, {
    title: 'The Documents in the Case',
    sort_title: 'Documents in the Case',
    description: null,
    Editions: [{
        isbn: '0061043605',
        isbn13: '9780061043604',
        publisher: 'HarperTorch',
        published: '1995-07-11',
        pages: 272,
        edition: '1',
        editionLanguage: 'English',
        Formats: [{
            format: 'Paperback'
            }, {
            format: 'Hardcover'
            }]
        }]
    }, {
    title: 'Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch',
    sort_title: 'Good Omens',
    description: null,
    Editions: [{
        isbn: '0060853980',
        isbn13: '9780060853983',
        publisher: 'HarperTorch',
        published: '1990-05-01',
        pages: 430,
        edition: '1',
        editionLanguage: 'English',
        Formats: [{
            format: 'Paperback'
            }]
        }]
    }];

var authors = [{
    name: 'Carolyn Ives Gilman'
}, {
    name: 'Terry Pratchett'
}, {
    name: 'Dorothy L. Sayers'
}, {
    name: 'Robert Eustace'
}, {
    name: 'Neil Gaiman'
}];

var authorships = {
    'Carolyn Ives Gilman': ['Dark Orbit'],
    'Terry Pratchett': ['Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch',
                        'The Color of Magic (Discworld #1)'],
    'Dorothy L. Sayers': ['The Documents in the Case'],
    'Robert Eustace': ['The Documents in the Case'],
    'Neil Gaiman': ['Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch']
};

testd.books = books;
testd.authors = authors;
testd.authorships = authorships;

module.exports = testd;
