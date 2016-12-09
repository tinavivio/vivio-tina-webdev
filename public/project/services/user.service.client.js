(function() {
    angular
        .module("BurritoMatchMaker")
        .factory("UserService", UserService);
    function UserService($http) {
        var api = {
            createUser : createUser,
            findUserById : findUserById,
            findUserByUsername: findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser : updateUser,
            deleteUser : deleteUser,
            deleteMatch : deleteMatch,
            calculateMatches : calculateMatches
        };
        return api;
        function createUser(user) {
            return $http.post('/project/api/user', user);
        }
        function findUserById(userId) {
            var url = '/project/api/user/'+userId;
            return $http.get(url);
        }
        function findUserByUsername(username) {
            var url = '/project/api/user?username=' + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password){
            var url = '/project/api/user?username=' + username + '&password=' + password;
            return $http.get(url);
        }

        function updateUser(userId,user) {
            var url = '/project/api/user/'+userId;
            return $http.put(url,user);
        }
        function deleteUser(userId) {
            var url = '/project/api/user/'+userId;
            return $http.delete(url);
        }
        function deleteMatch(userId,matchId){
            var url = '/project/api/user/' + userId + '/match/' + matchId;
            return $http.delete(url);
        }
        function calculateMatches(userId){
            var url = '/project/api/user/' + userId + '/match/calculate';
            return $http.post(url);
        }
    }
})();