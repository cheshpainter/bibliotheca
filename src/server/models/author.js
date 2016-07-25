"use strict";

module.exports = function (sequelize, DataTypes) {
    var Author = sequelize.define('Author', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        role: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                //                Author.belongsToMany(models.Book, {
                //                    as: 'hasWritten',
                //                    through: 'Authorships',
                //                    onDelete: "CASCADE",
                //                    foreignKey: {
                //                        allowNull: false
                //                    }
                //                });
                Author.belongsToMany(models.Book, {
                    as: 'hasWritten',
                    through: 'Authorships'
                });
            }
        }
    });

    return Author;
};
