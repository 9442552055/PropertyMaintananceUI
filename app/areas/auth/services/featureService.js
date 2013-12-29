//can be merged with authService later
authModule.service('featureService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

    _featureGroups = [];
    this.canLoadFeatures = true;
    //Method loades the features in server cache Application Preloadables
    this.getFeatureGroups = function () {
        if (this.canLoadFeatures) {
            this.canLoadFeatures = false;
            $http({
                method: 'GET',
                url: $rootScope.serverURL + '/api/v1/Preload',
                withCredentials: true
            }).then(
                function (response, status) {
                    _featureGroups = response.data;
                    // $rootScope._featureGroups = angular.copy(_featureGroups); //have decide this
                },
                function (error) {
                    this.canLoadFeatures = true;
                    //log error
                });
        }
    }

    this.getSecurableUrl = function (feature) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: $rootScope.serverURL + '/api/v1/CurrentUser',
            params: {feature: feature },
            withCredentials: true
        }).then(
           function (response, status) {
               //secureUrl = response.data;
               deferred.resolve(response.data);
           },
           function (error) {
               //log error
               deferred.reject();
           });
        return deferred.promise;
    }

    this.userProfileFeatures = {
        ViewProfile: 'ViewProfile',
        EditProfilePicture: 'ChangeProfilePicture',
        EditEmail: 'ChangeProfileEmail',
        EditPassword: 'ChangeProfilePassword',
        EditProfile: 'EditProfile',
        EditGroupAndRoles: 'EditGroupAndRoles',
        UnblockUser: 'UnblockAUser',
        BlockUser: 'BlockUser',
        DeleteProfilePicture: 'DeleteProfilePicture',
        DeleteUser:'DeleteAUser'
    };

    this.professionFeatures = {
        EditProfession: 'EditProfession',
        DeleteProfession: 'DeleteProfession'
    };

    this.securityGroupFeatures = {
        AddSecurityGroup: 'AddSecurityGroup',
        ViewSecurityGroup: 'ViewSecurityGroup',
        EditSecurityGroup: 'EditSecurityGroup',
        DeleteSecurityGroup: 'DeleteSecurityGroup'
    };
   
}]);