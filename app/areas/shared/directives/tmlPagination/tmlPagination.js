

sharedModule.directive('tmlPagination', ['$parse', 'listCacheService','sharedConstants',
    function ($parse, listCacheService, sharedConstants) {
    return {
        restrict: 'AE',
        scope: {
            apiUrl: '=tmlPaginationApiUrl', //to fetch data from API service
            filterParams: '=tmlPaginationFilterParams', //to pass filter in query string
            onPageChanges: '=tmlPaginationOnPageChanges', //when event on page change - handle with function(pageToShow)
            getPageOperations: '=tmlPaginationGetPageOperations'
        },
        templateUrl: 'app/shared/directives/tmlPagination/tmlPagination.html',
        link: function (scope, element, attrs) {
            var pageInfos = [];
            var pages = [];
            var splitedPages = [];
            var currentPage = {};
            

            var clientPageSize = sharedConstants.PageSize; 
            var serverPageSize = sharedConstants.ClientCacheSize;

            //sets current page and fires the page to subscribed event onPageChanges =tmlPaginationOnPageChanges
            var setCurrentPage = function (index) {
                if (splitedPages.length > index-1) {
                    currentPage = splitedPages[index - 1];

                    //Adding properties & functions to currentPage
                    currentPage.pageIndex = index;
                    currentPage.NoOfRecordsDownloaded = pageInfos.NoOfRecordsDownloaded;
                    //Refresh reloads from client cache
                    currentPage.refresh = function (pageIndexToLoad) {
                        pageInfos = [];
                        pages = [];
                        splitedPages = [];
                        currentPage = {};
                        loadPages(function () {
                            scope.currentPageIndex = pageIndexToLoad;
                            setCurrentPage(pageIndexToLoad);
                        });
                    };

                    currentPage.AddRecord = function () {
                        //TODO: Add record in respective page
                    }

                    currentPage.UpdateRecord = function (item,index) {
                        //TODO: Update record in respective page
                    }

                    currentPage.DeleteRecord = function (item, index) {
                        //TODO: Delete record in respective page
                    }

                    //When user searches, call this, filter object ll be taken fron scope.filterParams given in attr
                    currentPage.searchRecords = function () {
                        //TODO: have decide whether search should be made in server on client based on count
                        pageInfos = [];
                        pages = [];
                        splitedPages = [];
                        currentPage = {};
                        loadPages(function () {
                            scope.currentPageIndex = 1;
                            setCurrentPage(1);
                        });
                    }

                    //Pass the page to respective controller to bind in UI
                    scope.onPageChanges(currentPage);
                }
            }

            //Extracting data from server pageInfo page and into client pages
            var addPage = function (pageInfo) {
                pageInfos = pageInfo;//pageInfos.concat(pageInfo); removed this as we are not going to download other records //
                pages = pages.concat(pageInfo.Records);
                splitedPages = splitedPages.concat(pageInfo.Records.chunk(clientPageSize));
            }

            //Sends a request to service to load data from client cache, if not, from server
            var loadPages = function (callBack) {
                listCacheService.getPages(scope.apiUrl, scope.filterParams)
                    .then(
                   function (data) {
                       scope.totalRecordsInTable = data.NoOfRecordsDownloaded; //data.TotalCount is server record count;
                       if (data.NoOfRecordsDownloaded > 0) {
                           addPage(angular.copy(data));
                           callBack();
                       }
                       else {
                           //Adding properties & functions to currentPage
                           currentPage = [];
                           currentPage.pageIndex = 0;
                           currentPage.NoOfRecordsDownloaded = 0;
                           scope.onPageChanges(currentPage)
                       }
                   }, function (error) {
                       //log error
                      
                   });
            }

            if (scope.apiUrl)
            {
                //Things required by pagination directive used in template
                scope.totalRecordsInTable = 0; //ll be loaded in loadPages method
                scope.currentPageIndex = 0;
                scope.pageSize = clientPageSize;
                scope.pageChanged = function (newPageIndex) { //fired on page button click
                    if (splitedPages.length > newPageIndex-1) {
                        setCurrentPage(newPageIndex);
                    }
                    else {
                        //Removed loading again from server
                       // loadPages(function () {
                       //     setCurrentPage(newPageIndex);
                       // });
                    }
                }
                
                scope.canShowPages = function (totalRecordsInTable) {
                    return totalRecordsInTable > 0
                }

                //Initial request to load client cache
                loadPages(function () {
                    scope.currentPageIndex = 1;
                    setCurrentPage(1);
                });

                //Refresh reloads from client cache
                var operations = {
                    refresh: function (pageIndexToLoad) {
                        pageInfos = [];
                        pages = [];
                        splitedPages = [];
                        currentPage = {};
                        loadPages(function () {
                            scope.currentPageIndex = pageIndexToLoad;
                            setCurrentPage(pageIndexToLoad);
                        });
                    },

                    AddRecord: function () {
                        //TODO: Add record in respective page
                    },

                    UpdateRecord: function (item, index) {
                        //TODO: Update record in respective page
                    },

                    DeleteRecord: function (item, index) {
                        //TODO: Delete record in respective page
                    },

                    //When user searches, call this, filter object ll be taken fron scope.filterParams given in attr
                    searchRecords: function () {
                        //TODO: have decide whether search should be made in server on client based on count
                        pageInfos = [];
                        pages = [];
                        splitedPages = [];
                        currentPage = {};
                        loadPages(function () {
                            scope.currentPageIndex = 1;
                            setCurrentPage(1);
                        });
                    }
                }
                if (scope.getPageOperations && angular.isFunction(scope.getPageOperations))
                {
                    scope.getPageOperations(operations);
                }

            }

            
        }
    }
}]);

Array.prototype.chunk = function (n) {
    if (!this.length) {
        return [];
    }
    return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};