(function() {
    angular
        .module("BurritoMatchMaker")
        .factory("ZomatoService", ZomatoService);
    function ZomatoService($http) {
        var api = {
            findLocationIdByLocationName: findLocationIdByLocationName,
            searchRestaurantsByLocationId: searchRestaurantsByLocationId
        };
        return api;

        function findLocationIdByLocationName(searchTerm) {
            var url = "https://developers.zomato.com/api/v2.1/locations?query=" + searchTerm;
            return $http.get(url,{
                headers: {"user-key": "46896b93f8c60ce6f8c59cb8d81235b5"}});
        }

        function searchRestaurantsByLocationId(locationId){
            var url = "https://developers.zomato.com/api/v2.1/search?entity_id=" + locationId + "&entity_type=city&cuisines=73";
            return $http.get(url,{
                headers: {"user-key": "46896b93f8c60ce6f8c59cb8d81235b5"}});
        }
    }
})();