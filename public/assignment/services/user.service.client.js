(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    function UserService() {
        var users = [
                {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
                {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
                {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
                {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
            ];
        var api = {
            createUser : createUser,
            findUserById : findUserById,
            findUserByUsername: findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser : updateUser,
            deleteUser : deleteUser
    };
        return api;
        function createUser(user) {
            user._id = parseInt(users[users.length-1]._id) + 1;
            users.push(user);
            return user;
        }
        function findUserById(userId) {
            for(var i = 0; i < users.length; i++){
                if(parseInt(users[i]._id)===parseInt(userId)){
                    return users[i];
                    break;
                }
            }
            return null;
        }
        function findUserByUsername(username) {
            for(var i = 0; i < users.length; i++){
                if(users[i].username===username){
                    return users[i];
                    break;
                }
            }
            return null;
        }

        function findUserByCredentials(username, password, callback){
            for(var i=0; i<users.length; i++){
                if(users[i].username === username && users[i].password===password){
                    callback(users[i]);
                    return;
                }
            }
            callback(null);
        }

        function updateUser(userId,user) {
            for(var i = 0; i < users.length; i++){
                if(parseInt(users[i]._id)===parseInt(userId)){
                    user._id = users[i]._id;
                    user.username = users[i].username;
                    user.password = users[i].password;
                    users.splice(i,1,user);
                    break;
                }
            }
        }
        function deleteUser(userId) {
            for(var i = 0; i < users.length; i++){
                if(parseInt(users[i]._id)===parseInt(userId)){
                    users.splice(i,1);
                    break;
                }
            }
        }
    }
})();