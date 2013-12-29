/// <reference path="../areas/auth/views/passwordDisclaimerView.html" />
var screenstructureModule = angular.module("screenstructureModule", ['sharedModule', 'ui.router','authModule']);

screenstructureModule.config(['$stateProvider', '$urlRouterProvider', 'menuProvider',
    function ($stateProvider, $urlRouterProvider, menu) {
    /*Routing definition*/
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        //#region routing configuration for root
        .state("root", {
            url: "/",
            abstract: true,
            views: {
                'toolbarView': {
                    templateUrl: 'app/areas/screenstructure/views/toolbarView.html',
                    controller: screenstructureModule.toolbarController
                },
                'toolbarMobileView': {
                    templateUrl: 'app/areas/screenstructure/views/toolbarMobileView.html',
                    controller: screenstructureModule.toolbarController
                },
                'sidebarView': {
                    templateUrl: 'app/areas/screenstructure/views/sidebarView.html',
                    controller: screenstructureModule.mainMenuController
                },
                'footerView': {
                    templateUrl: 'app/areas/screenstructure/views/footerView.html',
                    controller: screenstructureModule.footerController
                },
                'contentView': {
                    templateUrl: 'app/areas/screenstructure/views/contentView.html',
                    controller: screenstructureModule.footerController
                }
            }
        })
        //#endregion
        //#region routing configuration for dashboards
        .state("root.home", {
            url: "home",
            views: {
                'mainContentView': {
                    templateUrl: 'app/areas/screenstructure/views/homePage.html',
                   // controller: dashboardModule.dashboardController
                }
            }
        })

        //#endregion
         //#region user authentication
        .state("root.finalizeregistration", {
            url: "users/finalizeregistration/:key",
            views: {
                'mainContentView': {
                    templateUrl: 'app/areas/auth/views/finalizeRegistration.html',
                    controller: authModule.finalizeRegistrationController
                }
            }
        })
        .state("root.resetpassword", {
            url: "users/resetpassword/:key",
            views: {
                'mainContentView': {
                    templateUrl: 'app/areas/auth/views/resetPassword.html',
                    controller: authModule.resetPasswordController
                }
            }
        })
    //#endregion

}]);