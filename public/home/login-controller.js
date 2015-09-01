kaiwaControllers.controller('logInModalController',
	function ($scope, $modalInstance, $http, $translate, $location, User, HttpStatus) {
	$modalInstance.opened.then(function() {
		$("#loginInvalidCredentials").addClass("hide");
		$("#loginServerError").addClass("hide");
		$("#home-view").addClass('blur');
	});

	// Set the lanaguage and translate the page
	var lang = User.language || $translate.proposedLanguage() || $translate.use();
	$translate.use(lang);

	// login via facebook
	$scope.fb_login = function() {
		User.fb_auth(loginCallback);
	};

	// Login via user credentials
	$scope.login = function () {
		if (isValid()){
			var data = {
				"email": $scope.email,
				"password": $scope.password
			};
			User.login(data, loginCallback);
		}
	};

	// function to be executed after a login request is made
	var loginCallback = function(status) {
		if (status == HttpStatus.OK) {
			$location.path('/profile');
			$modalInstance.close();
		} else if (status == HttpStatus.INVALID_CREDENTIALS) {
			$("#loginServerError").addClass("hide");
			$("#loginInvalidCredentials").removeClass("hide");
		} else {
			$("#loginInvalidCredentials").addClass("hide");
			$("#loginServerError").removeClass("hide");
		}
	}

	// Check if user input is valid
	var isValid = function() {
		var valid = true;
		if ($("#email").val() == '') {
			valid = false;
			invalidateEmailInput();
		} else {
			validateEmailInput();
		}

		if ($("#password").val() == '') {
			valid = false;
			invalidatePasswordInput();
		} else {
			validatePasswordInput();
		}

		return valid;
	};

	// UI for valid email
	var validateEmailInput = function() {
		var emailInput = $("#email");
		var emailGlyph = $("#email").siblings(".glyphicon");

		emailInput.removeClass("invalid");
		emailGlyph.removeClass("invalid-glyph");

		emailGlyph.tooltip('hide');
		emailGlyph.hover().unbind();
	};

	// UI for invalid email 
	var invalidateEmailInput = function() {
		var emailInput = $("#email");
		var emailGlyph = $("#email").siblings(".glyphicon");

		emailInput.addClass("invalid");
		emailGlyph.addClass("invalid-glyph");

		emailGlyph.tooltip('show');
		emailGlyph.hover().unbind();

		$("#email").bind('keyup',function() {
			if ($("#email").val().length > 0) {
				validateEmailInput();
			}
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
	};

	// UI for valid password
	var validatePasswordInput = function() {
		var passInput = $("#password");
		var passGlyph = $("#password").siblings(".glyphicon");

		passInput.removeClass("invalid");
		passGlyph.removeClass("invalid-glyph");

		passGlyph.tooltip('hide');
		passGlyph.hover().unbind();
	};

	// UI for invalid password
	var invalidatePasswordInput = function() {
		var passInput = $("#password");
		var passGlyph = $("#password").siblings(".glyphicon");

		passInput.addClass("invalid");
		passGlyph.addClass("invalid-glyph");

		passGlyph.tooltip('show');
		passGlyph.hover().unbind();

		$("#password").bind('keyup',function() {
			if ($("#password").val().length > 0) {
				validatePasswordInput()
			}
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
	};

	// Close the login modal so the singup modal can open
	$scope.openSignUpModal = function() {
		$modalInstance.close(true);	
	};
});
