sharedModule.service("menu", ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {

    _tree = new Array();
    var _menuInstances = 0;
    var _notificationMenuItem = {};

    _getMenu = function (menuName) {

        _menuInstances++;
        return _tree[menuName];

    };

    _getMenuInstances = function () {

        return _menuInstances;

    };

    function getMenuData(menuNameIn) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: $rootScope.serverURL + '/api/v1/menu',
            params: { menuName: menuNameIn },
            withCredentials: true
        }).then(
            function (response, status) {
                response.data.MenuItems.forEach(function (menuItem) {
                    menuItem.SubMenuItems.forEach(function (subMenuItem) {
                        if (subMenuItem.URL == '#/notifications') {                           
                            _notificationMenuItem = subMenuItem;
                        }
                    });
                });
                deferred.resolve(response.data.MenuItems);
            },
            function (error) {
                deferred.reject();
            });

        return deferred.promise;

    }


    _loadMenu = function (menuName) {

        _tree[menuName] = getMenuData(menuName);

    };

    _reLoadMenus = function () {

        for (var menuName in _tree) {

            if (menuName != "chunk") {
                _tree[menuName] = getMenuData(menuName);
            }
        }

    };

    //to set the Badge info on first load
    _setBadgeInfo = function (menuItem) {
        var deferred = $q.defer();
        //var userId = ($rootScope.currentUser && $rootScope.currentUser.Key) ? parseInt($rootScope.currentUser.Key) : 0
        setTimeout(function () { //patch - till navigation is provided
            if ($rootScope.currentUser) {
                $http({
                    method: 'GET',
                    url: $rootScope.serverURL + '/api/v1/menu',
                    params: { userId: parseInt($rootScope.currentUser.Key), menuName: menuItem.Title },
                    withCredentials: true
                }).then(
             function (response, status) {
                 menuItem.badgeStyle = 'badge badge-info';
                 menuItem.badgeText = response.data.Count;
                 deferred.resolve('');
             },
             function (error) {
                 deferred.resolve('');
             });

                return deferred.promise;
            }
        }, 1000);

        //$http({
        //    method: 'GET',
        //    url: $rootScope.serverURL + '/api/v1/menu',
        //    params: { userId: userId, menuName: menuItem.Title },
        //    withCredentials: true
        //}).then(
        //    function (response, status) {

        //        menuItem.badgeStyle = 'badge badge-info';
        //        menuItem.badgeText = response.data.Count;

        //        deferred.resolve('');
        //    },
        //    function (error) {
        //        deferred.resolve('');
        //    });

        //return deferred.promise;
    };

    // to refresh the  Badge info when notification message is read 
    _refreshBadgeInfo = function (count) {
        _notificationMenuItem.ExtraInfo.BadgeInfo = count;
    }

    return {
        tree: _tree,
        getMenu: _getMenu,
        loadMenu: _loadMenu,
        reLoadMenus: _reLoadMenus,
        getMenuInstances: _getMenuInstances,
        refreshBadgeInfo: _refreshBadgeInfo
    }
}]);