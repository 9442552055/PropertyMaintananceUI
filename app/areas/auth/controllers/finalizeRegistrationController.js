/*This controlleris used for finalizing the registration. The functionality is very simple. When the controller is
activated (because of accessing a particular route), the confirmRegistration method is called automatically on the service.*/
authModule.finalizeRegistrationController = ['$scope', '$rootScope', '$translate', 'common', 'authService', '$state',
    function ($scope, $rootScope, $translate, common, authService, $state) {

        $scope.finalizeRegistrationModel = {};

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn("professionCreateController");
        var logSuccess = getLogFn("professionCreateController", "success");
        var logWarning = getLogFn("professionCreateController", "warning");
        var logError = getLogFn("professionCreateController", "error");

        //Here we call the confirmRegistration function of the authService which will forward the request to the server
        authService.confirmRegistration($state.params.key).then(function (data) {            
            logSuccess($translate('AccountActivated'));
            $state.transitionTo('root.dashboard');
        }, function (error) {
            logError($translate('ProblemActivatingAccount'));
            $state.transitionTo('root.dashboard');
        });

        
    }];