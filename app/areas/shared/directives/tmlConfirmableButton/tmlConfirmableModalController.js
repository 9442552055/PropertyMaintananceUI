sharedModule.tmlConfirmableModalController = ["$scope", "confirmableModalService", "$modalInstance", "modalBody", "modalTitle", "okButtonText", "cancelButtonText",
  function ($scope, confirmableModalService, $modalInstance, modalBody, modalTitle, okButtonText, cancelButtonText) {//the variables mentioned here are passed in by the modal service

      $scope.modalBody = modalBody;
      $scope.modalTitle = modalTitle;
      $scope.okButtonText = okButtonText;
      $scope.cancelButtonText = cancelButtonText;

      // for modal close in esc
      $(document).keydown(function (e) {
          // ESCAPE key pressed
          if (e.keyCode == 27) {
              alert("cancelled by escape");
          }
      });

      //perform the requested action
      $scope.performOk = function () {
          confirmableModalService.closeOK();   
      };

      //cancel requested action
      $scope.performCancel = function () {
          confirmableModalService.closeCancel();
      };

  }];