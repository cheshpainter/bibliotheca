"use strict";

module.exports = function (sequelize, DataTypes) {
    var Format = sequelize.define('Format', {
        format: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                Format.belongsTo(models.Edition);
            }
        }
    });

    return Format;
};
