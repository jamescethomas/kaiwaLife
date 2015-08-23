'use strict';

/* App Module */

var kaiwaLife = angular.module('kaiwaLife', [
  'ngRoute',
  'ngAnimate',
  // 'eiwaAnimations',

  'eiwaControllers',
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
			when('/test', {
				templateUrl: 'partials/partial-test.html',
				controller: 'TestCtrl'
			}).
			when('/anotherTest', {
				templateUrl: 'partials/main-veiw.html',
				controller: 'mainViewController'
			}).
			when('/home', {
				templateUrl: 'partials/home.html',
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

var eiwaControllers = angular.module('eiwaControllers', []);