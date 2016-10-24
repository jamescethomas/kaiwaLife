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
        when('/profile/edit', {
            templateUrl: 'templates/profile/editProfile.html',
            controller: 'editProfileController',
            name: 'editProfile'
        }).
        when('/profile/:id', {
            templateUrl: 'templates/profile/profile.html',
            controller: 'profileController',
            name: 'profile'
        }).
        when('/home', {
            templateUrl: 'templates/home/home.html',
            controller: 'homeController',
            name: 'home'
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

        // $resourceProvider.defaults.stripTrailingSlashes = false;
    }
]);
