// auth.js
var HttpStatus = require('http-status-codes');
var jwt = require('jwt-simple');
var hashAndSalt = require('password-hash-and-salt');
var mongoose = require('mongoose');

var auth = {
	getToken: function(user) {
		var expires = expiresIn(1); // 1 day
		var token = jwt.encode({
			exp: expires,
			user: user
		}, require('./config/secret')());

		return {
			token: token,
			expires: expires,
			user: user
		};
	},

	login: function(req, res) {
		var email = req.body.email || '';
		var password = req.body.password || '';

		if (email == '' || password == '') {
			res.status(401);
			res.json({
				"status": 401,
				"message": "Invalid credentials"
			});
			return;
		}

		mongoose.model('users').find({email: email}, function(err, users) {
			if (!err) {
				if (users.length == 1) {

					var userData = users[0];

					hashAndSalt(password).verifyAgainst(userData.password, function(error, verified) {
						if(error) {
							throw new Error('hashing error');
						}

						if(!verified) {
							console.log("invalid password");
							/*
							 * status  : 401
							 * message : invalid credentials
							 */
							res.status(HttpStatus.UNAUTHORIZED);
							res.json({
								"status": 401,
								"message": "Invalid credentials"
							});
							 return;
						} else {
							console.log("successful login");
							/* SUCCESS
							 * status  : 200
							 * message : login success
							 */

							var user = {
								firstName : userData.firstName,
								lastName : userData.lastName,
								role :userData.role,
								email : userData.email
							}
							res.status(HttpStatus.OK);
							res.json(auth.getToken(user));
							return;
						}
					});
				} else {
					console.log("Email doesn't match any user");
					/*
					 * status  : 401
					 * message : invalid credentials
					 */
					res.status(HttpStatus.UNAUTHORIZED);
					res.json({
						"status": 401,
						"message": "Invalid credentials"
					});
					return;
				}
			} else {
				console.log("database error");
				/*
				 * status  : 500
				 * message : database error
				 */
				res.status(HttpStatus.INTERNAL_SERVER_ERROR);
				res.json({
					"status": 500,
					"message": "Invalid credentials"
				});
				return;
			}
		});
	},

	validateUser: function(email) {
		// TODO
		// Check if te user is the correct role for this page

		var User = {
			name: 'James',
			role: 'admin',
			username: 'james.c.e.thomas@gmail.com'
		}
		return User;
	}
}


function expiresIn(numDays) {
	var dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
