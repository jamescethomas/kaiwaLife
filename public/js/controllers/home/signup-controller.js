kaiwaControllers.controller('signUpModalController', function($scope, $modalInstance, $http, $location, User, HttpStatus) {
    $modalInstance.opened.then(function() {
        $("#signupServerError").addClass("hide");
        $("#signupEmailInUse").addClass("hide");
        $("#home-view").addClass('blur');
    });

    $scope.months = [
        'Month',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    $scope.days = ['Day'];
    for (i = 1; i <= 31; i++) {
        $scope.days.push(i);
    }

    $scope.years = ['Year'];
    for (i = 2015; i >= 1900; i--) {
        $scope.years.push(i);
    }

    $scope.firstName = '';
    $scope.lastName = '';
    $scope.email = '';
    $scope.emailRetype = '';
    $scope.password = '';

    $scope.month = 'Month';
    $scope.day = 'Day';
    $scope.year = 'Year';

    $scope.birthday;

    $scope.firstNameBlur = function(typing) {
        if ($scope.firstName == '') {
            if (!typing) {
                invalidateFirstNameInput();
            }
        } else {
            var firstNameInput = $("#firstName");
            var firstNameGlyph = firstNameInput.siblings(".glyphicon");

            firstNameInput.removeClass("invalid");
            firstNameGlyph.removeClass("invalid-glyph");

            firstNameInput.addClass("valid");
            firstNameGlyph.addClass("valid-glyph");

            firstNameGlyph.tooltip('hide');
            firstNameGlyph.hover().unbind();
        }
    }

    var invalidateFirstNameInput = function() {
        var firstNameInput = $("#firstName");
        var firstNameGlyph = firstNameInput.siblings(".glyphicon");

        firstNameInput.removeClass("valid");
        firstNameGlyph.removeClass("valid-glyph");

        firstNameInput.addClass("invalid");
        firstNameGlyph.addClass("invalid-glyph");

        firstNameGlyph.tooltip('show');
        firstNameGlyph.hover().unbind();

        firstNameInput.bind('keyup', function() {
            $scope.firstNameBlur(true);
        });

        setTimeout(function() {
            firstNameGlyph.tooltip('hide');
            firstNameGlyph.hover().bind();
            firstNameGlyph.hover(function() {
                firstNameGlyph.tooltip('show');
            }, function() {
                firstNameGlyph.tooltip('hide');
            });
        }, 2000);
    }

    $scope.lastNameBlur = function(typing) {
        if ($scope.lastName == '') {
            if (!typing) {
                invalidateLastNameInput();
            }
        } else {
            var lastNameInput = $("#lastName");
            var lastNameGlyph = lastNameInput.siblings(".glyphicon");

            lastNameInput.removeClass("invalid");
            lastNameGlyph.removeClass("invalid-glyph");

            lastNameInput.addClass("valid");
            lastNameGlyph.addClass("valid-glyph");

            lastNameGlyph.tooltip('hide');
            lastNameGlyph.hover().unbind();
        }
    }

    var invalidateLastNameInput = function() {
        var lastNameInput = $("#lastName");
        var lastNameGlyph = lastNameInput.siblings(".glyphicon");

        lastNameInput.removeClass("valid");
        lastNameGlyph.removeClass("valid-glyph");

        lastNameInput.addClass("invalid");
        lastNameGlyph.addClass("invalid-glyph");

        lastNameGlyph.tooltip('show');
        lastNameGlyph.hover().unbind();

        lastNameInput.bind('keyup', function() {
            $scope.lastNameBlur(true);
        });

        setTimeout(function() {
            lastNameGlyph.tooltip('hide');
            lastNameGlyph.hover().bind();
            lastNameGlyph.hover(function() {
                lastNameGlyph.tooltip('show');
            }, function() {
                lastNameGlyph.tooltip('hide');
            });
        }, 2000);
    }


    $scope.emailBlur = function(typing) {
        if ($scope.email == '') {
            if (!typing) {
                invalidateEmailInput();
            }
            return;
        } else if (!isValidEmail($scope.email)) {
            var emailInput = $("#email");
            var emailGlyph = emailInput.siblings(".glyphicon");

            emailInput.removeClass("valid");
            emailGlyph.removeClass("valid-glyph");

            emailInput.addClass("invalid");
            emailGlyph.addClass("invalid-glyph");

            emailGlyph.tooltip('show');
            emailGlyph.hover().unbind();
        } else if ($scope.email != '' && $scope.emailRetype != '' && $scope.email != $scope.emailRetype) {
            if (!typing) {
                var emailInput = $("#email");
                var emailGlyph = emailInput.siblings(".glyphicon");
                var emailRetypeInput = $("#emailRetype");
                var emailRetypeGlyph = emailRetypeInput.siblings(".glyphicon");

                emailInput.removeClass("valid");
                emailRetypeInput.removeClass("valid");
                emailGlyph.removeClass("valid-glyph");
                emailRetypeGlyph.removeClass("valid-glyph");

                emailInput.addClass("invalid");
                emailRetypeInput.addClass("invalid");
                emailGlyph.addClass("invalid-glyph");
                emailRetypeGlyph.addClass("invalid-glyph");


                emailRetypeGlyph.tooltip('show');
                emailRetypeGlyph.hover().unbind();

                emailInput.bind('keyup', function() {
                    $scope.emailBlur(true);
                });

                setTimeout(function() {
                    emailRetypeGlyph.tooltip('hide');
                    emailRetypeGlyph.hover().bind();
                    emailRetypeGlyph.hover(function() {
                        emailRetypeGlyph.tooltip('show');
                    }, function() {
                        emailRetypeGlyph.tooltip('hide');
                    });
                }, 2000);
            }
        } else if ($scope.email != '' && $scope.emailRetype != '' && $scope.email == $scope.emailRetype) {
            var emailInput = $("#email");
            var emailGlyph = emailInput.siblings(".glyphicon");
            var emailRetypeInput = $("#emailRetype");
            var emailRetypeGlyph = emailRetypeInput.siblings(".glyphicon");

            emailInput.removeClass("invalid");
            emailRetypeInput.removeClass("invalid");
            emailGlyph.removeClass("invalid-glyph");
            emailRetypeGlyph.removeClass("invalid-glyph");

            emailInput.addClass("valid");
            emailRetypeInput.addClass("valid");
            emailGlyph.addClass("valid-glyph");
            emailRetypeGlyph.addClass("valid-glyph");

            emailRetypeGlyph.tooltip('hide');
            emailRetypeGlyph.hover().unbind();

            emailGlyph.tooltip('hide');
            emailGlyph.hover().unbind();
        } else {
            var emailInput = $("#email");
            var emailGlyph = emailInput.siblings(".glyphicon");

            emailInput.removeClass("invalid");
            emailGlyph.removeClass("invalid-glyph");

            emailInput.addClass("valid");
            emailGlyph.addClass("valid-glyph");

            emailGlyph.tooltip('hide');
            emailGlyph.hover().unbind();
        }
    }

    invalidateEmailInput = function() {
        var emailInput = $("#email");
        var emailGlyph = emailInput.siblings(".glyphicon");
        var emailRetypeInput = $("#emailRetype");
        var emailRetypeGlyph = emailRetypeInput.siblings(".glyphicon");

        emailInput.removeClass("valid");
        emailInput.siblings(".glyphicon").removeClass("valid-glyph");

        emailInput.addClass("invalid");
        emailInput.siblings(".glyphicon").addClass("invalid-glyph");

        emailGlyph.tooltip('show');
        emailGlyph.hover().unbind();

        emailInput.bind('keyup', function() {
            $scope.emailBlur(true);
        });

        setTimeout(function() {
            emailGlyph.tooltip('hide');
            emailGlyph.hover().bind();
            emailGlyph.hover(function() {
                emailGlyph.tooltip('show');
            }, function() {
                emailGlyph.tooltip('hide');
            });
        }, 2000);
    }

    $scope.emailRetypeBlur = function(typing) {
        if ($scope.email == '' && $scope.emailRetype == '') {
            var emailInput = $("#email");
            var emailGlyph = emailInput.siblings(".glyphicon");
            var emailRetypeInput = $("#emailRetype");
            var emailRetypeGlyph = emailRetypeInput.siblings(".glyphicon");

            emailInput.removeClass("valid");
            emailRetypeInput.removeClass("valid");
            emailGlyph.removeClass("valid-glyph");
            emailRetypeGlyph.removeClass("valid-glyph");

            emailInput.addClass("invalid");
            emailRetypeInput.addClass("invalid");
            emailGlyph.addClass("invalid-glyph");
            emailRetypeGlyph.addClass("invalid-glyph");

            emailRetypeGlyph.tooltip('hide');
            emailRetypeGlyph.hover().unbind();
            return;
        }

        if ($scope.emailRetype == $scope.email) {
            var emailInput = $("#email");
            var emailGlyph = emailInput.siblings(".glyphicon");
            var emailRetypeInput = $("#emailRetype");
            var emailRetypeGlyph = emailRetypeInput.siblings(".glyphicon");

            emailInput.removeClass("invalid");
            emailRetypeInput.removeClass("invalid");
            emailGlyph.removeClass("invalid-glyph");
            emailRetypeGlyph.removeClass("invalid-glyph");

            emailInput.addClass("valid");
            emailRetypeInput.addClass("valid");
            emailGlyph.addClass("valid-glyph");
            emailRetypeGlyph.addClass("valid-glyph");

            emailRetypeGlyph.tooltip('hide');
            emailRetypeGlyph.hover().unbind();

            emailGlyph.tooltip('hide');
            emailGlyph.hover().unbind();
        } else {
            if (!typing) {
                invalidateEmailRetypeInput()
            }
        }
    }

    var invalidateEmailRetypeInput = function() {
        var emailInput = $("#email");
        var emailGlyph = emailInput.siblings(".glyphicon");
        var emailRetypeInput = $("#emailRetype");
        var emailRetypeGlyph = emailRetypeInput.siblings(".glyphicon");

        emailInput.removeClass("valid");
        emailRetypeInput.removeClass("valid");
        emailGlyph.removeClass("valid-glyph");
        emailRetypeGlyph.removeClass("valid-glyph");

        emailInput.addClass("invalid");
        emailRetypeInput.addClass("invalid");
        emailGlyph.addClass("invalid-glyph");
        emailRetypeGlyph.addClass("invalid-glyph");


        emailRetypeGlyph.tooltip('show');
        emailRetypeGlyph.hover().unbind();

        emailRetypeInput.bind('keyup', function() {
            $scope.emailRetypeBlur(true);
        });

        setTimeout(function() {
            emailRetypeGlyph.tooltip('hide');
            emailRetypeGlyph.hover().bind();
            emailRetypeGlyph.hover(function() {
                emailRetypeGlyph.tooltip('show');
            }, function() {
                emailRetypeGlyph.tooltip('hide');
            });
        }, 2000);
    }

    $scope.passwordBlur = function(typing) {
        if ($scope.password.length >= 6 && $scope.password.length <= 30) {
            validPasswordInput();
        } else {
            if (!typing) {
                invalidatePasswordInput();
            }
        }
    }

    var validPasswordInput = function() {
        var passInput = $("#password");
        var passGlyph = $("#password").siblings(".glyphicon");

        passInput.removeClass("invalid");
        passGlyph.removeClass("invalid-glyph");

        passInput.addClass("valid");
        passGlyph.addClass("valid-glyph");

        passGlyph.tooltip('hide');
        passGlyph.hover().unbind();
    }

    var invalidatePasswordInput = function() {
        var passInput = $("#password");
        var passGlyph = $("#password").siblings(".glyphicon");

        passInput.removeClass("valid");
        passGlyph.removeClass("valid-glyph");

        passInput.addClass("invalid");
        passGlyph.addClass("invalid-glyph");

        passGlyph.tooltip('show');
        passGlyph.hover().unbind();

        $("#password").bind('keyup', function() {
            $scope.passwordBlur(true);
        });

        setTimeout(function() {
            passGlyph.tooltip('hide');
            passGlyph.hover().bind();
            passGlyph.hover(function() {
                passGlyph.tooltip('show');
            }, function() {
                passGlyph.tooltip('hide');
            });
        }, 2000);
    }

    $scope.birthdayHover = function() {
        $("#birthdayQuestion").hover(function() {
            $("#birthdayQuestion").tooltip('show');
        }, function() {
            $("#birthdayQuestion").tooltip('hide');
        });
        $("#birthdayQuestion").tooltip('show');
    }

    var birthdayIsValid = function() {
        var valid = true;
        if ($scope.year == "Year") {
            $("#years").removeClass("valid");
            $("#years").addClass("invalid");
            valid = false;
        } else {
            $("#years").removeClass("invalid");
            $("#years").addClass("valid");
        }

        if ($scope.month == "Month") {
            $("#months").removeClass("valid");
            $("#months").addClass("invalid");
            valid = false;
        } else {
            $("#months").removeClass("invalid");
            $("#months").addClass("valid");
        }

        if ($scope.day == "Day") {
            $("#days").removeClass("valid");
            $("#days").addClass("invalid");
            valid = false;
        } else {
            $("#days").removeClass("invalid");
            $("#days").addClass("valid");
        }

        if (valid == false) {
            return false;
        } else {

        }

        var today = new Date();
        var minAge = 18;
        var birthday = new Date(parseInt($scope.year) + minAge, $scope.months.indexOf($scope.month) - 1, $scope.day);
        $scope.birthday = new Date(parseInt($scope.year), $scope.months.indexOf($scope.month) - 1, $scope.day);

        if (today.getTime() - birthday.getTime() < 0) {
            $("#birthdayQuestion").tooltip('show');
            $("#months").removeClass("valid");
            $("#days").removeClass("valid");
            $("#years").removeClass("valid");

            $("#months").addClass("invalid");
            $("#days").addClass("invalid");
            $("#years").addClass("invalid");
            return false;
        } else {
            $("#birthdayQuestion").tooltip('hide');
            $("#months").removeClass("invalid");
            $("#days").removeClass("invalid");
            $("#years").removeClass("invalid");

            $("#months").addClass("valid");
            $("#days").addClass("valid");
            $("#years").addClass("valid");
            return true
        }
    }

    var isValidEmail = function(email) {
        // unicode
        var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        // non-unicode
        // var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    var isValid = function() {
        var valid = true;
        if ($scope.firstName == '') {
            valid = false;
            invalidateFirstNameInput();
        }

        if ($scope.lastName == '') {
            valid = false;
            invalidateLastNameInput();
        }

        if ($scope.email == '' || !isValidEmail($scope.email)) {
            valid = false;
            invalidateEmailInput();
        } else if ($scope.email != $scope.emailRetype) {
            valid = false;
            invalidateEmailRetypeInput();
        }

        if ($scope.password.length < 6) {
            valid = false;
            invalidatePasswordInput();
        }

        /*
        if (!birthdayIsValid()) {
        	valid = false;
        }
        */

        return valid;
    }

    $scope.signup = function() {
        // http request to signup
        if (isValid()) {
            console.log("VALID");

            var data = {
                "firstName": $scope.firstName,
                "lastName": $scope.lastName,
                "email": $scope.email,
                "password": $scope.password,
                // "birthday": $scope.birthday,
            };

            console.log(data);

            User.createNewUser(data, function(response, status) {
                console.log(response);
                if (status === "success") {
                    console.log("succcess");
                } else {
                    console.log(status);
                    console.log(HttpStatus.CONFLICT);
                    if (status == HttpStatus.CONFLICT) {
                        $("#signupServerError").addClass("hide");
                        $("#signupEmailInUse").removeClass("hide");
                    } else {
                        $("#signupEmailInUse").addClass("hide");
                        $("#signupServerError").removeClass("hide");
                    }
                }
            });

        }
        // $modalInstance.close();
    }

    $scope.fb_signup = function() {
        User.fb_auth(function(response) {
            console.log(response);
        });
    }

    $scope.openLogInModal = function() {
        $modalInstance.close(true);
    }
});
