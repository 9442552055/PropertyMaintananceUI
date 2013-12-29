sharedModule.directive('tmlHideDuplicate', ['$parse', function ($parse) {
    return {
        restrict: 'AE',
        scope: {
            tmlHideDuplicateCurrent: '=',
            tmlHideDuplicatePrevious: '=',
            tmlHideDuplicateKey: '='
        },
        replace:false,
        link: function (scope, element, attrs) {
           
            if (scope.tmlHideDuplicatePrevious)
            {
                if (scope.tmlHideDuplicateCurrent && attrs.tmlHideDuplicateKey) {

                    if (angular.equals(
                        scope.tmlHideDuplicateCurrent[attrs.tmlHideDuplicateKey],
                        scope.tmlHideDuplicatePrevious[attrs.tmlHideDuplicateKey]))
                    {
                        element[0].innerHTML = '';
                    }
                }
            }
        }
    }
}]);