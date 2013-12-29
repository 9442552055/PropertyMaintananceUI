authModule.passwordRegistrationController = ["$scope", "$rootScope", "$state", '$translate', "authService", "$location",
  function ($scope, $rootScope, $state, $translate, authService, registerPasswordService, $location) {
      $scope.message = null;
      $scope.authError = null;
      $scope.user = {};
      $scope.clearForm = function () {
          $scope.user = {};
      };

      $scope.cancelRegister = function () {
      };

      $scope.registerPassword = function () {
          //registerPasswordService($scope.user.password, $scope.user.confirmPassword, $scope.user.hasAcceptedDisclaimer).then(function (response) {
              //$log.log("loggedIn: " + loggedIn);
              //if (response) {
                  //$rootScope.currentUserId = response.UserId;
                  //$rootScope.currentUserEmail = response.Email;
                  //$rootScope.isAuthenticated = true;
                  //sessionStore.session.add("email", response.Email);
                  //sessionStore.session.add("isAuthenticated", true);

                  //$scope.message = "The registration is finished!";
                  //$location.path('/');
                  //$state.transitionTo('dashboard');
                  //$scope.$apply();
                 
              //}
          //}, function (x) {
              //$scope.authError = "The registration did not succeed";
          //});
      };

  }];