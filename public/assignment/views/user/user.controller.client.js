(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController",ProfileController);

    function LoginController($location,UserService) {
        var vm = this;
        vm.login = login;
        function login() {
            if(vm.user===undefined || vm.user.username===null || vm.user.username===undefined || vm.user.username==="" || vm.user.password===null|| vm.user.password===undefined || vm.user.username===""){
                vm.error="Cannot login without username and password.";
            }else {
                UserService.findUserByCredentials(vm.user.username, vm.user.password, function (user) {
                    if (user !== null) {
                        $location.url("/user/" + user._id);
                    } else {
                        vm.error = "Unable to login! User not recognized.";
                    }
                });
            }
        }
    }
    function RegisterController($location,UserService) {
        var vm = this;
        vm.createUser = createUser;
        function createUser(user) {
            if(user===undefined || user.username===null || user.username===undefined || user.username==="" || user.password===null || user.password===undefined || user.password===""){
                vm.error ="Unable to register! Please provide both username and password.";
            }else if(user.password!==user.verifyPassword){
                vm.error = "Passwords must match!";
            }else {
                var newUser = UserService.createUser(user);
                $location.url("/user/" + newUser._id);
            }
        }
    }
    function ProfileController($location,$routeParams,UserService){
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
            vm.notify= "User details have been changed successfully.";
        }
    }
})();