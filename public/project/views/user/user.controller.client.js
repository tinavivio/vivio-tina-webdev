(function () {
    angular
        .module("BurritoMatchMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("AdminController", AdminController)
        .controller("MatchesController", MatchesController)
        .controller("MatchController", MatchController);

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
            }
        }
    }

    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.createUser = createUser;
        vm.register = register;
        function createUser(user) {
            if (user === undefined || user.username === null || user.username === undefined || user.username === "" || user.password === null || user.password === undefined || user.password === "" || user.gender === null || user.gender === undefined || user.gender === "" || user.orientation === null || user.orientation === undefined || user.orientation === "" || user.location === null || user.location === "" || user.location === undefined) {
                vm.error = "Unable to register! Please provide username, password, age, location, gender, and orientation to create an account.";
            } else if (user.age < 18) {
                vm.error = "Must be 18 years or older to register!";
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
            if (user === undefined || user.username === null || user.username === undefined || user.username === "" || user.password === null || user.password === undefined || user.password === "" || user.gender === null || user.gender === undefined || user.gender === "" || user.orientation === null || user.orientation === undefined || user.orientation === "" || user.location === null || user.location === "" || user.location === undefined || user.age === null || user.age === "" || user.age === undefined) {
                vm.error = "Unable to register! Please provide username, password, age, location, gender, and orientation to create an account.";
            } else if (user.age < 18) {
                vm.error = "Must be 18 years or older to register!";
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

    function MatchesController($location, $routeParams, $rootScope, UserService) {
        var vm = this;
        vm.logout = logout;
        function init() {
            var userId = $routeParams.uid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function (user) {
                    if (user !== '0') {
                        vm.userId = userId;
                        var arr = [];
                        for (i = 0; i < user.matches.length; i++) {
                            var promise1 = UserService.findUserById(user.matches[i]);
                            promise1
                                .success(function (match) {
                                    if (match !== '0') {
                                        arr.push(match);
                                    }
                                })
                                .error(function () {

                                });
                        }
                        vm.matches = arr;
                    } else {
                        $location.url("/login");
                    }
                })
                .error(function () {

                });
        }

        init();
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

    function MatchController($location, $routeParams, $rootScope, UserService) {
        var vm = this;
        vm.deleteMatch = deleteMatch;
        vm.logout = logout;
        function init() {
            var userId = $routeParams.uid;
            var matchId = $routeParams.mid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function (user) {
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise2 = UserService.findUserById(matchId);
                        promise2
                            .success(function (match) {
                                if (match !== '0') {
                                    vm.matchId = matchId;
                                    vm.username = match.username;
                                    vm.firstName = match.firstName;
                                    vm.lastName = match.lastName;
                                    vm.email = match.email;
                                    vm.phone = match.phone;
                                    vm.gender = match.gender;
                                    vm.orientation = match.orientation;
                                    vm.about = match.about;
                                    vm.photoUrl = match.photoUrl;
                                    vm.location = match.location;
                                    vm.age = match.age;
                                } else {
                                    $location.url("/user/" + vm.userId + "/match");
                                }
                            })
                            .error(function () {

                            });
                    } else {
                        $location.url("/login");
                    }
                })
                .error(function () {

                });
        }

        init();
        function deleteMatch() {
            UserService.deleteMatch(vm.userId, vm.matchId)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/match");
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

    function AdminController($location, $routeParams, $rootScope, UserService, BurritoService) {
        var vm = this;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        vm.formatDate = formatDate;
        function init() {
            var userId = $routeParams.uid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function (user) {
                    if (user !== '0') {
                        vm.userId = userId;
                        if (user.admin) {
                            var promise1 = UserService.findAllUsers();
                            promise1
                                .success(function (users) {
                                    if (users !== '0') {
                                        vm.users = users;
                                    }
                                })
                                .error(function () {

                                });
                        } else {
                            vm.error = "Must be an administrator to view this page!";
                        }
                    } else {
                        $location.url("/login");
                    }
                })
                .error(function () {

                });
        }

        init();
        function formatDate(date) {
            var formattedDate = new Date(date);
            return formattedDate.toDateString();
        }

        function deleteUser(userId) {
            BurritoService.findBurritoByUserId(userId)
                .success(function (burrito) {
                    if (burrito !== '0') {
                        BurritoService.deleteBurrito(userId)
                            .success(function () {
                                UserService.deleteUser(userId)
                                    .success(function () {
                                        vm.notify = "User has been successfully deleted!";
                                    })
                                    .error(function () {

                                    });
                            })
                            .error(function () {

                            });
                    } else {
                        UserService.deleteUser(userId)
                            .success(function () {
                                vm.notify = "User has been successfully deleted!";
                            })
                            .error(function () {

                            });
                    }
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

    function ProfileController($location, $routeParams, $rootScope, UserService, BurritoService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.calculateMatches = calculateMatches;
        vm.logout = logout;
        function init() {
            var userId = $routeParams.uid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function (user) {
                    if (user !== '0') {
                        vm.userId = userId;
                        vm.admin = user.admin;
                        vm.username = user.username;
                        vm.firstName = user.firstName;
                        vm.lastName = user.lastName;
                        vm.email = user.email;
                        vm.phone = user.phone;
                        vm.gender = user.gender;
                        vm.orientation = user.orientation;
                        vm.about = user.about;
                        vm.location = user.location;
                        vm.age = user.age;
                        vm.photoUrl = user.photoUrl;
                        var promise1 = BurritoService.findBurritoByUserId(vm.userId);
                        promise1
                            .success(function (burrito) {
                                if (burrito !== '0') {
                                    vm.burrito = burrito;
                                    vm.matches = user.matches;
                                }
                            })
                            .error(function () {

                            });
                    } else {
                        $location.url("/login");
                    }
                })
                .error(function () {

                });
        }

        init();
        function updateUser(firstName, lastName, email, phone, about, photoUrl, location, age) {
            if (location === null || location === "" || location === undefined || age === null || age === "" || age === undefined) {
                vm.error = "Please provide age and location.";
            } else if (age < 18) {
                vm.error = "Must be 18 years or older to have an account with us!";
            } else {
                vm.error = null;
                var user = {
                    "location": location,
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email,
                    "phone": phone,
                    "about": about,
                    "photoUrl": photoUrl,
                    "age": age
                };
                UserService.updateUser(vm.userId, user)
                    .success(function () {
                        vm.notify = "User details have been changed successfully.";
                    })
                    .error(function () {

                    });
            }
        }

        function deleteUser() {
            BurritoService.findBurritoByUserId(vm.userId)
                .success(function (burrito) {
                    if (burrito !== '0') {
                        BurritoService.deleteBurrito(vm.userId)
                            .success(function () {
                                UserService.deleteUser(vm.userId)
                                    .success(function () {
                                        $location.url("/register");
                                    })
                                    .error(function () {

                                    });
                            })
                            .error(function () {

                            });
                    } else {
                        UserService.deleteUser(vm.userId)
                            .success(function () {
                                $location.url("/register");
                            })
                            .error(function () {

                            });
                    }
                })
                .error(function () {

                });
        }

        function calculateMatches() {
            UserService.calculateMatches(vm.userId)
                .success(function () {
                    vm.notify = "Our matchmaking is complete. View your burrito soulmates below.";
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