angular.module('starter.services', ['http-auth-interceptor'])
.factory('AuthenticationService', function($rootScope, $http, authService) {
  var service = {
    login: function(user) {
      $http.post(LOGIN_URL, { user: user }, { ignoreAuthModule: true })
      .success(function (data, status, headers, config) {
      	$http.defaults.headers.common.Authorization = "Token token="+data.authorizationToken;  // Step 1
        
       	// Need to inform the http-auth-interceptor that
        // the user has logged in successfully.  To do this, we pass in a function that
        // will configure the request headers with the authorization token so
        // previously failed requests(aka with status == 401) will be resent with the
        // authorization token placed in the header
        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          config.headers.Authorization = "Token token="+data.authorizationToken;
          return config;
        });
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('event:auth-login-failed', status);
      });
    },
    logout: function(user) {
      $http.post(LOGOUT_URL, {}, { ignoreAuthModule: true })
      .finally(function(data) {
        delete $http.defaults.headers.common.Authorization;
        $rootScope.$broadcast('event:auth-logout-complete');
      });			
    },	
    loginCancelled: function() {
      authService.loginCancelled();
    }
  };
  return service;
})
.service('UtilityService', function($rootScope, $http, $cordovaToast){
  this.showToast = function(message, duration, location){
    if(ENV === "development") return true;
    $cordovaToast.show(message, duration, location).then(function(success) {
        console.log("The toast was shown");
    }, function (error) {
        console.log("The toast was not shown due to " + error);
    });
  }
})
.service('PersistenceJS', function() {
  persistence.store.websql.config(persistence, 'myDb', 'our database', 5*1024*1024*5);
  var User = persistence.define('User', {
    id: 'INT',
    name: 'TEXT',
    email: 'BOOL'
  });
  var Group = persistence.define('Group', {
    id: 'INT',
    name: 'TEXT',
    group_type: 'INT',
    admin: 'INT'
  });
  var GroupMembership = persistence.define('GroupMembership', {
    id: 'INT',
    group_id: 'INT',
    user_id: 'INT'
  });
  console.log('Schema syncing...', "...");
  persistence.schemaSync();
  return {
    //singleton containing all methods to be called
  };
});

