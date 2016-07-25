module.exports = function (app) {

    var express = require('express');
    var models = require("../models");

    // var db = models.db;
    var sequelize = models.sequelize;
    var Sequelize = models.Sequelize;

    var Book = models.Book;
    var Edition = models.Edition;
    var Format = models.Format;

    var booksRouter = express.Router();
    app.use('/books', booksRouter);

    booksRouter.get('/', getAllBooks, function (req, res) {
        res.json(req.books);
    });

    booksRouter.get('/:id', getOneBook, function (req, res) {
        res.json(req.book);
    });

    booksRouter.get('/:id/authors', getAllAuthorsForOneBook, function (req, res) {
        res.json(req.authors);
    });

    var authorsRouter = express.Router();
    app.use('/authors', authorsRouter);

    authorsRouter.get('/', getAllAuthors, function (req, res) {
        res.json(req.authors);
    });

    authorsRouter.get('/:id', getOneAuthor, function (req, res) {
        res.json(req.author);
    });

    authorsRouter.get('/:id/books', getAllBooksForOneAuthor, function (req, res) {
        res.json(req.books);
    });

    function getAllBooks(req, res, next) {

        Book.findAll().then(function (books) {
            // No results returned mean the object is not found
            if (books.length === 0) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Books not found"]
                });
            }
            req.books = books;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve books"]
                });
            }
        });
    }

    function getOneBook(req, res, next) {

        var bookId = req.params.id;

        Book.findById(bookId, {
            include: [{
                model: Edition,
                include: [{
                    model: Format
                }]
            }]
        }).then(function (book) {
            // No results returned mean the object is not found
            if (book === null) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Book not found"]
                });
            }
            req.book = book;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve book"]
                });
            }
        });
    }

    function getAllAuthors(req, res, next) {

        Author.findAll().then(function (authors) {
            // No results returned mean the object is not found
            if (authors.length === 0) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Authors not found"]
                });
            }
            req.authors = authors;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve authors"]
                });
            }
        });
    }

    function getOneAuthor(req, res, next) {

        var authorId = req.params.id;

        Author.findById(authorId).then(function (author) {
            // No results returned mean the object is not found
            if (author === null) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json({
                    errors: ["Author not found"]
                });
            }
            req.author = author;
            next();
        }).catch(function (err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                return res.json({
                    errors: ["Could not retrieve author"]
                });
            }
        });
    }

    app.get('/api/maa', getMaa);

    function getMaa(req, res, next) {
        var json = [{
            "id": 1017109,
            "name": "Black Widow/Natasha Romanoff",
            "description": "Natasha Romanoff, also known as Black Widow, is a world-renowned super spy and one of S.H.I.E.L.D.'s top agents. Her hand-to-hand combat skills, intelligence, and unpredictability make her a deadly secret weapon. True to her mysterious nature, Black Widow comes and goes as she pleases, but always appears exactly when her particular skills are needed."
        }, {
            "id": 1017105,
            "name": "Captain America/Steve Rogers",
            "description": "During World War II, Steve Rogers enlisted in the military and was injected with a super-serum that turned him into super-soldier Captain America! He's a skilled strategist and even more skilled with his shield, but it's his courage and good heart that makes Captain America both a leader and a true hero. "
        }, {
            "id": 1017110,
            "name": "Falcon/Sam Wilson",
            "description": "Recruited from S.H.I.E.L.D. by his hero and mentor Tony Stark, Falcon is the Avengers' newest and youngest recruit. Like Tony, Sam is a genius with machines and technology. What he lacks in experience, Sam makes up in enthusiasm and determination. Falcon's suit of armor comes fully stocked with holographic wings, explosive flechettes, and retractable talons."
        }, {
            "id": 1017108,
            "name": "Hawkeye/Clint Barton",
            "description": "Hawkeye is an expert archer with an attitude just as on-target as his aim. His stealth combat experience and his ability to hit any target with any projectile make him a valuable member of the Avengers. However, he refuses to let things get too serious, as he has as many jokes as he does arrows!"
        }, {
            "id": 1017107,
            "name": "Hulk/Bruce Banner",
            "description": "Scientist Bruce Banner was transformed into the Hulk as a result to gamma radiation exposure. Over 8 feet tall and weighing 1,040 pounds, it's Hulk's strength that makes him the strongest hero in the Marvel Universe! Hulk smashes all threats that dare disturb the peace and friendship he has found in the Avengers. "
        }, {
            "id": 1017104,
            "name": "Iron Man/Tony Stark",
            "description": "Tony Stark is the genius inventor/billionaire/philanthropist owner of Stark Industries. With his super high-tech Iron Man suit, he is practically indestructible, able to fly, and has a large selection of weapons to choose from - but it's Tony's quick thinking and ability to adapt and improvise that make him an effective leader of the Avengers.        "
        }, {
            "id": 1017106,
            "name": "Thor",
            "description": "Thor is the Asgardian Prince of Thunder, the son of Odin, and the realm's mightiest warrior. He loves the thrill of battle and is always eager to show off his power to the other Avengers, especially the Hulk. Thor's legendary Uru hammer, Mjolnir, gives him the power to control thunder and the ability to fly. He's found a new home on Earth and will defend it as his own... even if he doesn't understand its sayings and customs."
        }];
        res.send(json);
    }
};
