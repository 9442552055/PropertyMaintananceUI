
sharedModule.factory('sessionStore', [function ($rootScope) {

    /* return sessionStorage || { getItem: function (key) { return null; }, setItem: function (key, value) { } };*/

   
        var sessionStore = {
            session: {
                add: addToSession,
                get: getFromSession,
                remove: removeSession,
                clear: clearAllSession
            },
            local: {
                add: addToLocalSession,
                get: getFromLocalSession,
                remove: removeLocalSession,
                clear: clearAllLocalSession
            }
        };
        
        // Session Store
    
        sessionStore.addSession = function (key, value) {
            var sessionObject = sessionStore["session"];
            return sessionObject.add(key, value);
        };
    
        sessionStore.getSession = function (key) {
            var sessionObject = sessionStore["session"];
            return sessionObject.get(key);
        };
    
        sessionStore.removeSession = function (key) {
            var sessionObject = sessionStore["session"];
            return sessionObject.remove(key);
        };
    
        sessionStore.clearSession = function () {
            var sessionObject = sessionStore["session"];
            return sessionObject.clear();
        };
    
        function addToSession(key, value) {
            try {
                sessionStorage.setItem(key, value);
            }
            catch (e) {
                return raiseException(e);
            }
            return true;
        };
    
        function getFromSession(key) {
            try {
                var value = sessionStorage.getItem(key);
                return value;
            }
            catch (e) {
                return raiseException(e);
            }
            return null;
        };
    
        function removeSession(key) {
            try {
                sessionStorage.removeItem(key);
            }
            catch (e) {
                return raiseException(e);
            }
            return true;
        };
    
        function clearAllSession() {
            try {
                sessionStorage.clear();
            }
            catch (e) {
                return raiseException(e);
            }
            return true;
        };
    
        // Local Session Store
    
        sessionStore.addLocal = function (key, value) {
            var localSessionObject = sessionStore["local"];
            return localSessionObject.add(key, value);
        };
    
        sessionStore.getLocal = function (key) {
            var localSessionObject = sessionStore["local"];
            return localSessionObject.get(key);
        };
    
        sessionStore.removeLocal = function (key) {
            var localSessionObject = sessionStore["local"];
            return localSessionObject.remove(key);
        };
    
        sessionStore.clearLocal = function () {
            var localSessionObject = sessionStore["local"];
            return localSessionObject.clear();
        };
    
        function addToLocalSession(key, value) {
            try {
                localStorage.setItem(key, value);
            }
            catch (e) {
                return raiseException(e);
            }
            return true;
        };
    
        function getFromLocalSession(key) {
            try {
                var value = localStorage.getItem(key);
                return value;
            }
            catch (e) {
                return raiseException(e);
            }
            return null;
        };
    
        function removeLocalSession(key) {
            try {
                localStorage.removeItem(key);
            }
            catch (e) {
                return raiseException(e);
            }
            return true;
        };
    
        function clearAllLocalSession() {
            try {
                localStorage.clear();
            }
            catch (e) {
                return raiseException(e);
            }
            return true;
        };
    
    
        function raiseException(error) {
            $rootScope.$broadcast('session error', error.title + ': ' + error.message);
            return false;
        }
    
        return sessionStore;
        
}]);