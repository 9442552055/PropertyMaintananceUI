authModule.factory('authService', ['$http', '$q', '$location', 'authRetryQueue', '$rootScope', '$log', '$state', '$modal', function ($http, $q, $location, queue, $rootScope, $log, $state, $modal) {

    var loginType = 1;
    var registerType = 2;
    var passwordType = 3;

    // Redirect to the given url (defaults to '/')
    function redirect(stateToTransitionTo) {
        stateToTransitionTo = stateToTransitionTo || 'root.dashboard';
        $state.transitionTo(stateToTransitionTo);
    }


    // Login form dialog stuff
    var authDialog = null;

    function openAuthDialog(authTypeIn) {
        if (authDialog && authDialog.isOpened) {
            throw new Error('Trying to open a dialog that is already open!');
        }
        else {
            authDialog = $modal.open({
                templateUrl: 'app/areas/auth/views/authView.html',
                controller: authModule.authController,
                windowClass: 'multitab',
                backdrop: 'static',
                resolve: {
                    authType: function () {
                        return authTypeIn;
                    }
                }
            });
            authDialog.isOpened = true;
            authDialog.result.then(onAuthDialogClose);
        }
    }

    function closeAuthDialog(authResult) {
        if (authDialog && authDialog.isOpened) {
            authDialog.close(authResult);
            authDialog.isOpened = false;
        }
    }

    function onAuthDialogClose(authResult) {
        //Here we can do stuff specifically AFTER closing the dialog (because onAuthDialogClose is called when in the method openAuthDialog when the promise is fulfilled (in the 'then' clause).
        //The authType determines the type of button that was pressed (login, register or lost password).
        //Success determines if either a succesful login/register/cancel caused the calling of the method (in which case it is true), or a click on a cancel button caused the calling of the method (in which case it is false). 
        //These are very tightly coupled, but I don't know of any other way without rewriting modal (since modal can only take in one parameter in the close function...)
        //alert("AFTER closing the dialog: authType:" + authResult.authType + " , success: " + authResult.success);
        if (authResult.success) {
            queue.retryAll();
        } else {
            queue.cancelAll();
            redirect();
        }
        authDialog = null;
    }

    queue.onItemAddedCallbacks.push(function (retryItem) {
        if (queue.hasMore()) {
            service.showLogin();
        }
    });

    var pass = function closeRegisterPasswordDialog(success) {
        if (passwordDisclaimerDialog) {
            passwordDisclaimerDialog.close();
        }
        $http({ method: 'GET', url: $rootScope.serverURL + '/api/v1/currentuser', withCredentials: true })
            .then(function (response) {
                //angular.copy(response.data, $rootScope.currentUser);
                $rootScope.currentUser = response.data;
                return $rootScope.currentUser;
            });
    }

    var passwordDisclaimerDialog = null;
    function openPasswordDisclaimerDialog(userId) {
        if (passwordDisclaimerDialog) {
            throw new Error('Trying to open a dialog that is already open!');
        }

        //TODO: Club the no of parameters into one object
        var registerPassword = function (password, confirmPassword, hasAcceptedDisclaimer) {
            var deferred = $q.defer();
            var request = $http({ method: 'POST', url: $rootScope.serverURL + '/api/v1/register', withCredentials: true, data: { UserId: userId, Password: password, ConfirmPassword: confirmPassword, HasAcceptedDisclaimer: hasAcceptedDisclaimer, IsRegisterPassword: true } });
            request.then(function (response) { deferred.resolve(response.data); });
            return deferred.promise;
        }

        passwordDisclaimerDialog = $modal.open({
            templateUrl: '/app/areas/auth/views/PasswordDisclaimerView.html',
            controller: authModule.passwordRegistrationController,
            resolve: {
                closePassowrdRegistrationDialog: function () {
                    return pass;
                },
                registerPasswordService: function () {
                    return registerPassword;
                }
            }
        });
        //passwordDisclaimerDialog.result.then(onRegistrationDialogClose);
    }

    var _passwordRulesInfo = [
           {
               style: '', Message: 'UppercaseLetter', isValid: false,
               validate: function (viewValue) {
                   this.isValid=(viewValue && /[A-Z]/.test(viewValue));
                   this.style = (this.isValid ? 'valid' : 'Invalid');
                   return this.isValid;
               }
           },
           //{
           //    style: '', Message: 'LowercaseLetter', isValid: false,
           //    validate: function (viewValue) {
           //        this.isValid=(viewValue && /[a-z]/.test(viewValue));
           //        this.style = (this.isValid ? 'valid' : 'Invalid');
           //        return this.isValid;
           //    }
           //},
           {
               style: '', Message: 'Number', isValid: false,
               validate: function (viewValue) {
                   this.isValid=(viewValue && /\d/.test(viewValue));
                   this.style = (this.isValid ? 'valid' : 'Invalid');
                   return this.isValid;
               }
           },
           //{
           //    style: '', Message: 'PunctuationMark', isValid: false,
           //    validate: function (viewValue) {
           //        this.isValid=(viewValue && /[,!@#$%^&*()\u9999]/.test(viewValue));
           //        this.style = (this.isValid ? 'valid' : 'Invalid');
           //        return this.isValid;
           //    }
           //},
           {
               style: '', Message: 'PwdLength', isValid: false,
               validate: function (viewValue) {
                   this.isValid = (viewValue && viewValue.length >= 8);
                   this.style = (this.isValid ? 'valid' : 'Invalid');
                   return this.isValid;
               }
           }
    ];

    function closeRegistrationDialog(success) {
        if (registrationDialog) {
            registrationDialog.close(success);
        }
    }

    function onRegistrationDialogClose(success) {
        registrationDialog = null;
        if (success) {
            queue.retryAll();
        } else {
            queue.cancelAll();
            redirect();
        }
    }

    // The public API of the service
    var service = {

        getLoginType: function () {
            return loginType;
        },

        getRegisterType: function () {
            return registerType;
        },

        getPasswordType: function () {
            return passwordType;
        },

        // Get the first reason for needing a login
        getLoginReason: function () {
            return queue.retryReason();
        },

        showLogin: function () {
            openAuthDialog(loginType);
        },

        // Attempt to login a user by the given email and password
        login: function (username, password) {
            var deferred = $q.defer();
            var request = $http(
                {
                    method: 'POST',
                    url: $rootScope.serverURL + '/api/v1/login',
                    withCredentials: true,
                    data: { username: username, password: password }
                }).then(function (response) {   
                    var receivedUser = response.data;
                    //service.currentUser = receivedUser;
                    angular.copy(receivedUser, service.currentUser);
                    $rootScope.currentUser = service.currentUser;
                    if (service.isAuthenticated()) {
                        var authResult = { authType: loginType, success: true };
                        queue.cancelAll();
                        closeAuthDialog(authResult);
                    }
                    deferred.resolve(service.currentUser);
                }, function (error) {
                    deferred.reject(error.data);
                });
            return deferred.promise;
        },

        register: function (registerModel) {
            var deferred = $q.defer();
            var request = $http({ method: 'POST', url: $rootScope.serverURL + '/api/v1/register', withCredentials: true, data: registerModel });
            request.then(function (response) {
                deferred.resolve(response.data);
                closeAuthDialog(registerType, true);
            }, function (error) {
                deferred.reject(error.data);
            });
            return deferred.promise;
        },

        confirmRegistration: function(confirmationkey){
            if ($state.params.key != null) {
                var request = $http({ method: 'GET', url: $rootScope.serverURL + '/api/v1/register?key=' + confirmationkey });
                return request.then(function (response) {
                    var userId = response.data;
                    if (userId != 0)
                        $state.transitionTo('root.finalizeregistration');
                        //openPasswordDisclaimerDialog(userId);
                    else
                        $state.transitionTo('root.dashboard');
                });
            }
        },

        finalizeRegistration: function (password, confirmPassword, hasAcceptedDisclaimer) {
            var deferred = $q.defer();
            var request = $http({ method: 'POST', url: $rootScope.serverURL + '/api/v1/finalizeregistration', withCredentials: true, data: { UserId: userId, Password: password, ConfirmPassword: confirmPassword, HasAcceptedDisclaimer: hasAcceptedDisclaimer, IsRegisterPassword: true } });
            request.then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error.data);
            });
            return deferred.promise;
        },

        // Show the modal login dialog
        showRegistration: function () {
            openAuthDialog(registerType);
        },

        validateCaptcha: function validateCaptcha(challengefield, responsefield) {
            var deferred = $q.defer();
            var request = $http({
                method: 'POST', url: 'http://www.google.com/recaptcha/api/verify',
                params: { privatekey: '6LesDugSAAAAAE1w6lnrf1yDAwjFckEY8fuLVF9A', remoteip: '119.226.97.234', response: responsefield, challenge: challengefield }
            });
            request.then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error.data);
            });
            return deferred.promise;
        },

        showPasswordDisclaimer: function () {
            openPasswordDisclaimerDialog();
        },

        //openRegisterConfirmation: function (key) { openRegisterConfirmation(key); },// this method is called for resetting passwords

        resetPassword: function (email) {
            var deferred = $q.defer();
            var request = $http({ method: 'POST', url: $rootScope.serverURL + '/api/v1/passwordresetrequest', withCredentials: true, data: { email: email } });
            request.then(function (response) {
                    deferred.resolve(response.data);
                    var authResult = { authType: passwordType, success: true };
                    closeAuthDialog(authResult);
            }, function (error) {
                deferred.reject(error.data);
            });
            return deferred.promise;
        },

        confirmResetPassword: function (userId, password, confirmPassword) {
            var deferred = $q.defer();
            var request = $http({ method: 'POST', url: $rootScope.serverURL + '/api/v1/passwordresetconfirm', withCredentials: true, data: { UserId: userId, Password: password, ConfirmPassword: confirmPassword } });
            request.then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error.data);
            });
            return deferred.promise;
        },

        // Give up trying to login and clear the retry queue
        cancelLogin: function () {
            var authResult = { authType: loginType, success: false };
            //alert("ZERO var 1:" + authResult.authType + " , var 2: " + authResult.success);
            closeAuthDialog(authResult);

        },

        // Give up trying to register and clear the retry queue
        cancelRegister: function () {
            var authResult = { authType: registerType, success: false };
            //alert("ZERO var 1:" + authResult.authType + " , var 2: " + authResult.success);
            closeAuthDialog(authResult);
        },

        // Give up trying to login and clear the retry queue
        cancelPassword: function () {
            var authResult = { authType: passwordType, success: false };
            //alert("ZERO var 1:" + authResult.authType + " , var 2: " + authResult.success);
            closeAuthDialog(authResult);

        },

        cancelAuthDialog: function (authType) {
            var authResult = { authType: authType, success: true };
            //alert("ZERO var 1:" + authResult.authType + " , var 2: " + authResult.success);
            closeAuthDialog(authResult);
        },

        // Logout the current user and redirect
        logout: function () {
            var request = $http({ method: 'POST', url: $rootScope.serverURL + '/api/v1/logout', withCredentials: true });
            return request.then(function (response) {
                service.currentUser = {};
                $rootScope.currentUser = {};
                $state.transitionTo('root.dashboard');
            });
        },

        // Ask the backend to see if a user is already authenticated - this may be from a previous session.
        requestCurrentUser: function () {
            if (service.isAuthenticated()) {
                return $q.when(service.currentUser);
            } else {
                var request = $http({ method: 'GET', url: $rootScope.serverURL + '/api/v1/currentuser', withCredentials: true });
                return request.then(function (response) {
                    angular.copy(response.data, service.currentUser);
                    $rootScope.currentUser = service.currentUser;
                    return service.currentUser;
                });
            }
        },

        // Information about the current user
        currentUser: {},

        // Is the current user authenticated?
        isAuthenticated: function () {
            var alreadyAuthenticated = !jQuery.isEmptyObject(service.currentUser);
            return alreadyAuthenticated;
        },

        passwordValidationRule: _passwordRulesInfo

        

    };

    return service;
}]);

authModule.service('changePasswordService', ['$rootScope', '$http', '$q', '$modal'
    , function ($rootScope,$http, $q, $modal) {

    var changePasswordDialog = { isOpened: false };

    var closeChangePasswordDialog = function (result) {
        if (changePasswordDialog && changePasswordDialog.isOpened) {
            changePasswordDialog.isOpened = false;
            changePasswordDialog.close(result);
        }
    }

    var changePassword = function (changePasswordModel) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: $rootScope.serverURL + '/api/v1/CurrentUser',
            data: changePasswordModel,
            withCredentials: true
        }).then(function (response, status) {
            deferred.resolve(response.data);
        }, function (error) {
            deferred.reject();
        });
        return deferred.promise;
    }


    this.openChangePasswordDialog = function (onChangePasswordDialogClose) {
        if (changePasswordDialog && changePasswordDialog.isOpened) {
            throw new Error('Trying to open a dialog that is already open!');
        }
        else {
            changePasswordDialog = $modal.open({
                templateUrl: '/app/areas/auth/views/changePasswordDialog.html',
                controller: authModule.changePasswordDialogController,
                backdrop: 'static',
                windowClass: 'confirmable-modal',
                resolve: {
                    closeChangePasswordDialog: function () {
                        return closeChangePasswordDialog;
                    },
                    changePassword: function () {
                        return changePassword;
                    }
                }
            });
            changePasswordDialog.isOpened = true;
            changePasswordDialog.result.then(onChangePasswordDialogClose);
        }
    }


}]);