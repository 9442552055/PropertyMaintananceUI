sharedModule.directive('tmlValidation',['$compile', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            errorMsg: '@tmlValidation'

        },
        link: function (scope, element, attr, ctrl) {

            element.addClass('hide-errors');
            
            element.bind('focusout', function (event) {
                scope.$apply(function () {
                    scope.showErrors = true;
                    element.removeClass('hide-errors');
                });
            });

            element.after($compile("<div class='form-error'><i class='fa fa-warning'></i> {{errorMsg}}</div>")(scope));

        }
        
};
}]);
