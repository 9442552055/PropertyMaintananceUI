//This service is responsible for handling the creation and destruction of modals. Right now it is created for an OK/Cancel type modal, but could easily be extended for more complex ones
sharedModule.factory('confirmableModalService', ['$rootScope', '$log', '$state', '$modal', function ($rootScope, $log, $state, $modal) {

    // variable that holds the modal instance. We will use this to check if a modal is already active, since it is bad practive to have more than one modal opened.
    var confirmableModal = null;

    //this variable will hold the function that will be executed if the user "confirms" the action in the modal
    var functionToPerformInternal;

    //this is the internal function of the service that is responsible for opening the modal. It is handed all the necessary variables by the calling controller to instantiate the modal.
    function openConfirmableModal(modalTitle, modalBody, okButtonText, cancelButtonText, functionToPerform) {
        functionToPerformInternal = functionToPerform;

        //we check to see if the modal is not already opened
        if (confirmableModal && confirmableModal.isOpened) {
            throw new Error('There is already a confirmable modal opened!');
        }
        else {
            confirmableModal = $modal.open({
                templateUrl: '/app/shared/directives/tmlConfirmableButton/tmlConfirmableModal.html',
                controller: sharedModule.tmlConfirmableModalController,
                windowClass: 'confirmable-modal',
                backdrop: 'static',
                resolve: {
                    modalTitle: function () {
                        return modalTitle;
                    },

                    modalBody: function () {
                        return modalBody;
                    },
                    okButtonText: function () {
                        return okButtonText;
                    },
                    cancelButtonText: function () {
                        return cancelButtonText;
                    }
                }
            }
            );
            confirmableModal.isOpened = true;
            //AFTER the modal closes, we will perform onModalClose
            confirmableModal.result.then(onModalClose);
        }
    };

    //things to do after closing the modal
    function closeOK () {
        functionToPerformInternal();//in case we call closeOK from the modal, we execute the method that was handed to the service.
        confirmableModal.close();//this method actually closes the modal
        confirmableModal.isOpened = false;
    }

    function closeCancel() {
        confirmableModal.close();//this method actually closes the modal
        confirmableModal.isOpened = false;
    }

    function onModalClose() {
        confirmableModal = null;//this method is called AFTER closing of the modal
    }
  
    // The public API of the service. Other methods will not be available for callers.
    var service = {

        openConfirmableModal: function (modalTitle, modalBody, okButtonText, cancelButtonText, functionToPerform) {
            openConfirmableModal(modalTitle, modalBody, okButtonText, cancelButtonText, functionToPerform);
        },

        closeOK: function () {
            closeOK();
        },

        closeCancel: function () {
            closeCancel();
        }
    };

    return service;
}]);
