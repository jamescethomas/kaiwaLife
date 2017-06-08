// users api
var HttpStatus = require('http-status-codes');
var hashAndSalt = require('password-hash-and-salt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FB = require('fb');

var config = require('./config');
var auth = require('./auth.js');
var profile = require('./app/module/profile.js');

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    fb_id: String,
    role: String,
    userid: Number
});

var UserModel = mongoose.model('users', userSchema);

var counterSchema = new Schema({
    _id: String,
    seq: Number
});

mongoose.model('counters', counterSchema);

/**
 * Responsed with an error status
 *
 * @param {object} res
 * @param {object} err
 */
function returnServerError (res, err) {
    /*
     * status  : 500
     * message : database error
     */
    res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
            error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
        });
}

/**
 * Respond with a conflict error
 *
 * @param {object} res
 * @param {object} err
 */
function returnConfictError (res, err) {
    /*
     * status  : 409
     * message : user already exists
     */
    res
        .status(HttpStatus.CONFLICT)
        .send({
            error: HttpStatus.getStatusText(HttpStatus.CONFLICT)
        });
}

var users = {
    create: function(req, res) {
        var response;
        mongoose.model('users').find({
            email: req.body.email
        }, function(err, users) {
            if (err) {
                /**
                * status  : 500
                * message : db error
                 */
                returnServerError(res, err);
                return;
            } else {
                console.log(users);
                console.log(users.length)
                if (users.length !== 0) { // user email is a duplicte
                    console.log("USER ALREADY EXISTS");
                    returnConfictError(res, err);
                    return;
                } else {
                    getNextSequence('userid', function (nextId) {
                        var newUser = new UserModel({
                            userid: nextId,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            role: 'user'
                        });

                        hashAndSalt(req.body.password).hash(function(error, hash) {
                            if (error) {
                                throw new Error("hashing error");
                                console.log(error);
                                /*
                                 * status  : 500
                                 * message : hashing error
                                 */
                                returnServerError(res, err);
                                return;
                            } else {
                                newUser.password = hash;

                                // Save user to database
                                newUser.save(function(err) {
                                    console.log(newUser);
                                    if (!err) {
                                        var userData = {
                                            firstName: newUser.firstName,
                                            lastName: newUser.lastName,
                                            userid: nextId
                                        };
                                        // Create user profile
                                        profile.create(res, userData, function () {
                                            /*
                                             * status  : 201
                                             * message : account created
                                             */
                                            res
                                                .status(HttpStatus.CREATED)
                                                .send({
                                                    message: "account created successfully"
                                                })
                                            return;
                                        });
                                    } else {
                                        console.log(err);
                                        returnServerError(res, err);
                                        return;
                                    }
                                });
                            }
                        });
                    });
                }
            }
        });
    },

    create_fb: function(req, res) {
        console.log(req.body);
        console.log(config);

        FB.api('oauth/access_token', {
            client_id: config.facebook.appId,
            client_secret: config.facebook.appSecret,
            grant_type: 'fb_exchange_token',
            fb_exchange_token: req.body.fb_token
        }, function(response) {
            if (!response || response.error) {

                console.log(!response ? 'error occurred' : response.error);

                // error logging into facebook, do not provide access token
                res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send({
                        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
                    });
                return;
            }

            var accessToken = response.access_token;
            var expires = response.expires ? response.expires : 0;

            mongoose.model('users').find({
                email: req.body.email
            }, function(err, users) {
                if (err) {
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
                } else {
                    if (users.length === 0) {
                        // create new user
                        getNextSequence('userid', function (nextId) {

                            var newUser = new UserModel({
                                userid: nextId,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email,
                                fb_id: req.body.fb_id,
                                role: 'user'
                            });

                            // Save user to database
                            newUser.save(function(err) {
                                console.log(newUser);
                                if (!err) {
                                    var user = {
                                            firstName: newUser.firstName,
                                            lastName: newUser.lastName,
                                            role: newUser.role,
                                            email: newUser.email,
                                            fb_id: req.body.fb_id,
                                            fb_token: accessToken
                                        }
                                        /*
                                         * status  : 201
                                         * message : account created
                                         * Successfull login via facebook
                                         */
                                    res.status(HttpStatus.CREATED);
                                    res.json(auth.getToken(user));
                                    return;
                                } else {
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
                            });
                        });

                    } else {
                        var userData = users[0];
                        // user already exists
                        // add FB if user logged in via email initially
                        if (!userData.fb_id) {
                            console.log("adding fb_id");
                            userData.fb_id = req.body.fb_id;
                            userData.save(function(err) {
                                if (err) {
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
                            });
                        }

                        var user = {
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            role: userData.role,
                            email: userData.email,
                            fb_id: req.body.fb_id,
                            fb_token: accessToken
                        }

                        /*
                         *	status : 200
                         *	Successfull login via facebook
                         */
                        res.status(HttpStatus.OK);
                        res.json(auth.getToken(user));
                        return;
                    }
                }
            });
        });
    },

    create_fb: function(req, res) {

    },

    read: function() {

    },

    update: function() {

    },

    remove: function() {

    },

    loginTest: function(req, res) {
        mongoose.model('users').find({}, function(err, users) {
            res.status(200);
            res.json(users);
            return;
        });
    }
}

/**
 * Get the next userId
 *
 * @param string name - the name of the sequence
 * @param function callback
 */
function getNextSequence(name, callback) {
   mongoose.model('counters').findOneAndUpdate(
        {
            _id: name
        },
        { $inc: { seq: 1 } },
        function (err, counters) {
            if (err) throw err;
            callback(counters.seq);
        }
   );
}

module.exports = users;
