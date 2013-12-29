sharedModule.directive('tmlFocusOut', ['$parse', function ($parse) {
    return function (scope, element, attr) {

        element.bind('focusout', function (event) {
            scope.$apply(function () {
                element.addClass("focus-out");
            });
        });
    }
}]);