module.exports = function () {
    var service = {
        init: init,
        logErrors: logErrors
    };
    return service;

    function init(err, req, res, next) {
        var status = err.statusCode || 500;
        if (err.message) {
            res.send(status, err.message);
        } else {
            res.send(status, err);
        }
        next();
    }

    /* Our fall through error logger and errorHandler  */
    function logErrors(err, req, res, next) {
        var status = err.statusCode || 500;
        console.error(status + ' ' + (err.message ? err.message : err));
        if (err.stack) {
            console.error(err.stack);
        }
        next(err);
    }

    // development error handler
    // will print stacktrace
//    if (app.get('env') === 'development') {
    //        app.use(function (err, req, res, next) {
    //            res.status(err.code || 500)
    //                .json({
    //                    status: 'error',
    //                    message: err
    //                });
    //        });
    //    }

    // production error handler
    // no stacktraces leaked to user
//    app.use(function (err, req, res, next) {
//        res.status(err.status || 500)
//            .json({
//                status: 'error',
//                message: err.message
//            });
//    });
};
