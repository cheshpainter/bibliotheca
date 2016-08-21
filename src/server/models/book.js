"use strict";

module.exports = function (sequelize, DataTypes) {

    var Book = sequelize.define('Book', {
        title: {
            type: DataTypes.STRING,
            unique: true
        },
        sortTitle: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        }
    }, {
        classMethods: {
            associate: function (models) {
                Book.hasMany(models.Edition);
                Book.belongsToMany(models.Author, {
                    as: 'writtenBy',
                    through: 'Authorships'
                });
            }
        }
    });

    return Book;
};
