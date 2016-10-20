(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController",EditPageController);

    function PageListController($location,$routeParams,UserService,WebsiteService,PageService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var user = UserService.findUserById(userId);
        var websiteId = parseInt($routeParams.wid);
        var website = WebsiteService.findWebsiteById(websiteId);
        function init() {
            if (user !== null) {
                vm.userId = userId;
                if (website !== null){
                    vm.websiteId = websiteId;
                    vm.pages = PageService.findPagesByWebsiteId(websiteId);
                }else{
                    $location.url("/user/" + userId + "/website");
                }
            }else{
                $location.url("/login");
            }
        }
        init();
    }
    function NewPageController($location,$routeParams,UserService,WebsiteService,PageService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var user = UserService.findUserById(userId);
        var websiteId = parseInt($routeParams.wid);
        var website = WebsiteService.findWebsiteById(websiteId);
        vm.createPage = createPage;
        function init() {
            if (user !== null) {
                vm.userId = userId;
                if(website !== null){
                    vm.websiteId = websiteId;
                    vm.pages = PageService.findPagesByWebsiteId(websiteId);
                }else{
                    $location.url("/user/" + userId + "/website")
                }
            }else{
                $location.url("/login");
            }
        }
        init();
        function createPage(page) {
            if(page===undefined || page.name===null || page.name===undefined || page.name===""){
                vm.error="Must provide page name!";
            }else {
                PageService.createPage(vm.websiteId, page);
                $location.url("/user/" + userId + "/website/" + websiteId + "/page");
            }
        }
    }
    function EditPageController($location,$routeParams,UserService,WebsiteService,PageService,WidgetService){
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var user = UserService.findUserById(userId);
        var websiteId = parseInt($routeParams.wid);
        var website = WebsiteService.findWebsiteById(websiteId);
        var pageId = parseInt($routeParams.pid);
        var page= PageService.findPageById(pageId);
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;
        function init() {
            if (user !== null) {
                vm.userId = userId;
                if (website !== null) {
                    vm.websiteId = websiteId;
                    vm.pages = PageService.findPagesByWebsiteId(websiteId);
                    if (page !== null){
                        vm.pageId = pageId;
                        vm.name = page.name;
                    }else{
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page");
                    }
                }else{
                    $location.url("/user/" + userId + "/website");
                }
            }else{
                $location.url("/login");
            }
        }
        init();
        function updatePage(pageName) {
            if(pageName===null || pageName===undefined || pageName===""){
                vm.error="Must provide page name!";
            }else {
                var page = {"name": pageName};
                PageService.updatePage(vm.pageId, page);
                $location.url("/user/" + userId + "/website/" + websiteId + "/page");
            }
        }
        function deletePage() {
            var widgets = WidgetService.findWidgetsByPageId(vm.pageId);
            for(var i = 0;i<widgets.length;i++){
                WidgetService.deleteWidget(widgets[i]._id);
            }
            PageService.deletePage(vm.pageId);
            $location.url("/user/" + userId + "/website/" + websiteId + "/page");
        }
    }
})();