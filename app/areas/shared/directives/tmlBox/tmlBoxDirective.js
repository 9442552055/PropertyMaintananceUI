sharedModule.directive('tmlBox', function () {
    return {
        restrict: 'AE',
        scope: {
            title: '@tmlBox',
        },
        transclude: true,
        templateUrl: '/app/shared/directives/tmlBox/tmlBox.html'
      
    }
});