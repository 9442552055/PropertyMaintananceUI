sharedModule.directive('tmlButton', function () {
    return {
        restrict: 'E',
        scope: {
            type: '@type',
            label: '@label',
            responsive: '@responsive',
            action: '&action'

        },
        transclude: true,
        templateUrl: 'app/shared/directives/tmlButton/tmlButton.html'
        

    };
});
