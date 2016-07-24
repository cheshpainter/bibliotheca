var Sequelize = require('sequelize');
var sequelize = new Sequelize('test.db', null, null, {
    host: 'localhost',
    dialect: 'sqlite',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: __dirname + '/data/test.db'
});

sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

var Book = sequelize.define('book', {
    title: {
        type: Sequelize.STRING,
        unique: true
    },
    sortTitle: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
    }
});

var Edition = sequelize.define('edition', {
    isbn: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    isbn13: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    publisher: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    published: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    pages: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    edition: {
        type: Sequelize.STRING
    },
    editionLanguage: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    }
});

var Format = sequelize.define('format', {
    format: {
        type: Sequelize.STRING
    }
});

var Author = sequelize.define('author', {
    name: {
        type: Sequelize.STRING,
        unique: true
    }
});

Book.hasMany(Edition);

Edition.hasMany(Format);

Book.belongsToMany(Author, {
    as: 'writtenBy',
    through: 'authorships'
});

Author.belongsToMany(Book, {
    as: 'hasWritten',
    through: 'authorships'
});

// Sync all models that aren't already in the database
// sequelize.sync()

// Force sync all models
sequelize.sync({
    force: true
}).then(function () {

    console.log('Successfully sync\'d');

    //    Book.create({
    //        title: 'My Book',
    //        sort_title: 'Book',
    //        description: 'Myown book.'
    //    }).then(function (book) {
    //        Edition.create({
    //            edition: '1',
    //            isbn: '1234567890',
    //            isbn13: '1234567890'
    //        }).then(function (edition) {
    //            book.setEditions([edition]);
    //            Format.create({
    //                format: 'Hardcover'
    //            }).then(function (format) {
    //                edition.setFormats([format]);
    //            });
    //        });
    //    });

    Book.create({
        title: 'My Book',
        sort_title: 'Book',
        description: 'Myown book.',
        editions: [{
            edition: '1',
            isbn: '1234567890',
            isbn13: '1234567890',
            formats: [{
                format: 'Hardcover'
            }]
        }, {
            edition: '2',
            isbn: '1234567890',
            isbn13: '1234567890',
            formats: [{
                format: 'Paperback'
            }]
        }]
    }, {
        include: [{
            model: Edition,
            include: [Format]
        }]
    }).then(function (book) {
        Author.findOrCreate({
            where: {
                name: 'Chesh'
            },
            defaults: {
                name: 'Chesh'
            }
        }).spread(function (author, created) {
            author.addHasWritten(book);
        });
    });

}).catch(function (error) {
    console.log('Error encountered; cannot sync.');
    console.log(error);
});

// Drop all tables
// sequelize.drop()

// emit handling
//sequelize.[sync | drop]().then(function () {
// woot woot
//}).catch(function (error) {
// whooops
//});
