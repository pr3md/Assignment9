angular.module('starter.controllers', [])



.controller("LoginCtrl", function($scope, $state, UserService, $ionicLoading, $q, $firebaseAuth) {
 
    var fb = new Firebase("https://lab9.firebaseio.com/");
    var fbAuth = $firebaseAuth(fb);
    
    $scope.login = function(username, password) {
        console.log(username+","+password);
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            UserService.setUser({
                name: username,
                type: 'firebase'
            });
            $scope.firebaseLogin = true;
            $state.go("tab.dash");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    $scope.register = function(username, password) {
        fbAuth.$createUser({email: username, password: password}).then(function(userData) {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            UserService.setUser({
                name: username,
                type: 'firebase'
            });
            $scope.firebaseLogin = true;
            $state.go("tab.dash");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }
    
    // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
                location: profileInfo.location,
                education: profileInfo.education,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=small",
                type: 'facebook'
      });
      $ionicLoading.hide();
      $state.go('tab.dash');
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name,location,education&access_token=' + authResponse.accessToken, null,
      function (response) {
				console.log(response);
        info.resolve(response);
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);

    		// Check if we have our user saved
    		var user = UserService.getUser('facebook');

    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.first_name,
							email: profileInfo.email,
                            location: profileInfo.location,
                            education: profileInfo.education,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=small",
                            type: 'facebook'
						});

						$state.go('tab.dash');
					}, function(fail){
						// Fail get profile info
						console.log('profile info fail', fail);
					});
				}else{
					$state.go('app.home');
				}
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.

				console.log('getLoginStatus', success.status);

				$ionicLoading.show({
          template: 'Logging in...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
})

.controller('DashCtrl', function($scope, $http, UserService) {
    $scope.user = UserService.getUser();
    $scope.displayName = $scope.user.name;
    $scope.displayPicture = $scope.user.picture;
    $scope.currentCity = $scope.user.location;
    $scope.currentCity = "Kansas City, Missouri";
    if($scope.type=='firebase') {
        $scope.firebaseLogin = true;
    }
    
    $scope.calcSimpleInterest = function(principle, term, rate) {
    var reqUrl = "http://192.168.0.11:8080/PallaviAssignment6/labassignment/calculate/si/"+principle+"/"+term+"/"+rate
    $http({
        method: 'GET',
        url: reqUrl
    })
    .success(function(response){
        console.log(response.SimpleInterest);
        $scope.calcStatus = true;
        $scope.message = "Simple Interest is "+response.SimpleInterest;
        return response.SimpleInterest;
    })
    }
    
    $scope.testSI = function(p,t,r) {
        var amt = p*t*r;
        var amt = amt/100;
        return amt;
    }
    
})

.controller('ChatsCtrl', function($scope, $http, UserService) {
        $scope.user = UserService.getUser();
    $scope.displayName = $scope.user.name;
    $scope.displayPicture = $scope.user.picture;
    $scope.currentCity = $scope.user.location;
    $scope.currentCity = "Kansas City, Missouri";
    if($scope.type=='firebase') {
        $scope.firebaseLogin = true;
    }
    $scope.convertFahrenheit = function(kelvin) {
        var reqUrl = "http://192.168.0.11:8080/PallaviAssignment6/labassignment/metrics/kelvintoF/"+kelvin;
        $http({
            method: 'GET',
            url: reqUrl
        })
        .success(function(response) {
            console.log(response.Fahrenheit);
            $scope.convertStatus = true;
            $scope.message = kelvin + "K to Fahrenheit is " + response.Fahrenheit;
        })
    }
    
    $scope.testKtoF = function(k) {
        var k = (k - 273.15) * 1.8 + 32.0;
        k = Math.round(k);
        return k;
    }
    
    $scope.convertCelcius = function(kelvin) {
     var reqUrl = "http://192.168.0.11:8080/PallaviAssignment6/labassignment/metrics/kelvintoC/"+kelvin;
        $http({
            method: 'GET',
            url: reqUrl
        })
        .success(function(response) {
            console.log(response.Celcius);
            $scope.convertStatus = true;
            $scope.message = kelvin + "K to Celcius is " + response.Celcius;
        })
    }
    
    $scope.testKtoC = function(kelvin) {
        var c = kelvin - 273.15;
        return c;
    }
})


.controller('AccountCtrl', function($scope, $http, UserService) {
        $scope.user = UserService.getUser();
    $scope.displayName = $scope.user.name;
    $scope.displayPicture = $scope.user.picture;
    $scope.currentCity = $scope.user.location;
    $scope.currentCity = "Kansas City, Missouri";
    if($scope.type=='firebase') {
        $scope.firebaseLogin = true;
    }
  $scope.calcCompoundInterest = function(principle, term, cnum, rate) {
      var reqUrl = "http://192.168.0.11:8080/PallaviAssignment6/labassignment/calculate/ci/"+principle+"/"+rate+"/"+cnum+"/"+term;
      $http({
          method: 'GET',
          url: reqUrl
      }).success(function(response){
          console.log(response.CompoundInterest);
          $scope.calcStatus = true;
          $scope.message = "Compound Interest is "+response.CompoundInterest
          return response.CompoundInterest;
      })
  }
  
  $scope.testCI = function(p,r,t,n) {
      var ci = p * (1+r/n);
      var temp = n*t;
      var ci = Math.pow(ci, temp);
      return ci;
  }
});
