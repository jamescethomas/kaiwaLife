/* util.js */

var util = {
    returnError: function (err) {
        console.log(err);
        /*
         * status  : 500
         * message : database error
         */
        res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({
                error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
            });
        return;
    }
};

module.exports = util;
