authModule.directive('passwordValidator', ['$compile',function ($compile) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var validationRuleInfoHtml = '<ul id="password-rule-info" class="password-rule-info"><li ng-repeat="info in passwordRulesInfo" ng-class="info.style"><span class="fa fa-square-o" ng-show="!info.isValid"></span><span class="fa fa-check-square-o" ng-show="info.isValid"></span>{{"Atleast" }}<strong>{{ " " }}{{ info.Message }}</strong></li></ul>';
            var validationInfoHtml = '<div class="col-md-6"><div class="popover fade right in " style="display: block;"><div class="arrow password-change-validation-arrow"></div><div class="popover-content password-change-validation-content">' + validationRuleInfoHtml + '</div></div></div></div>'
            var isValidationInfoShown = false;
            ctrl.$parsers.unshift(function (viewValue) {
                var newValue = angular.copy(viewValue);
                for (var a = 0; a < scope.passwordRulesInfo.length; a++) {
                    scope.passwordRulesInfo[a].validate(newValue);
                }
                if (!isValidationInfoShown)
                {
                    elm.parent().remove('#password-rule-info');
                    var appendElem = $compile(validationInfoHtml)(scope);
                    elm.parent().after(appendElem);
                    isValidationInfoShown = true;
                }
                return newValue;
            });
           
        }
    };
}]);