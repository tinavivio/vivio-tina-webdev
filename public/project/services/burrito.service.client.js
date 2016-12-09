(function() {
    angular
        .module("BurritoMatchMaker")
        .factory("BurritoService", BurritoService);
    function BurritoService($http) {
        var api = {
            createBurritoForUser : createBurritoForUser,
            findBurritoByUserId : findBurritoByUserId,
            updateBurrito : updateBurrito,
            deleteBurrito : deleteBurrito
        };
        return api;
        function deleteBurrito(userId){
            var url = '/project/api/user/' + userId + '/burrito';
            return $http.delete(url);
        }
        function createBurritoForUser(userId,burrito) {
            var url = '/project/api/user/' + userId + '/burrito';
            return $http.post(url,burrito);
        }
        function findBurritoByUserId(userId) {
            var url = '/project/api/user/' + userId+'/burrito';
            return $http.get(url);
        }

        function updateBurrito(userId,burrito){
            var url = '/project/api/user/' + userId + '/burrito';
            return $http.put(url,burrito);
        }
    }
})();