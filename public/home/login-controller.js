kaiwaControllers.controller('logInModalController', function ($scope, $modalInstance, $http, $translate, User) {
	$modalInstance.opened.then(function() {
		$("#home-view").addClass('blur');
	});

	var lang = User.language || $translate.proposedLanguage() || $translate.use();
	$translate.use(lang);

	$scope.fb_login = function() {
		User.fb_signup(function(response) {
			if (response.token) {
				console.log(response);
				console.log(User);
				// TODO: redirect to profile
			} else {
				// TODO: error message
			}
		});
	}

	$scope.login = function () {
		// http request to login
		if (isValid()){
			// http login

			var data = {
				"email": $scope.email,
				"password": $scope.password
			};

			console.log(data);

			$http({
				method: 'POST',
				url: '/login',
				data: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).
			success(function(data, status, headers, config) {
				console.log("SUCCESS");
				console.log(data);
			}).
			error(function(data, status, headers, config) {
				console.log("ERROR");
				console.log(data);
			});
		}
		// $modalInstance.close();
	}

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
	}

	var validateEmailInput = function() {
		var emailInput = $("#email");
		var emailGlyph = $("#email").siblings(".glyphicon");

		emailInput.removeClass("invalid");
		emailGlyph.removeClass("invalid-glyph");

		emailGlyph.tooltip('hide');
		emailGlyph.hover().unbind();
	}

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
	}

	var validatePasswordInput = function() {
		var passInput = $("#password");
		var passGlyph = $("#password").siblings(".glyphicon");

		passInput.removeClass("invalid");
		passGlyph.removeClass("invalid-glyph");

		passGlyph.tooltip('hide');
		passGlyph.hover().unbind();
	}

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
	}

	$scope.openSignUpModal = function() {
		$modalInstance.close(true);	
	}

});
