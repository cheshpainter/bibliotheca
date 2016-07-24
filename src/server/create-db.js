var models = require("./models");

// Force sync all models
models.sequelize.sync({
    force: true
}).then(function () {
    console.log('Successfully sync\'d');

    //Load the data.

}).catch(function (error) {
    console.log('Error encountered; cannot sync.');
});
