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
            calculateMatches : calculateMatches,
            findAllUsers : findAllUsers,
            login : login,
            logout : logout,
            register : register
        };
        return api;

        function findAllUsers(){
            return $http.get("/project/api/user");
        }

        function login(user) {
            return $http.post("/project/api/login", user);
        }

        function logout() {
            return $http.post("/project/api/logout");
        }

        function register(user) {
            return $http.post("/project/api/register", user);
        }

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