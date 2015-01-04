angular.module('starter.controllers')
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $cordovaToast, $state, $location, AuthenticationService, UtilityService, PersistenceJS) {
  $scope.loginData = {};
  $scope.loggedIn = false;
  $scope.current_user = null;

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $http.post(SERVER_URL+"/session", {email: $scope.loginData.email, password: $scope.loginData.password})
    .success(function(data){
      $http.defaults.headers.common.Authorization = "Token token="+data["access_token"];
      $scope.loggedIn = true;
      $scope.accessToken = data["access_token"];
      console.log("logged in. access token: "+$scope.accessToken);
      UtilityService.showToast("Successfully logged in.", 'long', 'bottom');
      $scope.afterLoginCallback();
    })
    .error(function(data, status, headers, config) {
      $scope.loggedIn = false;
      if(status == 401) {
        UtilityService.showToast("Incorrect credentials.", 'long', 'bottom');
      }
    });
  };

  $scope.logout = function() {
    $http.delete(SERVER_URL+"/session")
    .success(function(data) {
      console.log("Successfully logged out");
      UtilityService.showToast("Successfully logged out.", 'long', 'bottom');
      $location.path('/login');
    })
    .error(function(data){
        console.log("The toast was not shown due to " + data);
        UtilityService.showToast("UnSuccessfully logged out.", 'long', 'bottom');
        $location.path('/login');
    });
  };

  $scope.fetchLoginStatus = function(){
		// $scope.accessToken = localforage.getItem('accessToken');
		// $scope.loggedIn = localforage.getItem('loggedIn');
  	$scope.loggedIn = false;
  }

  $scope.afterLoginCallback = function(){
    $location.path('/app/home');
  }

  $scope.initialize = function(){
  	$scope.fetchLoginStatus();
    console.log('Initializing: Login status', $scope.loggedIn);
    if($scope.loggedIn == true){
      $scope.afterLoginCallback();
    } else {
    	$location.path('/login');
    }
  }

  $scope.initialize();
})
