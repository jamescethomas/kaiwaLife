// home_controller.js
kaiwaControllers.controller('homeController', function ($scope, $rootScope, $modal, $translate, User, _) {
    /**
     * Initialize the home controller
     */
    $scope.init = function () {
        $scope.auth = User.auth;
        $scope.name = "home";
    };

    var openLoginModal = $rootScope.$on('openLoginModal', function () {
        var modalInstance = $modal.open({
            // animation: $scope.animationsEnabled,
            templateUrl: 'templates/home/login-modal.html',
            controller: 'logInModalController',
            size: 'sm',
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
    });

    var openSignUpModal = $rootScope.$on('openSignUpModal', function () {
        var modalInstance = $modal.open({
            templateUrl: 'templates/home/signup-modal.html',
            controller: 'signUpModalController',
            size: 'sm',
            windowClass: 'login-signup-modal'
        });

        modalInstance.result.then(function (openLogIn) {
            $("#home-view").removeClass('blur');
            if (openLogIn) {
                $scope.openLoginModal('sm');
            }
        }, function () {
            $("#home-view").removeClass('blur');
        });
    });

    $scope.init();
    $scope.$on('$destroy', openLoginModal);
    $scope.$on('$destroy', openSignUpModal);
});
