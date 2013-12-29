authModule.changePasswordDialogController = ['$scope', '$rootScope', 'closeChangePasswordDialog', 'changePassword', '$translate', 'common', 'authService',
    function ($scope, $rootScope, closeChangePasswordDialog, changePassword, $translate, common, authService) {

        $scope.changePasswordModel = {};

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn("professionCreateController");
        var logSuccess = getLogFn("professionCreateController", "success");
        var logWarning = getLogFn("professionCreateController", "warning");
        var logError = getLogFn("professionCreateController", "error");

        $scope.oldPasswordDecription = $translate('OldPasswordDecription');
        $scope.newPasswordDecription = $translate('NewPasswordDecription');
        $scope.confirmPasswordDecription = $translate('ConfirmPasswordDecription');

        $scope.passwordRulesInfo = angular.copy(authService.passwordValidationRule);


        $scope.validateChangePassword = function (passwordRulesInfo) {
            IsValid = true;
            for (var a = 0; a < passwordRulesInfo.length; a++) {
                if (!$scope.passwordRulesInfo[a].isValid) {
                    IsValid = false;
                }
            }
            if (IsValid && !angular.isDefined($scope.changePasswordModel.oldPassword) || $scope.changePasswordModel.oldPassword == "") {
                IsValid = false;
            }
            if (IsValid && !angular.isDefined($scope.changePasswordModel.newPassword) || $scope.changePasswordModel.newPassword == "") {
                IsValid = false;
            }
            if (IsValid && !angular.isDefined($scope.changePasswordModel.newPasswordConfirm) || $scope.changePasswordModel.newPasswordConfirm == "") {
                IsValid = false;
            }
            if ($scope.changePasswordModel.newPassword != $scope.changePasswordModel.newPasswordConfirm) {
                IsValid = false;
                logError($translate('ConfirmPasswordNotEqual'));
            }
            else {
                
            }
            if (IsValid) {
                changePassword($scope.changePasswordModel).then(function (data) {
                    if (data.Message == "Success") {
                        logSuccess($translate('PasswordChanged'));
                        var result = { CloseType: 'SUCCSESS' };
                        closeChangePasswordDialog(result);
                    }
                    else {
                        logError(data.Message);
                    }
                }, function (error) {
                    logError("Server Error");
                });
            }
        }


        var IsValid = false;
        //TODO: remove once the new directive [password-validator] works fine
        var handleChange = function (event) {
            var viewValue = event.currentTarget.value;
            var pwdValidLength = (viewValue && viewValue.length >= 8 ? '' : $translate('UppercaseLetter'));
            var pwdHasUppercaseLetter = (viewValue && /[A-Z]/.test(viewValue)) ? '' : $translate('LowercaseLetter');
            var pwdHasLowercaseLetter = (viewValue && /[a-z]/.test(viewValue)) ? '' : $translate('Number');
            var pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? '' : $translate('PunctuationMark');
            var pwdHasPunctuation = (viewValue && /[,!@#$%^&*()\u9999]/.test(viewValue)) ? '' : $translate('PwdLength');
            var message = '';
            if (pwdValidLength && pwdValidLength != '') {
                message = message + pwdValidLength + ' \n \r ';
            }
            if (pwdHasUppercaseLetter && pwdHasUppercaseLetter != '') {
                message = message + pwdHasUppercaseLetter + ' \n \r ';
            }
            if (pwdHasLowercaseLetter && pwdHasLowercaseLetter != '') {
                message = message + pwdHasLowercaseLetter + ' \n \r ';
            }
            if (pwdHasNumber && pwdHasNumber != '') {
                message = message + pwdHasNumber + ' \n \r ';
            }
            if (pwdHasPunctuation && pwdHasPunctuation != '') {
                message = message + pwdHasPunctuation + ' \n \r ';
            }
            if (message != '') {
                logError(event.data + message);
                IsValid = false;
            }
            else {
                if (event.currentTarget.id == 'oldPassword') {
                    //TODO: Should we need to check whether old password exist and alert? // but this may lead to guessing of password
                }
                else if (event.currentTarget.id == 'confirmPassword') {
                    if ($('#newPassword')[0].value != $('#confirmPassword')[0].value) {
                        logError($translate('ConfirmPassword'));
                        IsValid = false;
                    }
                }
            }
        };

        $scope.isConfirmPasswordValid = function () {
            if (!angular.isDefined($scope.changePasswordModel.newPassword) || !angular.isDefined($scope.changePasswordModel.newPasswordConfirm)) {
                return '';
            }
            return $scope.changePasswordModel.newPassword != $scope.changePasswordModel.newPasswordConfirm ? 'Invalid' : 'valid';
        }

        $scope.closeDialog = function () {
            var result = { CloseType: 'CANCEL' };
            closeChangePasswordDialog(result);
        }

        // for modal close in esc
        $(document).keydown(function (e) {
            // ESCAPE key pressed
            if (e.keyCode == 27) {
                var result = { CloseType: 'ESC' };
                closeChangePasswordDialog(result);
            }
        });
    }];