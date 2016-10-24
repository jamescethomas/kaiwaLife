// profile-controller.js
'use strict';

kaiwaControllers.controller('navController',
    function ($scope, $route, $routeParams, $rootScope, $location, $translate, User) {
        $scope.$route = $route;

        /**
         * Initialize the controller
         */
        $scope.init = function () {
            var lang = User.language || $translate.proposedLanguage() || $translate.use();

            $scope.auth = User.auth;
            $scope.name = "nav";

            $translate.use(lang);

            if (lang == "en_US") {
                $scope.language = "English";
                $scope.selectedIndex = 0;
            } else if (lang = "jp") {
                $scope.language = "日本語";
                $scope.selectedIndex = 1;
            }
        };

        /**
         * Triggered when the language is changed via the language change dropdown
         *
         * @param {string} language
         */
        $scope.changeLanguage = function(language) {
            User.language = language;
            User.saveUserDataCookie();
            $translate.use(language).then(function () {
                $rootScope.$emit('languageChange');
            })

            if (language == "en_US") {
                $scope.language = "English";
                $scope.selectedIndex = 0;
            } else if (language = "jp") {
                $scope.language = "日本語";
                $scope.selectedIndex = 1;
            }
        };

        /**
         * When the login modal link is clicked
         * Tell the home controller to open the login modal
         */
        $scope.openLoginModal = function () {
            $rootScope.$emit('openLoginModal');
        };

        /**
         * When the sign up modal link is clicked
         * Tell the home controller to open the sign up modal
         */
        $scope.openSignUpModal = function () {
            $rootScope.$emit('openSignUpModal');
        };

        /**
         * Call the user service to logout the user
         */
        $scope.logout = function () {
            User.logout(afterLogout);
        };

        /**
         * Called after login
         */
        var afterLogout = function () {
            $scope.auth = false;
            $location.path('/home');
        };

        $scope.profile = function () {
            $location.path('/profile/' + User.userid);
        };

        /**
         * Triggered when user data changes
         */
        var onUserDataChange = $rootScope.$on('userDataChange', function () {
            $scope.auth = User.auth;
        });

        /**
         * Triggered when the route changes
         */
        var onRouteChange = $rootScope.$on("$routeChangeSuccess", function(event, next) {
            $scope.currentRouteName = next.$$route.name;
        });

        $scope.init();
        $scope.$on('$destroy', onUserDataChange);
    });
