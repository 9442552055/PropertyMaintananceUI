sharedModule.directive('tmlMenu', ['menu', function (menu) {
    return {
        restrict: 'A',
        scope: {
            tmlMenu: '@tmlMenu'

        },
        templateUrl: 'app/shared/directives/tmlMenu/tmlMenu.html',
        controller: ['$scope','$attrs','$rootScope','menu', function ($scope,$attrs,$rootScope,menu) {

            // reload the menu when the user changes 
            $rootScope.$watch('currentUser.Username', function () {
                $scope.menuItems = menu.getMenu($attrs.tmlMenu);
                $scope.instance = menu.getMenuInstances();
            });

            $scope.menuName = $attrs.tmlMenu;


        }]

       
    };
}]);
