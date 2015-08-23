// user server 
(function () {
	'use strict';

	angular.module('kaiwaLife').factory('User', User);
	User.$inject = ['$http'];
	function User($http) {
		var service = {};

		service.language = null;
		service.email = null;
		service.token = null;
		service.role = null;

		service.fb_token = null;
		service.fb_id = null;

		service.fb_login = fb_login;
		service.fb_signup = fb_signup;

		service.createNewUser = createNewUser;
		service.facebookAuth = facebookAuth;

		function fb_signup(callback) {
			service.fb_login(function(response) {
				if (response === "success") {
					FB.api('/me?fields=email,first_name,last_name,birthday', function(response) {
						// console.log(JSON.stringify(response));
						var data = {
							"firstName": response.first_name,
							"lastName": response.last_name,
							"email": response.email,
							"fb_id": response.id,
							"fb_token": service.fb_token
						};
						service.facebookAuth(data, callback);
					});
				}
			});
		}

		function fb_login(callback) {
			FB.login(function(response) {
				// console.log(response);
				if (response.authResponse) {
					console.log("fb authentication successfull");

					service.fb_token = response.authResponse.accessToken;
					service.fb_id = response.authResponse.userID;

					callback("success");
				} else {
					callback("error");
				}
			}, {
				scope: "public_profile,email"
			});
		}

		function createNewUser(data, callback) {
			$http({
				method: 'POST',
				url: '/createNewUser',
				data: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				callback(data, "success");
			}).
			error(function(data, status, headers, config) {
				callback(data, status);
			});
		}

		function facebookAuth(data, callback) {
			$http({
				method: 'POST',
				url: '/createNewUserFB',
				data: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				service.token = data.token;
				service.email = data.user.email;
				service.role = data.user.role;
				// TODO:
				// service.language = data.user.language;
				service.fb_token = data.user.fb_token;

				callback(data, "success");
			}).
			error(function(data, status, headers, config) {
				callback(data, status);
			});
		}

		return service;
	}
})();