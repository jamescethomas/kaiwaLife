// edit-profile-controller.js
'use strict';

kaiwaControllers.controller('editProfileController',
    function($scope, $rootScope, $translate, $http, $location, $routeParams, User, Profile, HttpStatus, _) {
        $scope.init = function() {
            $scope.name = "profile";

            if (!User.auth) {
                $location.path('/home');
            } else {
                $http.get('/api/profile/image/' + User.userid, {
                    headers: {
                        'x-access-token': User.token
                    }
                }).
                success(function(data, status, headesr, config) {
                    $scope.imageSource = '/static/' + data.filepath + "?" + Math.random();
                });

                Profile.get(User.userid, function () {
                    Profile.mapToScope($scope);

                    $scope.gender = $scope.gender || $translate.instant('CHOOSE');

                    // Update the languages dropdown selectors
                    translateLearningLanguage();
                    translateNativeLanguage();

                    // Setup the date selector values for birthday selector
                    setupDateValues();

                    // Get the timezone data from timezones.json and store in in this scope
                    $scope.timezones = [];

                    $http.get('json/timezones.json')
                        .success(function (timezones) {
                            _.each(timezones, function (timezone) {
                                $scope.timezones.push(timezone.text);
                            });
                        });

                    $scope.timezone = $scope.timezone || $translate.instant('CHOOSE');
                });
            }
        };

        var dropbox = document.getElementById("profile-picture")
        $scope.dropText = 'Drop files here'

        // init event handlers
        function dragEnterLeave(evt) {
            evt.stopPropagation()
            evt.preventDefault()
            $scope.$apply(function(){
                $scope.dropText = 'Drop files here'
                $scope.dropClass = ''
            })
        };
        dropbox.addEventListener("dragenter", dragEnterLeave, false);
        dropbox.addEventListener("dragleave", dragEnterLeave, false);
        dropbox.addEventListener("dragover", function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0;
            ok = ok &&
                (evt.dataTransfer.items[0].type == "image/jpeg" ||
                evt.dataTransfer.items[0].type == "image/gif" ||
                evt.dataTransfer.items[0].type == "image/tiff" ||
                evt.dataTransfer.items[0].type == "image/png");
            $scope.$apply(function(){
                $scope.dropText = ok ? 'Drop files here' : 'Only images are allowed'
                $scope.dropClass = ok ? 'over' : 'not-available'
            });
        }, false);
        dropbox.addEventListener("drop", function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $scope.$apply(function(){
                $scope.dropText = 'Drop files here';
                $scope.dropClass = '';
            });
            var files = evt.dataTransfer.files;
            if (files.length > 0) {
                if (files[0].type == "image/jpeg" ||
                    files[0].type == "image/gif" ||
                    files[0].type == "image/tiff" ||
                    files[0].type == "image/png") {
                    if (files[0].size > (1048576 * 5)) {
                        $scope.$apply(function() {
                            $scope.dropText = "File too large, 5MB limit";
                            $scope.dropClass = "not-available";
                        });
                    } else {
                        $scope.$apply(function(){
                            $scope.files = [];
                            for (var i = 0; i < files.length; i++) {
                                $scope.files.push(files[i]);
                            }
                            if ($scope.files.length > 1) {
                                $scope.files = [$scope.files[0]];
                            }
                            $scope.uploadProfileImage();
                        });
                    }
                } else {
                    $scope.$apply(function() {
                        $scope.dropText = "Only images are allowed";
                        $scope.dropClass = "not-available";
                    });
                }
            }
        }, false);

        $scope.uploadProfileImage = function () {
            var fd = new FormData();
            //Take the first selected file
            fd.append("file", $scope.files[0]);

            $scope.dropClass = 'slide-animation';

            $http.post('/api/profile/uploadProfilePicture', fd, {
                headers: {
                    'Content-Type': undefined,
                    'x-access-token': User.token
                }
            }).
            success(function(data, status, headers, config) {
                console.log("success");
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.imageSource = '/static/' + data.filepath + '?' + Math.random();
                    });
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.dropClass = 'slide-animation1';
                        });
                    }, 100);
                }, 1000);
            }).
            error(function(data, status, headers, config) {
                console.log("error");

                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.dropText = "Error uploading image";
                        $scope.dropClass = 'slide-animation1 not-available'
                    });
                }, 1000);
            });
        };

        /**
         * Save the user's profile data
         */
        $scope.save = function (callback) {
            var data = {
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                country: $scope.country,
                state: $scope.state,
                city: $scope.city,
                learning: $scope.learning,
                native: $scope.native,
                bio: $scope.bio
            };

            // Validate timezone
            if ($scope.timezoneIsSet) {
                data.timezone = $scope.timezone;
            }

            // Validate birthday
            if ($scope.birthdayYearIsSet && $scope.birthdayMonthIsSet && $scope.birthdayDayIsSet) {
                data.birthday = new Date($scope.birthdayYear + '-' + $scope.birthdayMonth + '-' + $scope.birthdayDay);
            } else {
                // TODO show validation message
            }

            // Validate gender
            if ($scope.genderIsSet) {
                data.gender = $scope.gender;
            }

            $http({
                method: 'POST',
                url: '/api/profile/update',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': User.token
                }
            }).
            success(function(responseData, status, headers, config) {
                Profile.setData(data);
                User.firstName = data.firstName;
                User.lastName = data.lastName;
                User.saveUserDataCookie();

                $location.path('/profile/' + User.userid);

                if (callback) {
                    callback();
                }
            }).
            error(function(data, status, headers, config) {
                if (data.message === "Token Expired") {
                    User.logout();
                }
            });

        };

        /**
         * Select timezone
         */
        $scope.selectTimezone = function (timezone) {
            $scope.timezoneIsSet = true;
            $scope.timezone = timezone;
        };

        /**
         * Select gender
         */
        $scope.selectGender = function (gender) {
            $scope.genderIsSet = true;
            $scope.gender = gender;
        };

        /**
         * Return the the user profile
         */
        $scope.viewProfile = function () {
            $scope.save(function () {
                $location.path('/profile/' + User.userid);
            });
        };

        /**
         * Cancel editing profile
         */
        $scope.cancel = function () {
            $http({
                method: 'POST',
                url: '/api/profile/cancel',
                headers: {
                    'x-access-token': User.token
                }
            }).
            success(function(data, status, headesr, config) {
                $location.path('/profile/' + User.userid);
            });
        };

        /**
         * Update the language that the user is learning
         *
         * @param {string} language
         */
        $scope.updateLearningLanguage = function (language) {
            $scope.learning = language;
            translateLearningLanguage();
        };

        /**
         * Update the user's native language
         *
         * @param {string} language
         */
        $scope.updateNativeLanguage = function (language) {
            $scope.native = language;
            translateNativeLanguage();
        };

        /**
         * Triggered when the translation language changes
         */
        var onLanguageChange = $rootScope.$on('languageChange', function () {
            translateLearningLanguage();
            translateNativeLanguage();
        });

        /**
         * Setup the date values for the birthday date selector
         */
        var setupDateValues = function () {
            var currentYear = new Date().getFullYear(),
                i,
                birthday;

            $scope.years = [],
            $scope.months = [],
            $scope.days = [];

            if ($scope.birthday) {
                birthday = new Date($scope.birthday);
            }

            // Set up years array
            for (i = currentYear; i >= currentYear - 100; i--) {
                $scope.years.push(i);
            }

            if (!$scope.birthdayYear) {
                $scope.birthdayYear = (birthday) ? birthday.getFullYear() : $translate.instant('YEAR');
            }

            // Set up months array
            for (i = 1; i <= 12; i++) {
                $scope.months.push(i);
            }

            if (!$scope.birthdayMonth) {
                $scope.birthdayMonth = (birthday) ? birthday.getMonth() + 1: $translate.instant('MONTH');
            }

            // Set up days array
            for (i = 1; i <= 31; i++) {
                $scope.days.push(i);
            }

            if (!$scope.birthdayDay) {
                $scope.birthdayDay = (birthday) ? birthday.getDate() : $translate.instant('DAY');
            }
        };

        /**
         * Select birthday year
         * updating the number of days and selected day accrodingly
         */
        $scope.selectYear = function (year) {
            $scope.birthdayYearIsSet = true;
            $scope.birthdayYear = year;

            updateNumberDays();
        };

        /**
         * Select birthday month
         * updating the number of days and selected day accrodingly
         */
        $scope.selectMonth = function (month) {
            $scope.birthdayMonthIsSet = true;
            $scope.birthdayMonth = month;

            updateNumberDays();
        };

        $scope.selectDay = function (day) {
            $scope.birthdayDayIsSet = true;
            $scope.birthdayDay = day;
        };

        var updateNumberDays = function () {
            var year = $scope.birthdayYear,
                month = $scope.birthdayMonth,
                days = [],
                endDay = 31;

            if (year % 4 === 0) {
                if (month === 2) {
                    endDay = 29;
                }
            } else if (month === 2) {
                endDay = 28;
            } else if (_.indexOf([4, 6, 9, 11], month) !== -1) {
                endDay = 30;
            }

            for (var i = 1; i <= endDay; i++) {
                days.push(i);
            }

            $scope.days = days;

            if ($scope.birthdayDay > endDay) {
                $scope.birthdayDay = endDay;
            }
        };

        /**
         * Set the translated display valye for the learning dropdown
         */
        var translateLearningLanguage = function () {
            if ($scope.learning === "Japanese") {
                $scope.learningDisplay = $translate.instant('JAPANESE');
            } else {
                $scope.learningDisplay = $translate.instant('ENGLISH');
            }
        };

        /**
         * Set the translated display valye for the native dropdown
         */
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
                // TODO Show loading state
            } else {
                // TODO Hide loading state
            }
        };

        $scope.init();
    });
