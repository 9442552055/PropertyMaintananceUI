authModule.authModalController = ["$scope", "authService",
  function ($scope, authService) {

      $scope.closeButton = function () {
          authService.cancelAuthDialog();
      };

  }];