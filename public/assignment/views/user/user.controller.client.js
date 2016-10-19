(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController",ProfileController);

    function LoginController($location,$window,UserService) {
        var vm = this;
        vm.login = login;
        function login() {
            UserService.findUserByCredentials(vm.user.username, vm.user.password,function(user){
                if(user!==null) {
                    $location.url("/user/" + user._id);
                } else {
                    $window.alert("Unable to login! User not recognized.");
                }
            });
        }
    }
    function RegisterController($location,$window,UserService) {
        var vm = this;
        vm.createUser = createUser;
        function createUser(user) {
            if(user.username===null || user.username===undefined || user.username==="" || user.password===null || user.password===undefined || user.password===""){
                $window.alert("Unable to register! Please provide both username and password.");
            }else if(user.password!==user.verifyPassword){
                $window.alert("Passwords must match!");
            }else {
                var newUser = UserService.createUser(user);
                $location.url("/user/" + newUser._id);
            }
        }
    }
    function ProfileController($location,$window,$routeParams,UserService){
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var user = UserService.findUserById(userId);
        vm.updateUser = updateUser;
        function init() {
            if (user !== null) {
                vm.userId = userId;
                vm.username = user.username;
                vm.firstName = user.firstName;
                vm.lastName = user.lastName;
            }else{
                $location.url("/login");
            }
        }
        init();
        function updateUser(firstName,lastName) {
            var user = {"firstName": firstName,"lastName" : lastName};
            UserService.updateUser(vm.userId, user);
            $window.alert("User details have been changed.");
        }
    }
})();