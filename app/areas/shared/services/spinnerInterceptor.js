// service used for handling the spinner on load
sharedModule.factory('spinnerInterceptor', ['$q', '$rootScope', '$injector', '$timeout', function ($q, $rootScope, $injector,$timeout) {

    var notFinishedRequests = 0;

    // remove request from stack on success
    function success(response) {
        
        notFinishedRequests--;

        if (notFinishedRequests == 0) {
            stoploading();
        }

        return response;
        
    }

    // remove request from stack on error
    function error(response) {

        notFinishedRequests--;

        if (notFinishedRequests == 0) {
            stoploading();
        }

        return $q.reject(response);
    }

    // add request to stack
    return function (promise) {
        
        if (notFinishedRequests == 0) {
            startloading()
        }
        notFinishedRequests++;

        return promise.then(success, error);
    }

    // stop loading
    function stoploading() {

        $rootScope.loading = false;

    }

    // start loading
    function startloading() {

        $rootScope.loading = true;

    }


}]);

sharedModule.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.responseInterceptors.push('spinnerInterceptor');
}]);