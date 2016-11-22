(function() {
    angular
        .module("WebAppMaker")
        .controller("FlickrImageSearchController", FlickrImageSearchController);

    function FlickrImageSearchController($location,$routeParams,UserService,WebsiteService,PageService,WidgetService,FlickrService) {
        var vm = this;
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;
        function init() {
            var userId = $routeParams.uid;
            var websiteId = $routeParams.wid;
            var pageId = $routeParams.pid;
            var widgetId = $routeParams.wgid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function (user) {
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise1 = WebsiteService.findWebsiteById(websiteId);
                        promise1
                            .success(function (website) {
                                if (website !== '0') {
                                    vm.websiteId = websiteId;
                                    var promise2 = PageService.findPageById(pageId);
                                    promise2
                                        .success(function (page) {
                                            if (page !== '0') {
                                                vm.pageId = pageId;
                                                var promise3 = WidgetService.findWidgetById(widgetId);
                                                promise3
                                                    .success(function (widget) {
                                                        if (widget !== '0') {
                                                            vm.widget = widget;
                                                            vm.widgetId = widgetId;
                                                        } else {
                                                            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                                                        }
                                                    })
                                                    .error(function () {

                                                    });
                                            } else {
                                                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                                            }
                                        })
                                        .error(function () {

                                        });
                                } else {
                                    $location.url("/user/" + vm.userId + "/website");
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

        function searchPhotos(searchTerm) {
            FlickrService
                .searchPhotos(searchTerm)
                .then(function (response) {
                    data = response.data.replace("jsonFlickrApi(", "");
                    data = data.substring(0, data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            WidgetService
                .updateWidget(vm.widgetId, {url: url})
                    .success(function(){
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                    })
                    .error(function(){

                    });
        }
    }
})();
