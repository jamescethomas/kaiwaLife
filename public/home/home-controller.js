// home_controller.js
kaiwaControllers.controller('homeController', function($scope, $modal, $translate, User) {
	$scope.openLoginModal = function (size) {

		var modalInstance = $modal.open({
			// animation: $scope.animationsEnabled,
			templateUrl: 'home/login-modal.html',
			controller: 'logInModalController',
			size: size,
			windowClass: 'login-signup-modal'
		});

		modalInstance.result.then(function (openSignUp) {
			$("#home-view").removeClass('blur');
			if (openSignUp) {
				$scope.openSignUpModal('sm');
			}
		}, function () { 
			$("#home-view").removeClass('blur');
		});
	};

	$scope.openSignUpModal = function (size) {
		var modalInstance = $modal.open({
			templateUrl: 'home/signup-modal.html',
			controller: 'signUpModalController',
			size: size,
			windowClass: 'login-signup-modal'
		});

		modalInstance.result.then(function (openLogIn) {
			$("#home-view").removeClass('blur');
			if (openLogIn)
			{
				$scope.openLoginModal('sm');
			}
		}, function () { 
			$("#home-view").removeClass('blur');
		});
	};

	$scope.changeLanguage = function(language) {
		User.language = language;
		$translate.use(language);

		if (language == "en_US") {
			$scope.language = "English";
			$scope.selectedIndex = 0;
		} else if (language = "jp") {
			$scope.language = "日本語";
			$scope.selectedIndex = 1;
		}
	};

	var lang = User.language || $translate.proposedLanguage() || $translate.use();
	$translate.use(lang);

	if (lang == "en_US") {
		$scope.language = "English";
		$scope.selectedIndex = 0;
	} else if (lang = "jp") {
		$scope.language = "日本語";
		$scope.selectedIndex = 1;
	}
});
