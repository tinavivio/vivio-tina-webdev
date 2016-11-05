(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    function WebsiteService($http) {

        var api = {
            createWebsite : createWebsite,
            findWebsitesByUserId : findWebsitesByUserId,
            findWebsiteById: findWebsiteById,
            updateWebsite : updateWebsite,
            deleteWebsite : deleteWebsite
        };
        return api;
        function createWebsite(userId,website) {
            var url = '/assignment/api/user/' + userId + '/website';
            return $http.post(url,website);
        }
        function findWebsitesByUserId(userId) {
            var url = '/assignment/api/user/' + userId + '/website';
            return $http.get(url);
        }
        function findWebsiteById(websiteId) {
            var url = '/assignment/api/website/' + websiteId;
            return $http.get(url);
        }
        function updateWebsite(websiteId,website) {
            var url = '/assignment/api/website/' + websiteId;
            return $http.put(url,website);
        }
        function deleteWebsite(websiteId) {
            var url = '/assignment/api/website/' + websiteId;
            return $http.delete(url);
        }
    }
})();