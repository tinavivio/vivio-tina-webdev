(function() {
    angular
        .module("BurritoMatchMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController",ProfileController)
        .controller("MatchesController",MatchesController)
        .controller("MatchController",MatchController);

    function LoginController($location,UserService) {
        var vm = this;
        vm.login = login;
        function login() {
            if (vm.user === undefined || vm.user.username === null || vm.user.username === undefined || vm.user.username === "" || vm.user.password === null || vm.user.password === undefined || vm.user.username === "") {
                vm.error = "Cannot login without username and password.";
            } else {
                var promise = UserService.findUserByCredentials(vm.user.username, vm.user.password);
                 promise
                 .success(function (user) {
                 if (user !== '0') {
                 $location.url("/user/" + user._id);
                 } else {
                 vm.error = "Unable to login! User not recognized.";
                 }
                 })
                 .error(function(){

                 });
            }
        }
    }
    function RegisterController($location,UserService) {
        var vm = this;
        vm.createUser = createUser;
        function createUser(user) {
         if(user===undefined || user.username===null || user.username===undefined || user.username==="" || user.password===null || user.password===undefined || user.password==="" || user.gender===null || user.gender===undefined || user.gender==="" || user.orientation===null || user.orientation===undefined || user.orientation==="" || user.location===null || user.location==="" || user.location===undefined){
         vm.error ="Unable to register! Please provide username, password, age, location, gender, and orientation to create an account.";
         }else if(user.age<18){
             vm.error="Must be 18 years or older to register!";
         } else if(user.password!==user.verifyPassword){
         vm.error = "Passwords must match!";
         }else {
         var promise = UserService.createUser(user);
         promise
         .success(function(newUser) {
         $location.url("/user/" + newUser._id);
         })
         .error(function(){

         });
         }
         }
    }
    function MatchesController($location,$routeParams,UserService){
        var vm = this;
        function init() {
            var userId = $routeParams.uid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var arr = [];
                        for(i=0;i<user.matches.length;i++){
                            var promise1 = UserService.findUserById(user.matches[i]);
                            promise1
                                .success(function(match){
                                    if (match !== '0'){
                                        arr.push(match);
                                    }
                                })
                                .error(function(){

                                });
                        }
                        vm.matches = arr;
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

                });
        }
        init();
    }

    function MatchController($location,$routeParams,UserService){
        var vm = this;
        vm.deleteMatch = deleteMatch;
        function init() {
            var userId = $routeParams.uid;
            var matchId = $routeParams.mid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise2 = UserService.findUserById(matchId);
                        promise2
                            .success(function(match){
                                if(match !== '0'){
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
                                }else{
                                    $location.url("/user/" + vm.userId + "/match");
                                }
                            })
                            .error(function(){

                            });
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

                });
        }
        init();
        function deleteMatch(){
            UserService.deleteMatch(vm.userId,vm.matchId)
                .success(function(){
                    $location.url("/user/" + vm.userId + "/match");
                })
                .error(function(){

                });

        }
    }

    function ProfileController($location,$routeParams,UserService,BurritoService){
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.calculateMatches = calculateMatches;
        function init() {
            var userId = $routeParams.uid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
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
                            .success(function(burrito){
                                if(burrito !== '0'){
                                    vm.burrito = burrito;
                                    vm.matches = user.matches;
                                }
                            })
                            .error(function(){

                            });
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

                });
        }
        init();
        function updateUser(firstName,lastName,email,phone,about,photoUrl,location) {
            var user = {"location":location,"firstName": firstName,"lastName" : lastName,"email" : email, "phone" : phone,"about" : about,"photoUrl":photoUrl};
            UserService.updateUser(vm.userId, user)
                .success(function(){
                    vm.notify = "User details have been changed successfully.";
                })
                .error(function(){

                });
        }
        function deleteUser() {
            BurritoService.deleteBurrito(vm.userId)
                .success(function(){
                    UserService.deleteUser(vm.userId)
                        .success(function(){
                            $location.url("/register");
                        })
                        .error(function(){

                        });
                })
                .error(function(){

                });
        }
        function calculateMatches(){
            UserService.calculateMatches(vm.userId)
                .success(function(){
                    vm.notify = "Our matchmaking is complete. View your burrito soulmates below.";
                })
                .error(function(){

                });
        }
    }
})();