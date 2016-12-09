(function() {
    angular
        .module("BurritoMatchMaker")
        .controller("ZomatoSearchController", ZomatoSearchController);

    function ZomatoSearchController($location,$routeParams,UserService,ZomatoService) {
        var vm = this;
        vm.searchRestaurants = searchRestaurants;
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

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            WidgetService
                .selectPhoto(vm.widgetId, {url: url})
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                })
                .error(function(){

                });
        }
    }
})();
