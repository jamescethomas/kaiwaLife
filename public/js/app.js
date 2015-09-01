'use strict';

/* App Module */

var kaiwaLife = angular.module('kaiwaLife', [
  'ngRoute',
  'ngAnimate',
  'ngResource',

  'kaiwaControllers',

  'ui.bootstrap',
  'pascalprecht.translate'
]);

/*
kaiwaLife.factory('User', function(){
	return {
		language : null
	}
});
*/

kaiwaLife.factory('HttpStatus', function() {
	var service = {};

	service.SERVER_ERROR = 500;
	service.CONFLICT = 409;
	service.INVALID_CREDENTIALS = 401;
	service.OK = 200;

	return service; 
});


kaiwaLife.config(['$routeProvider', '$translateProvider', '$resourceProvider',
	function($routeProvider, $translateProvider, $resourceProvider) {
	$routeProvider.
		when('/profile', {
			templateUrl: 'profile/profile.html',
			controller: 'profileController'
		}).
		when('/home', {
			templateUrl: 'home/home.html',
			controller: 'homeController'
		});
		/*
		otherwise({
			redirectTo: '/home'
		});
		*/

	$translateProvider.preferredLanguage('en_US');
	$translateProvider.determinePreferredLanguage();
	$translateProvider.useSanitizeValueStrategy('escaped');	
	$translateProvider.fallbackLanguage('en_US');

	$translateProvider.useStaticFilesLoader({
		prefix: '/languages/',
		suffix: '.json'
	});

	// $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

var kaiwaControllers = angular.module('kaiwaControllers', []);