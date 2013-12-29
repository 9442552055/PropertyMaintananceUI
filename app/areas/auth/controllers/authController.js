authModule.authController = ["$scope", "authService", "$timeout", "authType",   "common", "$log",
  function ($scope, authService, $timeout, authType,  common, $log) {

      //toastr logging variables
      var getLogFn = common.logger.getLogFn;
      var log = getLogFn("authController");
      var logSuccess = getLogFn("authController", "success");
      var logWarning = getLogFn("authController", "warning");
      var logError = getLogFn("authController", "error");

      // for modal close in esc
      $(document).keydown(function (e) {
          // ESCAPE key pressed
          if (e.keyCode == 27) {
              var authResult = { authType: authType, success: true };
              authService.cancelAuthDialog(authType);
          }
      });

      $scope.user = {};

      $scope.activeStates = {

      }

      //switchers
      $scope.goToLogin = function () {
          $scope.activeStates.loginActive = true;
          $scope.activeStates.registerActive = false;
          $scope.activeStates.passwordActive = false;
      };

      $scope.goToRegister = function () {
          $scope.activeStates.loginActive = false;
          $scope.activeStates.registerActive = true;
          $scope.activeStates.passwordActive = false;
      };

      $scope.goToPassword = function () {
          $scope.activeStates.loginActive = false;
          $scope.activeStates.registerActive = false;
          $scope.activeStates.passwordActive = true;
      };


      //hack because the static tabs are not set to active correctly when executing directly
      $timeout(function () {
          if (authType == authService.getLoginType()) {
              $scope.goToLogin();
          } else if (authType == authService.getRegisterType()) {
              $scope.goToRegister();
          } else if (authType == authService.getPasswordType()) {
              $scope.goToPassword();
          }
      }, 0)
      //----------- register ------------------
      $scope.registerUser = {};
      $scope.registerError = null;
      $scope.register = function () {

          $scope.showErrors = true;
          var registerModel = angular.copy($scope.registerUser);
          registerModel.isRegisterPassword = false;
          authService.register(registerModel).then(function (response) {
              if (response) {
                  logSuccess($translate('RegistrationSucceeded'));
                  $scope.message = "The registration is finished!";
              }
          }, function (x) {
              $scope.loadingBar = false;
              $scope.registerError = $translate(x.replace(/["']/g, ""));
          });
      };

      $scope.cancelRegister = function () {
          authService.cancelRegister();
      };

      $scope.clearRegister = function () {
          $scope.registerUser = {};
      };


      //----------- password ------------------
      $scope.passwordUser = {};
      $scope.passwordError = null;
      $scope.resetPassword = function () {

          $scope.loadingBar = true;

          authService.resetPassword($scope.passwordUser.email).then(function (x) {
              logSuccess($translate('PASSWORDRESETSUCCESS'));
          }, function (x) {
              $scope.loadingBar = false;
              $scope.passwordError = $translate(x.replace(/["']/g, "")); //this line takes the error message as a function for the translate directive. This means we should make sure we have translations for the error code provided by the server.
          });

      };

      $scope.clearPassword = function () {
          $scope.passwordUser = {};
      };

      $scope.cancelPassword = function () {
          authService.cancelPassword();
      };


  }];


//This required for the top toolbar which shouldn't inject authType
authModule.loginController = ["$scope", "authService", "$timeout", '$rootScope', 'authRetryQueue', 
function ($scope, authService, $timeout, $rootScope, authRetryQueue) {

    $scope.user = {};

    //----------- login ------------------
    $scope.loginUser = {};
    $scope.loginError = null;
    $scope.loginReason = null;
    if (angular.isFunction(authService.getLoginReason) && authService.getLoginReason()) {
        $scope.loginReason = ($rootScope.currentUser && $rootScope.currentUser.FirstName) ?
          "You are not logged in yet. Please log in to execute this action." :
          "You are not authorized to execute this action. Please log in with authorized credentials.";
    }

    $scope.login = function (requestFrom) {
        $scope.loadingBar = true;
        $scope.authError = null;

        // fix for autocomplete
        if (document.getElementById('username').value) { $scope.loginUser.username = document.getElementById('username').value; }
        if (document.getElementById('password').value) { $scope.loginUser.password = document.getElementById('password').value; }

        authService.login($scope.loginUser.username, $scope.loginUser.password).then(function (loggedIn) {

            if (!loggedIn) {
                $scope.loadingBar = false;
                $scope.loginError = $translate('INVALIDCREDENTIALS');
                $rootScope.currentUser = {};
            }
            else {
                authService.requestCurrentUser()
                    .then(function (data) {
                        $rootScope.currentUser = data;
                        var lang = languageService.getLanguage(data.LanguageId);
                        languageService.setCurrentLanguage(lang);
                        //As rootscope is being watched inorder to refresh Toolbar, $apply() may trigger $watch
                        if ($rootScope.$$phase != '$apply' && $rootScope.$$phase != '$digest') {
                            $rootScope.$apply();
                        }
                        //authRetryQueue.cancelAll();
                        //authService.closeAuthDialog();
                    });
            }
        }, function (x) {
            $scope.loadingBar = false;
            if (x == '"INVALIDCREDENTIALS"') {
                $scope.loginError = $translate('INVALIDCREDENTIALS');
            } else {
                $scope.loginError = $translate('SERVERERRORFORLOGIN');
            }
            $rootScope.currentUser = {};
        });

    };

    $scope.clearLogin = function () {
        $scope.loginUser = {};
    };

    $scope.cancelLogin = function () {
        authService.cancelLogin();
    };

}];
