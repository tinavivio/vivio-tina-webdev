(function() {
    angular
        .module("BurritoMatchMaker")
        .controller("NewBurritoController", NewBurritoController)
        .controller("EditBurritoController",EditBurritoController);

    function NewBurritoController($location,$routeParams,$rootScope,UserService,BurritoService) {
        var vm = this;
        vm.createBurrito = createBurrito;
        vm.logout = logout;
        function init() {
            var userId = $routeParams.uid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

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
        function createBurrito(burrito) {
            if(burrito===undefined || burrito.tortilla === null || burrito.tortilla ===undefined || burrito.tortilla ==="" ||
                burrito.beans === null || burrito.beans ===undefined || burrito.beans ==="" ||
                burrito.rice === null || burrito.rice ===undefined || burrito.rice ==="" ||
                burrito.meat === null || burrito.meat ===undefined || burrito.meat ==="" ||
                burrito.salsa === null || burrito.salsa ===undefined || burrito.salsa ===""){
                vm.error="Must provide answers to all questions!";
            }else {
                BurritoService.createBurritoForUser(vm.userId, burrito)
                    .success(function(){
                        UserService.calculateMatches(vm.userId)
                            .success(function(){
                                $location.url("/user/" + vm.userId);
                            })
                            .error(function(){

                            });
                    })
                    .error(function(){

                    });
            }
        }
    }
    function EditBurritoController($location,$routeParams,$rootScope,UserService,BurritoService){
        var vm = this;
        vm.updateBurrito = updateBurrito;
        vm.logout = logout;
        function init() {
            var userId = $routeParams.uid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise1 = BurritoService.findBurritoByUserId(vm.userId);
                        promise1
                            .success(function (burrito) {
                                if (burrito !== '0') {

                                } else {
                                    $location.url("/user/" + vm.userId);
                                }
                            })
                            .error(function () {

                            });
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

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
        function updateBurrito(tortilla,rice,beans,meat,salsa,lettuce,cheese,sourCream,guacamole) {
            if(tortilla === null || tortilla ===undefined || tortilla ==="" ||
                beans === null || beans ===undefined || beans ==="" ||
                rice === null || rice ===undefined || rice ==="" ||
                meat === null || meat ===undefined || meat ==="" ||
                salsa === null || salsa ===undefined || salsa ===""){
                vm.error="Must provide answers to all questions!";
            }else {
                var burrito = {"tortilla":tortilla,"rice":rice,"beans":beans,"meat":meat,"salsa":salsa,"lettuce":lettuce,"sourCream":sourCream,"cheese":cheese,"guacamole":guacamole};
                BurritoService.updateBurrito(vm.userId, burrito)
                    .success(function(){
                        $location.url("/user/" + vm.userId);
                    })
                    .error(function(){

                    });
            }
        }
    }
})();