(function() {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);
    function PageService($http) {
        var api = {
            createPage : createPage,
            findPagesByWebsiteId : findPagesByWebsiteId,
            findPageById: findPageById,
            updatePage : updatePage,
            deletePage : deletePage
        };
        return api;
        function createPage(websiteId,page) {
            var url = '/assignment/api/website/' + websiteId + '/page';
            return $http.post(url,page);
        }
        function findPagesByWebsiteId(websiteId) {
            var url = '/assignment/api/website/' + websiteId + '/page';
            return $http.get(url);
        }
        function findPageById(pageId) {
            var url = '/assignment/api/page/' + pageId;
            return $http.get(url);
        }
        function updatePage(pageId,page) {
            var url = '/assignment/api/page/' + pageId;
            return $http.put(url,page);
        }
        function deletePage(pageId) {
            var url = '/assignment/api/page/' + pageId;
            return $http.delete(url);
        }
    }
})();