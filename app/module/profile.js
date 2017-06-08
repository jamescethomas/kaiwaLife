// users api
var async = require('async');
var HttpStatus = require('http-status-codes');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var config = require('../../config');
var auth = require('../../auth.js');
var user = require('../../users.js');
var util = require('../../util.js');

var jwt = require('jwt-simple');
var fs = require('fs');
var hashAndSalt = require('password-hash-and-salt');

var profileSchema = new Schema({
    firstName: String,
    lastName: String,
    country: String,
    state: String,
    city: String,
    learning: String,
    native: String,
    joindate: String,
    bio: String,
    userid: Number,
    birthday: Date,
    gender: String,
    timezone: String
});

var profileImageSchema = new Schema({
    userid: Number,
    filepath: String,
    contentType: String
});

var ProfileModel = mongoose.model('profiles', profileSchema);
var ProfileImageModel = mongoose.model('profileImages', profileImageSchema);


var profile = {
    create: function(res, userData, callback) {
        mongoose.model('profiles').find({
            userid: userData.userid
        }, function(err, profile) {
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
                if (profile.length !== 0) { // user email is a duplicte
                    console.log("PROFILE ALREADY EXISTS");
                    /*
                     * status  : 409
                     * message : user already exists
                     */
                    res
                        .status(HttpStatus.CONFLICT)
                        .send({
                            error: HttpStatus.getStatusText(HttpStatus.CONFLICT)
                        });
                    return;
                } else {
                    var newProfile = new ProfileModel({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        country: '',
                        state: '',
                        city: '',
                        learning: '',
                        native: '',
                        joindate: '',
                        bio: '',
                        timezone: '',
                        birthday: '',
                        gender: '',
                        userid: userData.userid
                    });

                    // Save user to database
                    newProfile.save(function(err) {
                        if (!err) {
                            console.log("Profile " + userid + " created successfully");
                            callback();
                        } else {
                            console.log("Error creating profile " + userid);
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
                }
            }
        });
    },

    read: function (req, res) {
        mongoose.model('profiles').find({
            userid: req.params.userid
        }, function(err, profile) {
            if (err) {
                console.log("Error: error retreiving profile with userid - " + req.params.userid);
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

            if (profile.length === 1) {
                profile = profile[0];

                res.status(HttpStatus.OK);
                res.json({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    country: profile.country,
                    state: profile.state,
                    city: profile.city,
                    learning: profile.learning,
                    native: profile.native,
                    joindate: profile.joindate,
                    bio: profile.bio,
                    timezone: profile.timezone,
                    gender: profile.gender,
                    birthday: profile.birthday
                });
                return;
            }

            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                    error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
                });
            return;
        });
    },

    update: function (req, res) {
        var token = req.headers['x-access-token'],
            decoded,
            query,
            updateProfile,
            updateUser,
            profileData = {},
            userData = {},
            options = {};

        // Decode user information from the token
        decoded = jwt.decode(token, require('../../config/secret.js')());

        // Set up the query string to get user data from the db via the userid
        query = {
            userid: decoded.user.userid
        };

        if (req.body.firstName) {
            profileData.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            profileData.lastName = req.body.lastName;
        }
        if (req.body.country) {
            profileData.country = req.body.country;
        }
        if (req.body.state) {
            profileData.state = req.body.state;
        }
        if (req.body.city) {
            profileData.city = req.body.city;
        }
        if (req.body.learning) {
            profileData.learning = req.body.learning;
        }
        if (req.body.native) {
            profileData.native = req.body.native;
        }
        if (req.body.timezone) {
            profileData.timezone = req.body.timezone;
        }
        if (req.body.birthday) {
            profileData.birthday = req.body.birthday;
        }
        if (req.body.gender) {
            profileData.gender = req.body.gender;
        }
        if (req.body.bio) {
            profileData.bio = req.body.bio;
        }

        // Set the values to update for the profiles document
        updateProfile = {
            $set: profileData
        };

        // Set the values to update for the users document
        updateUser = {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
        };

        // Update the user profile document in the db
        function  updateProfileDocument (callback) {
            console.log("UPDATING USER -------------");
            console.log(query);
            console.log(updateProfile);
            mongoose.model('profiles').update(query, updateProfile, options, function (err, result) {
                console.log("UPDATE PROFILE");
                console.log(err);
                console.log(result);
                callback(err, result);
            });
        };

        // Update the user document in the db
        function updateUserDocument (callback) {
            mongoose.model('users').update(query, updateUser, options, function (err, result) {
                callback(err, result);
            });
        };

        // Delete old profile picture, if one exists
        function deleteOldProfilePicture (callback) {
            var query, fields, options = {};

            // Set up the query string to get user data from the db via the userid
            query = {
                userid: decoded.user.userid
            };

            fields = {
                "filepath": 1,
                "contentType": 1
            };

            mongoose.model('profileImages').find(query, fields, options, function (err, result) {
                if (err) {
                    util.returnError(err);
                } else {
                    if (result.length > 0) {
                        fileName = result[0].filepath;

                        fs.stat(__dirname + '/tmp/' + decoded.user.userid + '/temp_' + fileName, function (err, stats) {
                            if (err && err.code == 'ENOENT') {
                                // If the file does not exist, continue by calling the callback
                                callback();
                            } else if (err) {
                                util.returnError(err);
                            } else  {
                                // Delete the old profile picture
                                fs.unlink(__dirname + '/tmp/' + decoded.user.userid + '/' + fileName,
                                    function () {
                                        // Updated name of the new profile picture
                                        fs.rename(__dirname + '/tmp/' + decoded.user.userid + '/temp_' + fileName,
                                                  __dirname + '/tmp/' + decoded.user.userid + '/' + fileName, function () {
                                                      callback();
                                                  });
                                    });
                            }
                        });
                    } else {
                        callback();
                    }
                }
            });
        };

        function onUpdatesComplete (err, result) {
            if (err) {
                console.log("Error: error updaing profile with userid - " + req.body.userid);
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
            } else {
                /*
                 * status  : 200
                 * message : Profile updated successfully
                 */
                res
                    .status(HttpStatus.OK)
                    .send({
                        message: "Profile updated successfully"
                    })
                return;
            }
        };

        // Perform the updates asynchrounsly
        async.parallel(
            [
                updateUserDocument,
                updateProfileDocument,
                deleteOldProfilePicture
            ],
            onUpdatesComplete
        );
    },

    cancelUpdate: function (req, res) {
        var token = req.headers['x-access-token'],
            decoded,
            query, fields, options = {};

        // Decode user information from the token
        decoded = jwt.decode(token, require('../../config/secret.js')());

        // Set up the query string to get user data from the db via the userid
        query = {
            userid: decoded.user.userid
        };

        fields = {
            "filepath": 1,
            "contentType": 1
        };

        mongoose.model('profileImages').find(query, fields, options, function (err, result) {
            if (err) {
                util.returnError(err);
            } else {
                if (result.length > 0) {
                    fileName = result[0].filepath;

                    fs.stat(__dirname + '/tmp/' + decoded.user.userid + '/temp_' + fileName, function (err, stats) {
                        if (err && err.code == 'ENOENT') {
                            // If the file does not exist, continue by calling the callback
                            sendResponse();
                        } else if (err) {
                            util.returnError(err);
                        } else  {
                            // Delete the old profile picture
                            fs.unlink(__dirname + '/tmp/' + decoded.user.userid + '/temp_' + fileName,
                                function () {
                                    sendResponse();
                                });
                        }
                    });
                } else {
                    sendResponse();
                }
            }
        });

        function sendResponse () {
            res
                .status(HttpStatus.OK)
                .send({
                    message: "Cancelled editing profile"
                });
            return;
        };
    },

    destroy: function (req, res) {

    },

    saveProfilePicture: function (req, res) {
        var token = req.headers['x-access-token'],
            decoded,
            query,
            update,
            options = {},
            fileName = '',
            file,
            extension,
            contentType;

        // Decode user information from the token
        decoded = jwt.decode(token, require('../../config/secret.js')());

        // Set up the query string to get user data from the db via the userid
        query = {
            userid: decoded.user.userid
        };

        if (!req.files.file) {
            res.send('No files were uploaded.');
            return;
        }

        // Receive profile picture from the frontend
        file = req.files.file;
        contentType = file.mimetype;

        extension = file.name.substring(file.name.lastIndexOf('.'), file.name.length);

        // After check file path returns
        function getFilePath (callback, a, b) {
            hashAndSalt(decoded.user.userid + '').hash(function(err, hash) {
                if (err) {
                    returnError(err);
                } else {
                    fileName = hash.substring(2, 10) + extension;
                    update = {
                        $set: {
                            filepath: fileName,
                            contentType: contentType
                        }
                    };

                    // save file path in DB
                    mongoose.model('profileImages').update(query, update, {upsert: true}, function (err, result) {
                        if (err) {
                            returnError(err);
                        } else {
                            callback();
                        }
                    });
                }
            });
        };

        // Write profile picture to file system
        function updateProfileImage (callback) {
            fs.stat(__dirname + '/tmp/' + decoded.user.userid  + '/' + fileName, function (err, stats) {
                if (err && err.code == 'ENOENT') {
                    fs.mkdir(__dirname + '/tmp/' + decoded.user.userid, function (err) {
                        if (err && err.code != "EEXIST") {
                            returnError(err);
                        } else {
                            moveFile(callback);
                        }
                    });
                } else if (err) {
                    returnError(err);
                } else  {
                    moveFile(callback);
                }
            });
        };

        function moveFile (callback) {
            file.mv(__dirname + '/tmp/' + decoded.user.userid + '/temp_' + fileName, function (err) {
                if (err) {
                    returnError(err);
                } else {
                    callback();
                }
            });
        };

        // Send response to frontend, including profile image to be displayed
        // in the the edit profile page
        function onUpdateProfileImageComplete (err, result) {
            /*
             * status  : 200
             * message : Profile image updated successfully
             */
            res
                .status(HttpStatus.OK)
                .send({
                    message: "Profile picture updated successfully",
                    filepath: decoded.user.userid + '/temp_' + fileName
                });
            return;
        };

        function returnError(err) {
            console.log("Error: error updaing profile image with userid - " + decoded.user.userid);
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
        };

        // Perform db operations asynchronusly
        async.series(
            [
                getFilePath,
                updateProfileImage,
                onUpdateProfileImageComplete
            ]
        );
    },

    getProfilePictureUrl: function (req, res) {
        var token = req.headers['x-access-token'],
            decoded,
            query,
            update,
            options = {},
            fields;

        // Decode user information from the token
        decoded = jwt.decode(token, require('../../config/secret.js')());

        // Set up the query string to get user data from the db via the userid
        query = {
            userid: req.params.userid
        };

        fields = {
            "filepath": 1,
            "contentType": 1
        };

        mongoose.model('profileImages').find(query, fields, options, function (err, result) {
            if (err) {
                returnError(err);
            } else {
                if (result.length > 0) {
                    res.send({
                        filepath: req.params.userid + '/' + result[0].filepath
                    });
                }
            }
        });

        function returnError(err) {
            console.log("Error: error updaing profile image with userid - " + decoded.user.userid);
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
        };
    }
};

function generateProfileImageName (usereId, extension, callback) {
    var imagePath = '';

    hashAndSalt(usereId+ '').hash(function(err, hash) {
        if (err) {
            utils.returnError(err);
        } else {
            imagePath = hash.substring(2, 10) + extension;
            callback(imagePath);
        }
    });
}

module.exports = profile;
