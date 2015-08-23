'use strict';

/* Controllers */

eiwaControllers.controller('TestCtrl', ['$scope', 
  function($scope) {
    $scope.test = "VALUE OF TEST";
    $scope.dataSet = [];
    $scope.add = function() {
    	$scope.dataSet.push($scope.data);
    	$("#test").val('');
    }
  }]);

eiwaControllers.controller('mainViewController', ['$scope',
  function($scope) {
    $scope.testTwo = "another test value";
  }]);