(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController",EditWidgetController);

    function WidgetListController($sce,$location,$routeParams,UserService,WebsiteService,PageService,WidgetService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var user = UserService.findUserById(userId);
        var websiteId = parseInt($routeParams.wid);
        var website = WebsiteService.findWebsiteById(websiteId);
        var pageId = parseInt($routeParams.pid);
        var page = PageService.findPageById(pageId);
        function init() {
            if (user !== null) {
                vm.userId = userId;
                if (website !== null){
                    vm.websiteId = websiteId;
                    if (page !== null){
                        vm.pageId = pageId;
                        vm.widgets = WidgetService.findWidgetsByPageId(pageId);
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
    }
    function NewWidgetController($location,$routeParams,UserService,WebsiteService,PageService,WidgetService){
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var user = UserService.findUserById(userId);
        var websiteId = parseInt($routeParams.wid);
        var website = WebsiteService.findWebsiteById(websiteId);
        var pageId = parseInt($routeParams.pid);
        var page = PageService.findPageById(pageId);
        vm.createHeader = createHeader;
        vm.createImage = createImage;
        vm.createYoutube = createYoutube;
        function init() {
            if (user !== null) {
                vm.userId = userId;
                if(website !== null){
                    vm.websiteId = websiteId;
                    if(pageId !== null){
                        vm.pageId = pageId;
                    }else{
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page");
                    }
                }else{
                    $location.url("/user/" + userId + "/website")
                }
            }else{
                $location.url("/login");
            }
        }
        init();
        function createHeader() {
            vm.header = {"widgetType" : "HEADER"};
            var newHeader = WidgetService.createWidget(vm.pageId, vm.header);
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + newHeader._id);
        }
        function createImage() {
            vm.image = {"widgetType" : "IMAGE"};
            var newImage = WidgetService.createWidget(vm.pageId, vm.image);
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + newImage._id);
        }
        function createYoutube() {
            vm.youtube = {"widgetType" : "YOUTUBE"};
            var newYoutube = WidgetService.createWidget(vm.pageId, vm.youtube);
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + newYoutube._id);
        }
    }
    function EditWidgetController($location,$routeParams,UserService,WebsiteService,PageService,WidgetService){
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var user = UserService.findUserById(userId);
        var websiteId = parseInt($routeParams.wid);
        var website = WebsiteService.findWebsiteById(websiteId);
        var pageId = parseInt($routeParams.pid);
        var page= PageService.findPageById(pageId);
        var widgetId = parseInt($routeParams.wgid);
        var widget = WidgetService.findWidgetById(widgetId);
        vm.updateHeader = updateHeader;
        vm.updateImage = updateImage;
        vm.updateYoutube = updateYoutube;
        vm.deleteWidget = deleteWidget;
        function init() {
            if (user !== null) {
                vm.userId = userId;
                if (website !== null) {
                    vm.websiteId = websiteId;
                    if (page !== null){
                        vm.pageId = pageId;
                        if (widget !== null){
                            vm.widgetId = widgetId;
                            vm.url = widget.url;
                            vm.width = widget.width;
                            vm.size = widget.size;
                            vm.text = widget.text;
                            vm.widgetType = widget.widgetType;
                        }else{
                            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
                        }
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
        function updateHeader(size,text) {
            var header = {"size" : size,"text" : text};
            WidgetService.updateWidget(vm.widgetId, header);
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
        }
        function updateImage(width,url) {
            var image = {"width" : width,"url" : url};
            WidgetService.updateWidget(vm.widgetId, image);
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
        }
        function updateYoutube(width,url) {
            var youtube = {"width" : width,"url" : url};
            WidgetService.updateWidget(vm.widgetId, youtube);
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
        }
        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetId);
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
        }
    }
})();