//var Sequelize = require('sequelize');
//var sequelize = new Sequelize('books.db', null, null, {
//    host: 'localhost',
//    dialect: 'sqlite',
//    pool: {
//        max: 5,
//        min: 0,
//        idle: 10000
//    },
//
//    // SQLite only
//    storage: __dirname + '/data/books.db'
//});

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
//var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var config = require(path.join(__dirname, 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });
