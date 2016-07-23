var Sequelize = require('sequelize');
var sequelize = new Sequelize('books2.db', null, null, {
    host: 'localhost',
    dialect: 'sqlite',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: __dirname + '/data/books2.db'
});

sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

var Product = sequelize.define('product', {
    title: Sequelize.STRING
});
var User = sequelize.define('user', {
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING
});

Product.hasMany(User);

sequelize.sync({
    force: true
}).then(function () {
    // Table created
    return Product.create({
        title: 'Chair',
        users: [{
            first_name: 'Mick',
            last_name: 'Broadstone'
        }]
    }, {
        include: [User]
    });
});
