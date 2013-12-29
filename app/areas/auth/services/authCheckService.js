authModule.provider('authCheckService', {

    requireAuthenticatedUser: ['authCheckService', function (securityAuthorization) {
        return securityAuthorization.requireAuthenticatedUser();
    }],

    $get: ['authService', 'authRetryQueue', function (authService, authRetryQueue) {
        var service = {

            // Require that there is an authenticated user
            // (use this in a route resolve to prevent non-authenticated users from entering that route)
            requireAuthenticatedUser: function () {
                var promise = authService.requestCurrentUser().then(function (userInfo) {
                    if (!authService.isAuthenticated()) {
                        return authRetryQueue.pushRetryFn('unauthenticated-client', authService.requireAuthenticatedUser);
                    }
                });
                return promise;
            }
        };

        return service;
    }]
});