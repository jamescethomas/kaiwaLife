// user server 
(function () {
	'use strict';

	angular.module('kaiwaLife').factory('User', User);
	User.$inject = ['$http'];
	function User($http) {
		var service = {};

		service.auth = false;
		service.firstName = null;
		service.lastName = null;
		service.language = null;
		service.email = null;
		service.role = null;
		service.token = null;

		service.fb_token = null;
		service.fb_id = null;
		service.fb_login = fb_login;
		service.fb_auth = fb_auth;

		service.createNewUser = createNewUser;
		service.login = login;

		service.facebookAuth = facebookAuth;

		function setData(data) {
			console.log(data);
			service.auth = true;
			service.firstName = data.user.firstName;
			service.lastName = data.user.lastName;
			service.language = data.user.language;
			service.email = data.user.email;
			service.role = data.user.role;
			service.token = data.token;
		};

		function fb_auth(callback) {
			service.fb_login(function(response) {
				if (response === "success") {
					FB.api('/me?fields=email,first_name,last_name,birthday', function(response) {
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
		};

		function fb_login(callback) {
			FB.login(function(response) {
				if (response.authResponse) {
					service.fb_token = response.authResponse.accessToken;
					service.fb_id = response.authResponse.userID;
					callback("success");
				} else {
					callback("error");
				}
			}, {
				scope: "public_profile,email"
			});
		};

		function login(data, callback) {
			$http({
				method: 'POST',
				url: '/login',
				data: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				setData(data);
				callback(status);

			}).
			error(function(data, status, headers, config) {	
				callback(status);
			});
		};

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
		};

		function facebookAuth(data, callback) {
			$http({
				method: 'POST',
				url: '/createNewUserFB',
				data: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				setData(data);
				service.fb_token = data.user.fb_token;
				service.fb_id = data.user.fb_id;
				callback(status);
			}).
			error(function(data, status, headers, config) {
				callback(status);
			});
		};

		return service;
	}
})();
