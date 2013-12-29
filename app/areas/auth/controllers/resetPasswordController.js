authModule.resetPasswordController = ['$scope', '$rootScope', '$translate', 'common', 'authService',
    function ($scope, $rootScope, $translate, common, authService) {

        $scope.finalizeRegistrationModel = {};

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn("resetPasswordController");
        var logSuccess = getLogFn("resetPasswordController", "success");
        var logWarning = getLogFn("resetPasswordController", "warning");
        var logError = getLogFn("resetPasswordController", "error");

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
            if (IsValid && !angular.isDefined($scope.finalizeRegistrationModel.password) || $scope.finalizeRegistrationModel.password == "") {
                IsValid = false;
            }
            if (IsValid && !angular.isDefined($scope.finalizeRegistrationModel.confirmPassword) || $scope.finalizeRegistrationModel.confirmPassword == "") {
                IsValid = false;
            }
            if ($scope.finalizeRegistrationModel.password != $scope.finalizeRegistrationModel.confirmPassword) {
                IsValid = false;
            }
            else {
                //Do we need to show toastr or hidden span?
            }
            if (IsValid) {
                authService.finalizeRegistration($scope.finalizeRegistrationModel).then(function (data) {
                    if (data.Message == "Success") {
                        logSuccess($translate('PasswordChanged'));
                        var result = { CloseType: 'SUCCESS' };
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
            if (!angular.isDefined($scope.finalizeRegistrationModel.password) || !angular.isDefined($scope.finalizeRegistrationModel.confirmPassword)) {
                return '';
            }
            return $scope.finalizeRegistrationModel.password != $scope.finalizeRegistrationModel.confirmPassword ? 'Invalid' : 'valid';
        }
    }];