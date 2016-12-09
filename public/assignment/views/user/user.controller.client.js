(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, $rootScope, UserService) {
        var vm = this;
        vm.login = login;
        function login() {
            if (vm.user === undefined || vm.user.username === null || vm.user.username === undefined || vm.user.username === "" || vm.user.password === null || vm.user.password === undefined || vm.user.username === "") {
                vm.error = "Cannot login without username and password.";
            } else {
                var user = {username: vm.user.username, password: vm.user.password};
                UserService
                    .login(user)
                    .then(
                        function (response) {
                            var user = response.data;
                            $rootScope.currentUser = user;
                            $location.url("/user/" + user._id);
                        },
                        function (error) {
                        });

                /*var promise = UserService.findUserByCredentials(vm.user.username, vm.user.password);
                 promise
                 .success(function (user) {
                 if (user !== '0') {
                 $location.url("/user/" + user._id);
                 } else {
                 vm.error = "Unable to login! User not recognized.";
                 }
                 })
                 .error(function(){

                 });*/
            }
        }
    }

    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.createUser = createUser;
        vm.register = register;
        function createUser(user) {
            if (user === undefined || user.username === null || user.username === undefined || user.username === "" || user.password === null || user.password === undefined || user.password === "") {
                vm.error = "Unable to register! Please provide both username and password.";
            } else if (user.password !== user.verifyPassword) {
                vm.error = "Passwords must match!";
            } else {
                var promise = UserService.createUser(user);
                promise
                    .success(function (newUser) {
                        $location.url("/user/" + newUser._id);
                    })
                    .error(function () {

                    });
            }
        }

        function register(user) {
            if (user === undefined || user.username === null || user.username === undefined || user.username === "" || user.password === null || user.password === undefined || user.password === "") {
                vm.error = "Unable to register! Please provide both username and password.";
            } else if (user.password !== user.verifyPassword) {
                vm.error = "Passwords must match!";
            } else {
                UserService
                    .register(user)
                    .then(
                        function (response) {
                            var user = response.data;
                            $rootScope.currentUser = user;
                            $location.url("/user/" + user._id);
                        });
            }
        }
    }

    function ProfileController($location, $routeParams, $rootScope, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        function init() {
            var userId = $routeParams.uid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function (user) {
                    if (user !== '0') {
                        vm.userId = userId;
                        vm.username = user.username;
                        vm.firstName = user.firstName;
                        vm.lastName = user.lastName;
                        vm.email = user.email;
                        vm.phone = user.phone;
                    } else {
                        $location.url("/login");
                    }
                })
                .error(function () {

                });
        }

        init();
        function updateUser(firstName, lastName, email, phone) {
            var user = {"firstName": firstName, "lastName": lastName, "email": email, "phone": phone};
            UserService.updateUser(vm.userId, user)
                .success(function () {
                    vm.notify = "User details have been changed successfully.";
                })
                .error(function () {

                });
        }

        function deleteUser() {
            UserService.deleteUser(vm.userId)
                .success(function () {
                    $location.url("/register");
                })
                .error(function () {

                });
        }

        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    });
        }
    }
})();