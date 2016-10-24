// profile service
(function () {
    'use strict';

    angular.module('kaiwaLife').factory('Profile', Profile);
    Profile.$inject = ['$http', '$rootScope', '$cookies', 'User', '_'];

    function Profile($http, $rootScope, $cookies, User, _) {
        var service = {};

        /**
         * Service variables
         */
        service.init = false;
        service.data = {};

        /**
         * Service functions
         */
        service.setData = function (data) {
            _.each (data, function (value, key) {
                service.data[key] = value;
            });

            service.init = true;
        };

        service.get = function (id, callback) {
            // SET ACCESS TOKEN FOR POST (x-access-token is fine too)
            // var data = {
            //     access_token: User.token
            // };
            $http({
                method: 'GET',
                url: '/api/profile/' + id,
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': User.token
                }
            }).
            success(function(data, status, headers, config) {
                service.setData(data);
                callback(data, status, headers, config);
            }).
            error(function(data, status, headers, config) {
                if (data.message === "Token Expired") {
                    User.logout();
                }
                console.log(data);
                console.log("failure");
            });
        };

        /**
         * Map each value of the service to a given scope
         */
        service.mapToScope = function ($scope) {
            _.each(service.data, function (value, key) {
                $scope[key] = value;
            });
        };

        return service;
    }
})();
