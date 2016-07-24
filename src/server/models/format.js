"use strict";

module.exports = function (sequelize, DataTypes) {
    var Format = sequelize.define('Format', {
        format: {
            type: DataTypes.STRING
        }
    });

    return Format;
};
