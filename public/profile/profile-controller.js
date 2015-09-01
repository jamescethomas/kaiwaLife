// profile-controller.js
'use strict';

kaiwaControllers.controller('profileController', 
	function ($scope, $http, $location, $resource, User, HttpStatus) {
	$scope.init = function() {
		/*
		if (!User.auth) {
			$location.path('/home');
		} else {
			console.log(User);
		}
		*/
		var User = $resource('/profile/:userId', {userId:'@id'});
	};

	$scope.init();
});