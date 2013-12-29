//this directive can be used on any page where you need a button that triggers the creation of a modal
sharedModule.directive('tmlConfirmableButton', ['confirmableModalService', function (confirmableModalService) {
    return {
                //use is restricted to attributes and elements
                restrict: 'AE',
                
                //we need the following attributes for either the button itself, or for the modal.
                scope: {
                    buttonText: '@buttonText',
                    buttonType: '@buttonType',
                    modalBody: '@modalBody',
                    modalTitle: '@modalTitle',
                    okButtonText: '@okButtonText',
                    cancelButtonText: '@cancelButtonText',
                    responsive: '@responsive',
                    checked: '@checked',
                    functionToPerform : "&"//This attribute represents the actual function to be performed. This function should be a function defined in the scope of the controller that is responsible for the template where the button is placed.
                },
                transclude: true,
                templateUrl: '/app/shared/directives/tmlConfirmableButton/tmlConfirmableButton.html',

                link: function (scope, element, attrs, $event) {
                    element.bind('click', function (e) {
                        e.stopPropagation();
                    });
                    element.bind('click', buttonClicked);

                    function buttonClicked() {
                        
                        var boolChecked = (scope.checked == "true") ? true : false;
                        if (boolChecked) {
                            confirmableModalService.openConfirmableModal(scope.modalTitle, scope.modalBody, scope.okButtonText, scope.cancelButtonText, scope.functionToPerform);//we use the confirmableModalService to actually create the modal and handle the lifecycle of the modal. 
                        } else {
                            scope.functionToPerform();//if we do not set checked to true in the directive used in the template, we can execute the handed in method at once
                        }
                        
                    };
                }         
        }
}]);