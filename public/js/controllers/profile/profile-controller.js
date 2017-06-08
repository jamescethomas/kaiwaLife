// profile-controller.js
'use strict';

kaiwaControllers.controller('profileController',
    function($scope, $rootScope, $translate,  $http, $location, $routeParams, User, Profile, HttpStatus) {
        $scope.init = function() {
            $scope.name = "profile";
            $scope.userProfileId = $routeParams.id;
            setLoadingState(true);
            $scope.loadingPicture = true;

            if (!User.auth) {
                $location.path('/home');
            } else {
                console.log(User);
                console.log($routeParams);
                $scope.userProfile = ($routeParams.id == User.userid);

                $http.get('/api/profile/image/' + $routeParams.id, {
                    headers: {
                        'x-access-token': User.token
                    }
                }).
                success(function(data, status, headesr, config) {
                    $scope.imageSource = '/static/' + data.filepath + "?" + Math.random();
                    $scope.loadingPicture = false;
                });

                Profile.get($routeParams.id, function () {
                    Profile.mapToScope($scope);

                    $scope.userName = $scope.firstName + " " + $scope.lastName;

                    translateLearningLanguage();
                    translateNativeLanguage();

                    // Set up the time zone display
                    setUpTimezone();

                    // Set the profile page loading state to false
                    setLoadingState(false);
                });
            }
        };

        $scope.toggleLoading = function () {
            $scope.loading = !$scope.loading;
        }

        $scope.addFriend = function () {
            console.log("here");
            console.log($scope.userProfileId);
            // Call backend to add a new entry for this friend
        }

        var onLanguageChange = $rootScope.$on('languageChange', function () {
            translateLearningLanguage();
            translateNativeLanguage();
        });

        var translateLearningLanguage = function () {
            if ($scope.learning === "Japanese") {
                $scope.learningDisplay = $translate.instant('JAPANESE');
            } else {
                $scope.learningDisplay = $translate.instant('ENGLISH');
            }
        };

        var translateNativeLanguage = function () {
            if ($scope.native === "Japanese") {
                $scope.nativeDisplay = $translate.instant('JAPANESE');
            } else {
                $scope.nativeDisplay = $translate.instant('ENGLISH');
            }
        };

        /**
         * Show or hide the loading state for the profile page
         *
         * @param {boolean} loading
         */
        var setLoadingState = function (loading) {
            if (loading) {
                console.log("HERE?");
                // TODO Show loading state
                $scope.loading = true;
            } else {
                // TODO Hide loading state
                $scope.loading = false;
            }
        };

        var setUpTimezone = function () {
            var operator,
                difference,
                clientTimezone,
                today = new Date(),
                meanTime = new Date();

            if ($scope.timezone) {
                // Figure out what time zone I'm in
                clientTimezone = (today.getTimezoneOffset()) / 60;
                meanTime.setHours(meanTime.getHours() + clientTimezone);

                difference = parseInt($scope.timezone.substring(5,7));
                operator = $scope.timezone.substring(4,5);

                if (operator === '-') {
                    meanTime.setHours(meanTime.getHours() - difference);
                } else {
                    meanTime.setHours(meanTime.getHours() + difference);
                }

                console.log(meanTime);
                $scope.time = meanTime;
            }
        };

        $scope.init();
    });
