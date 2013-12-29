sharedModule.service('listCacheService', ['$http', '$rootScope', '$q', 'sessionStore', 'sharedConstants',
function ($http, $rootScope, $q, sessionStore, sharedConstants) {

    var list = [];

    //Decides whethere requested records has to be fetched from ServerCache or LocalCache
    this.getPages = function (url, filterParams, toFetchPageIndex) {
        var deferred = $q.defer();
        var pagedFilterParams = angular.extend({ clientMaxCount: sharedConstants.ClientCacheSize }, filterParams);//TODO:Set page size in contants
        var keyForCache = trimKey (JSON.stringify(pagedFilterParams)); 
        var cachedList = null;//for testing commneted //sessionStore.session.get(keyForCache);
        //If same page with same filter already fetched
        if (cachedList != null) {
            list = JSON.parse(cachedList);
            setTimeout(function () {
                deferred.resolve(list)
            }, 0);
        }
        else {
            $http({
                method: 'GET',
                url: $rootScope.serverURL + url,
                params: pagedFilterParams,
                withCredentials: true
            })
            .then(
                function (response, status) {
                    addPage(response.data, toFetchPageIndex,keyForCache);
                    deferred.resolve(response.data);
                },
                function (error) {
                    //log error
                    deferred.reject();
            });
        }
        return deferred.promise;
    }

    var addPage = function (page, pageNo,key)
    {
        //list.push({ Id: pageNo, Page: page });
        sessionStore.session.add(key, JSON.stringify(page));
    }

    //Removes repetative unwanted charachters for key
    function trimKey(str) {
        str = str.replace(/^\s+/, '');
        for (var i = str.length - 1; i >= 0; i--) {
            if (str.charAt(i) == ',' || str.charAt(i) == ':' || str.charAt(i) == '"' || str.charAt(i) == '}' || str.charAt(i) == '{') {
                str = str.substr(0, i) + str.substr(i + 1);
            }
        }
        return str;
    }

}]);