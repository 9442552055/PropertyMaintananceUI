authModule.directive('tmlAuthorize', ['$parse', 'authService', 'featureService','$rootScope',
    function ($parse, authService, featureService, $rootScope) {
    return {
        restrict: 'AE',
        scope: {
            tmlAuthorizeUrl: '=',
            tmlAuthorizeFeature: '=',
            tmlAuthorizeText: '@',
            tmlAuthorizeClass: '@',
            tmlAuthorizeClickParam:'=',
            tmlAuthorizeOnClick: '='            
        },
        templateUrl: '/app/areas/auth/directives/tmlAuthorizePanel/tmlAuthorize.html',
        replace:true,
        link: function (scope, element, attrs) {

            if(attrs.tmlAuthorizeText)
                scope.displayText = attrs.tmlAuthorizeText;

            if (attrs.tmlAuthorizeOnClick && angular.isFunction(scope.tmlAuthorizeOnClick))
                scope.onClick = function () {
                    scope.tmlAuthorizeOnClick(scope.tmlAuthorizeClickParam);
                };

            scope.elementUrl = '';
            var requestedFeature = scope.tmlAuthorizeFeature;

            if (requestedFeature) {
                featureService.getSecurableUrl(requestedFeature)
                    .then(
                    function (response) {
                        //Instead of getting boolean from server side and url from client side , can have url in server ll be more secure
                        if (response.isAuthorized)
                            scope.elementUrl = scope.tmlAuthorizeUrl;
                        else
                            scope.elementUrl = '';//unauthorized access log error
                    },
                    function (error) {
                        scope.elementUrl = '';//log error
                    });
            }
            else {
                scope.elementUrl = '';//log error
            }
        }
    }
}]);