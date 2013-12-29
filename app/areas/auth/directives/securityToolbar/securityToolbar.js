sharedModule.directive('securityToolbar', ['$rootScope', function ($rootScope) {
    var directive = {
        templateUrl: 'app/areas/auth/directives/securityToolbar/securityToolbar.tpl.html',
        restrict: 'E',
        replace: true,
        scope: true,
        link: function ($scope, $element, $attrs, $controller) {
            $scope.isAuthenticated = $rootScope.isAuthenticated;
            $scope.Email = $rootScope.currentUserEmail;
            $scope.$watch(function () {
                return $rootScope.currentUserEmail;
            }, function (currentUser) {
                $scope.Email = currentUser;
                $scope.isAuthenticated = $rootScope.isAuthenticated;
            });
        }
    };
    return directive;
}]);