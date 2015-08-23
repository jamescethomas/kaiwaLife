'use strict';

/* App Module */

var kaiwaLife = angular.module('kaiwaLife', [
  'ngRoute',
  'ngAnimate',
  // 'eiwaAnimations',

  'kaiwaControllers',
  //,
  // 'eiwaFilters'
  // ,
  // 'eiwaServices'
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


kaiwaLife.config(['$routeProvider', '$translateProvider',
	function($routeProvider, $translateProvider) {
		$routeProvider.
			when('/profile', {
				templateUrl: 'partials/profile.html',
				controller: 'profileController'
			}).
			when('/home', {
				templateUrl: 'home/home.html',
				controller: 'homeController'
			}).
			otherwise({
				redirectTo: '/home'
			});

		$translateProvider.preferredLanguage('en_US');
		$translateProvider.determinePreferredLanguage();
		$translateProvider.useSanitizeValueStrategy('escaped');	
		$translateProvider.fallbackLanguage('en_US');

		$translateProvider.useStaticFilesLoader({
			prefix: '/languages/',
			suffix: '.json'
		});
}]);

var kaiwaControllers = angular.module('kaiwaControllers', []);