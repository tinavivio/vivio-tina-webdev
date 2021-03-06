(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    function UserService($http) {

        var api = {
            createUser : createUser,
            findUserById : findUserById,
            findUserByUsername: findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser : updateUser,
            deleteUser : deleteUser,
            login : login,
            logout : logout,
            register : register
        };
        return api;

        function login(user) {
            return $http.post("/assignment/api/login", user);
        }

        function logout(user) {
            return $http.post("/assignment/api/logout");
        }

        function register(user) {
            return $http.post("/assignment/api/register", user);
        }

        function createUser(user) {
            return $http.post('/assignment/api/user', user);
        }
        function findUserById(userId) {
            var url = '/assignment/api/user/'+userId;
            return $http.get(url);
        }
        function findUserByUsername(username) {
            var url = '/assignment/api/user?username=' + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password){
            var url = '/assignment/api/user?username=' + username + '&password=' + password;
            return $http.get(url);
        }

        function updateUser(userId,user) {
            var url = '/assignment/api/user/'+userId;
            return $http.put(url,user);
        }
        function deleteUser(userId) {
            var url = '/assignment/api/user/'+userId;
            return $http.delete(url);
        }
    }
})();