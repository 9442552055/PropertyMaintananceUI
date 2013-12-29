sharedModule.service('languageService', ['$http', '$rootScope', '$q', 'sessionStore',
function ($http, $rootScope, $q, sessionStore) {
    //Local cache is used - sessioinStore
    var languages = [];
    var deferred = $q.defer();

    this.isLanguagesLoaded = false;//TODO: remove this flag
    this.getLanguages = function () {
        var cacheLanguages = sessionStore.session.get('LANGUAGES');
        if (cacheLanguages != null) {
            languages = JSON.parse(cacheLanguages);
            setTimeout(function () {
                deferred.resolve(languages)
            }, 0);
        }
        else {
            if (!this.isLanguagesLoaded) {

                $http({
                    method: 'GET',
                    url: $rootScope.serverURL + '/api/v1/Languages',
                    withCredentials: true
                }).then(
                       function (response, status) {
                           languages = response.data;
                           sessionStore.session.add('LANGUAGES', JSON.stringify(languages));
                           deferred.resolve(languages);
                       },
                       function (error) {
                           //log error
                           deferred.reject();
                       });

            }

        }
        return deferred.promise;
    }

    this.getLanguage = function (id) {
        var lang = undefined;
        for (var a = 0; a < languages.length; a++) {
            if (languages[a].Id == id)
                lang = languages[a];
        }
        return lang;
    }

    this.getCurrentTranslationLanguages = function () {
        var currentLanguageId = this.getCurrentLanguage().Id;
        var currentTranslationLanguages = this.getTranslatedLanguages(currentLanguageId);
        return currentTranslationLanguages;
    }

    this.getTranslatedLanguages = function (languageId) {
        var translatedLanguages = [];
        for (var a = 0; a < languages.length; a++) {
            for (var b = 0; b < languages[a].LanguageTranslations.length; b++) {
                if (languages[a].LanguageTranslations[b].LanguageId == languageId) {
                    translatedLanguages.push(languages[a].LanguageTranslations[b]);
                }
            }
        }
        return translatedLanguages;
    }

    //stores current language
    var languageCache = sessionStore.session.get('CURRENTLANGUAGE')
    currentLanguage = languageCache != null ? JSON.parse(languageCache) : languageCache;

    //set current language and add in local cache
    this.setCurrentLanguage = function (lang) {
        var tempLanguage = lang;
        if (currentLanguage || currentLanguage == null || currentLanguage.Id != lang.Id) {
            $http({
                method: 'GET',
                url: $rootScope.serverURL + '/api/v1/Languages',
                withCredentials: true,
                params: { languageId: lang.Id }
            }).then(function (response, status) {
                currentLanguage = tempLanguage;
                sessionStore.session.add('CURRENTLANGUAGE', JSON.stringify(currentLanguage));
            }, function (error) { });
        }

    }

    //Get from current language cache, on browser refresh
    this.getCurrentLanguage = function () {
        if (!currentLanguage) {
            var langCache = sessionStore.session.get('CURRENTLANGUAGE');
            currentLanguage = JSON.parse(langCache);
        }
        return currentLanguage;
    }

    this.getDefaultLanguage = function () {
        return languages[0]; //Can we have a flag in table to set default?
    };

}]);

sharedModule.service('cityService', ['$http', '$rootScope', '$q', 'sessionStore',
function ($http, $rootScope, $q, sessionStore) {
    var cities = [];
    var deferred = $q.defer();

    this.getCities = function (searchText) {
        $http({
            method: 'GET',
            url: $rootScope.serverURL + '/api/v1/Cities?searchText=' + searchText,
            withCredentials: true
        }).then(
               function (response, status) {
                   cities = response.data;
                   deferred.resolve(cities);
               },
               function (error) {
                   //log error
                   deferred.reject();
               });

        return deferred.promise;
    }

    this.getCity = function (id) {
        var city = undefined;
        for (var a = 0; a < cities.length; a++) {
            if (cities[a].Id == id)
                city = cities[a];
        }
        return city;
    }

}]);