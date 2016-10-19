(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController",EditWebsiteController);

    function WebsiteListController($location,$routeParams, UserService,WebsiteService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var user = UserService.findUserById(userId);
        function init() {
            if (user !== null) {
                vm.userId = userId;
                vm.websites = WebsiteService.findWebsitesByUserId(userId);
            }else{
                $location.url("/login");
            }
        }
        init();
    }
    function NewWebsiteController($location,$routeParams,UserService,WebsiteService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var user = UserService.findUserById(userId);
        vm.createWebsite = createWebsite;
        function init() {
            if (user !== null) {
                vm.userId = userId;
                vm.websites = WebsiteService.findWebsitesByUserId(userId);
            }else{
                $location.url("/login");
            }
        }
        init();
        function createWebsite(website) {
            WebsiteService.createWebsite(vm.userId, website);
            $location.url("/user/" + userId + "/website");
        }
    }
    function EditWebsiteController($location,$routeParams,UserService,WebsiteService,PageService,WidgetService){
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var user = UserService.findUserById(userId);
        var websiteId = parseInt($routeParams.wid);
        var website = WebsiteService.findWebsiteById(websiteId);
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;
        function init() {
            if (user !== null) {
                vm.userId = userId;
                vm.websites = WebsiteService.findWebsitesByUserId(userId);
                if (website !== null) {
                    vm.websiteId = websiteId;
                    vm.name = website.name;
                }else{
                    $location.url("/user/" + userId + "/website");
                }
            }else{
                $location.url("/login");
            }
        }
        init();
        function updateWebsite(websiteName) {
            var website = {"name" : websiteName};
            WebsiteService.updateWebsite(vm.websiteId, website);
            $location.url("/user/" + userId + "/website");
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
            WebsiteService.deleteWebsite(vm.websiteId);
            $location.url("/user/" + userId + "/website");
        }
    }
})();