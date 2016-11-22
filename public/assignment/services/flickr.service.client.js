(function() {
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);
    function FlickrService($http) {
        var api = {
            searchPhotos: searchPhotos
        };
        return api;

        var key = "3e0dab196240adb2cb1d926b76a7f454";
        var secret = "ba6e43be1caff2b3";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

        function searchPhotos(searchTerm) {
            var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=3e0dab196240adb2cb1d926b76a7f454&text=" + searchTerm;
            //var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();