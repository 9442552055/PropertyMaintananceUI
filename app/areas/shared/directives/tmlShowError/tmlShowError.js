//For showing error message - using this ll be consistent across the module
sharedModule.directive('tmlShowError', ['$parse', '$translate', '$window', function ($parse, $translate, $window) {
    return {
        restrict: 'AE',
        replace: false,
        scope: {
            validator: '=validator',//function validates and returns errorKey in translation or 'valid'
            valueToValidate: '=valueToValidate',//value in scope to be validated
            canValidate: '=canValidate'//true or false can be used for passing $dirty
        },
        template: '<span><div class="form-error" ng-show="canShowErrors()"><i class="fa fa-warning"></i>{{validator(valueToValidate)}}</div></span>',
        link: function (scope, element, attrs) {
            element.prev().addClass('hide-errors');
            scope.canShowErrors = function () {
                return scope.canValidate && scope.validator(scope.valueToValidate) != 'valid'
            }
        }
    }
}]);
