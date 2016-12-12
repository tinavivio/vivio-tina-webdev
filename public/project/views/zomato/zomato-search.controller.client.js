(function() {
    angular
        .module("BurritoMatchMaker")
        .controller("ZomatoSearchController", ZomatoSearchController);

    function ZomatoSearchController($location,$routeParams,$rootScope,UserService,ZomatoService,MessageService) {
        var vm = this;
        vm.searchRestaurants = searchRestaurants;
        vm.suggestRestaurant = suggestRestaurant;
        vm.logout = logout;
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
        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    });
        }
        function searchRestaurants(searchTerm) {
            ZomatoService
                .findLocationIdByLocationName(searchTerm)
                .then(function (response) {
                    ZomatoService
                        .searchRestaurantsByLocationId(response.data.location_suggestions[0].city_id)
                        .then(function(response2){
                            vm.restaurants = response2.data.restaurants;
                        })
                });
        }
    function suggestRestaurant(name,location){
        var text = "Hi! I would love to meet up for good Mexican food. I found a cool restaurant I'd like to try! Its name is " + name + " and it's located at " + location + ". When are you free to grab a bite and discuss our mutual love of burritos?";
        var message = {"subject":"Let's make a date!","text":text};
        MessageService.createMessage(vm.userId, vm.matchId,message)
            .success(function(){
                $location.url("/user/" + vm.userId +'/message/outbox');
            })
            .error(function(){

            });
    }

    }
})();
