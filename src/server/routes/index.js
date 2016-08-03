"use strict";

module.exports = function (app) {

    app.use('/api/books-info', require('./books-info'));
    app.use('/api/books', require('./books'));
    app.use('/api/authors', require('./authors'));
    app.use('/api/authorships', require('./authorships'));

};
