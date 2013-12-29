sharedModule.directive('tmlBack', function () {
    return {
        restrict: 'AE',
        scope: {
            buttonText: '@tmlBack',
            messageText: '@messageText',
            checked: '@checked'
        },
        templateUrl: '/app/shared/directives/tmlBack/tmlBack.html',
        link: function (scope, element, attrs) {
            element.bind('click', goBack);
            function goBack() {
                var boolChecked = (attrs.checked == "true") ? true : false;
                if (boolChecked) {
                    alert('This should become a modal');
                    history.back();
                    scope.$apply();
                } else {
                    history.back();
                    scope.$apply();
                }
            }
        }
    }
});