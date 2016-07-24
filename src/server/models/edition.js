"use strict";

module.exports = function (sequelize, DataTypes) {
    var Edition = sequelize.define('Edition', {
        isbn: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        isbn13: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        publisher: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        published: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null
        },
        pages: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        edition: {
            type: DataTypes.STRING
        },
        editionLanguage: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    }, {
        classMethods: {
            associate: function (models) {
                Edition.hasMany(models.Format);
            }
        }
    });

    return Edition;
};
