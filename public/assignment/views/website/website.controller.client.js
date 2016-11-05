(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController",EditWebsiteController);

    function WebsiteListController($location,$routeParams, UserService,WebsiteService) {
        var vm = this;
        function init() {
            var userId = parseInt($routeParams.uid);
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise = WebsiteService.findWebsitesByUserId(userId);
                        promise
                            .success(function(websites){
                                vm.websites = websites;
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
    }
    function NewWebsiteController($location,$routeParams,UserService,WebsiteService) {
        var vm = this;
        vm.createWebsite = createWebsite;
        function init() {
            var userId = parseInt($routeParams.uid);
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise = WebsiteService.findWebsitesByUserId(userId);
                        promise
                            .success(function(websites){
                                vm.websites = websites;
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
        function createWebsite(website) {
            if(website===undefined || website.name===null || website.name===undefined || website.name===""){
                vm.error = "Must provide website name!";
            }else {
                WebsiteService.createWebsite(vm.userId, website)
                    .success(function(){
                        $location.url("/user/" + vm.userId + "/website");
                    })
                    .error(function(){

                    });
            }
        }
    }
    function EditWebsiteController($location,$routeParams,UserService,WebsiteService,PageService,WidgetService){
        var vm = this;
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;
        function init() {
            var userId = parseInt($routeParams.uid);
            var websiteId = parseInt($routeParams.wid);
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user) {
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise1 = WebsiteService.findWebsitesByUserId(userId);
                        promise1
                            .success(function (websites) {
                                vm.websites = websites;
                            })
                            .error(function () {

                            });
                        var promise2 = WebsiteService.findWebsiteById(websiteId);
                        promise2
                            .success(function (website) {
                                if (website !== '0') {
                                    vm.websiteId = websiteId;
                                    vm.name = website.name;
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
                .error(function(){

                });
        }
        init();
        function updateWebsite(websiteName) {
            if(websiteName===null || websiteName===undefined || websiteName===""){
                vm.error = "Must provide website name!";
            }else {
                var website = {"name": websiteName};
                WebsiteService.updateWebsite(vm.websiteId, website)
                    .success(function(){
                        $location.url("/user/" + vm.userId + "/website");
                    })
                    .error(function(){

                    });
            }
        }
        function deleteWebsite() {
            var pages = PageService.findPagesByWebsiteId(vm.websiteId);
            for(var i = 0;i<pages.length;i++){
                var widgets = WidgetService.findWidgetsByPageId(pages[i]._id);
                for(var j = 0;j<widgets.length;j++){
                    WidgetService.deleteWidget(widgets[j]._id);
                }
                PageService.deletePage(pages[i]._id);
            }
            WebsiteService.deleteWebsite(vm.websiteId)
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website");
                })
                .error(function(){

                });
        }
    }
})();