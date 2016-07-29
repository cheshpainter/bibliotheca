"use strict";

module.exports = function (app) {

    app.use('/books-info', require('./books-info'));
    app.use('/books', require('./books'));
    app.use('/authors', require('./authors'));

};
