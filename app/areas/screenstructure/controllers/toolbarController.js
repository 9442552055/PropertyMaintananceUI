/// <reference path="toolbarController.js" />
screenstructureModule.toolbarController = ["$scope", "$rootScope", "$state", "$stateParams",  "authService", "sessionStore",
  function ($scope, $rootScope, $state, $stateParams,  authService,  sessionStore) {

      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      /* RESPONSIVE */
      $rootScope.isCollapsed = false;
      $scope.showRegistration = authService.showRegistration;
      $scope.showLogin = authService.showLogin;
      //$scope.isAuthenticated = authService.isAuthenticated;
      $scope.login = authService.showLogin;
      $scope.logout = authService.logout;

      //Requests current user
      if (angular.isFunction(authService.requestCurrentUser)) {
          authService.requestCurrentUser().then(function (data) {
              $scope.currentUser = data;
          });
      }

      //Sets current user and his language
      $rootScope.$watch(function () { return $rootScope.currentUser; }, function (newVal,oldVal) {
          $scope.currentUser = newVal;
          if (!angular.equals(newVal, oldVal)) {
              $scope.currentUser = newVal;
              //On Login succesfull -> set the user's language to session language
              //Moved this to auth => LoginController on Login
              //if (newVal && angular.isDefined(newVal.LanguageId)) {
                  
                  //var lang = languageService.getLanguage(newVal.LanguageId);
                  //languageService.setCurrentLanguage(lang);
              //}
          }
      });

      //Hide-Show toggle for toolbar login Vs User info
      $scope.isAuthenticated = function () {
          return angular.isDefined($scope.currentUser) && angular.isDefined($scope.currentUser.Key);
      }

      //$scope.languages = [];
      ////Gets the list of languages to list in toolbar and sets default Language
      //languageService.getLanguages().then(
      //    function (languages) {
      //        $scope.languages = angular.copy(languages);
      //        var currentLang = languageService.getCurrentLanguage();
      //        if (!currentLang || currentLang=="") {
      //            currentLang = languageService.getDefaultLanguage();
      //            if (angular.isDefined(currentLang)) {
      //                languageService.setCurrentLanguage(currentLang);
      //            }
      //        }
      //        $translate.uses(currentLang.ISOName);
      //    });

      //On click[user changes language from toolbar]
      //$scope.changeLanguage = function (lang) {
      //    $translate.uses(lang.ISOName);
      //    languageService.setCurrentLanguage(lang);
      //};

      ////Higlighting the current language in toolbar
      //$scope.$watch(
      //    function () {
      //        return $translate.uses();
      //    },
      //function (newVal, oldVal) {
      //    setLanguageActive(newVal);
      //});

      //var setLanguageActive = function (ISOName) {
      //    setTimeout(function () {
      //        $('#languages li').removeClass("active");
      //        $('#' + ISOName).addClass("active");
      //    }, 500);
      //}
      //end Language


  }];