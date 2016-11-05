(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController",EditWidgetController);

    function WidgetListController($location,$routeParams,UserService,WebsiteService,PageService,WidgetService) {
        var vm = this;
        vm.validateUrl = validateUrl;
        vm.sortWidgets = sortWidgets;
        function init() {
            var userId = parseInt($routeParams.uid);
            var websiteId = parseInt($routeParams.wid);
            var pageId = parseInt($routeParams.pid);
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise1 = WebsiteService.findWebsiteById(websiteId);
                        promise1
                            .success(function(website){
                                if (website !== '0'){
                                    vm.websiteId = websiteId;
                                    var promise2 = PageService.findPageById(pageId);
                                    promise2
                                        .success(function(page){
                                            if (page !== '0'){
                                                vm.pageId = pageId;
                                                var promise3 = WidgetService.findWidgetsByPageId(pageId);
                                                promise3
                                                    .success(function(widgets){
                                                        vm.widgets = widgets;
                                                    })
                                                    .error(function(){

                                                    });
                                            }else{
                                                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                                            }
                                        })
                                        .error(function(){

                                        });
                                }else{
                                    $location.url("/user/" + vm.userId + "/website");
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
        function validateUrl(url){
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            var validatedUrl = "https://www.youtube.com/embed/" + match[2];
            return validatedUrl;
        }
        function sortWidgets(start, end) {
            WidgetService.sortWidgets(vm.pageId, start,end)
                .success(function(){

                })
                .error(function(){

                });
        }
    }
    function NewWidgetController($location,$routeParams,UserService,WebsiteService,PageService,WidgetService){
        var vm = this;
        vm.createHeader = createHeader;
        vm.createImage = createImage;
        vm.createYoutube = createYoutube;
        function init() {
            var userId = parseInt($routeParams.uid);
            var websiteId = parseInt($routeParams.wid);
            var pageId = parseInt($routeParams.pid);
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise1 = WebsiteService.findWebsiteById(websiteId);
                        promise1
                            .success(function(website){
                                if (website !== '0'){
                                    vm.websiteId = websiteId;
                                    var promise2 = PageService.findPageById(pageId);
                                    promise2
                                        .success(function(page){
                                            if (page !== '0'){
                                                vm.pageId = pageId;
                                            }else{
                                                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                                            }
                                        })
                                        .error(function(){

                                        });
                                }else{
                                    $location.url("/user/" + vm.userId + "/website");
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
        function createHeader() {
            vm.header = {"widgetType" : "HEADER"};
            var promise = WidgetService.createWidget(vm.pageId, vm.header);
            promise
                .success(function(newHeader){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + newHeader._id);
                })
                .error(function(){

                });
        }
        function createImage() {
            vm.image = {"widgetType" : "IMAGE"};
            var promise = WidgetService.createWidget(vm.pageId, vm.image);
            promise
                .success(function(newImage){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + newImage._id);
                })
                .error(function(){

                });
        }
        function createYoutube() {
            vm.youtube = {"widgetType" : "YOUTUBE"};
            var promise = WidgetService.createWidget(vm.pageId, vm.youtube);
            promise
                .success(function(newYoutube){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + newYoutube._id);
                })
                .error(function(){

                });
        }
    }
    function EditWidgetController($location,$routeParams,UserService,WebsiteService,PageService,WidgetService){
        var vm = this;
        vm.updateHeader = updateHeader;
        vm.updateImage = updateImage;
        vm.updateYoutube = updateYoutube;
        vm.deleteWidget = deleteWidget;
        function init() {
            var userId = parseInt($routeParams.uid);
            var websiteId = parseInt($routeParams.wid);
            var pageId = parseInt($routeParams.pid);
            var widgetId = parseInt($routeParams.wgid);
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise1 = WebsiteService.findWebsiteById(websiteId);
                        promise1
                            .success(function(website){
                                if (website !== '0'){
                                    vm.websiteId = websiteId;
                                    var promise2 = PageService.findPageById(pageId);
                                    promise2
                                        .success(function(page){
                                            if (page !== '0'){
                                                vm.pageId = pageId;
                                                var promise3 = WidgetService.findWidgetById(widgetId);
                                                promise3
                                                    .success(function(widget){
                                                        if (widget !== '0'){
                                                            vm.widgetId = widgetId;
                                                            vm.name = widget.name;
                                                            vm.url = widget.url;
                                                            vm.width = widget.width;
                                                            vm.size = widget.size;
                                                            vm.text = widget.text;
                                                            vm.widgetType = widget.widgetType;
                                                        }else{
                                                            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                                                        }
                                                    })
                                                    .error(function(){

                                                    });
                                            }else{
                                                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                                            }
                                        })
                                        .error(function(){

                                        });
                                }else{
                                    $location.url("/user/" + vm.userId + "/website");
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
        function updateHeader(size,text) {
            if(text===null || text===undefined || text===""){
                vm.error="Must provide header text!";
            } else if(size === null || size === undefined || size === "" || parseInt(size) < 1 || parseInt(size) > 6){
                vm.error="Header size must be between 1 and 6!";
            }else {
                var header = {"size": size, "text": text};
                WidgetService.updateWidget(vm.widgetId, header)
                    .success(function(){
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                    })
                    .error(function(){

                    });
            }
        }
        function updateImage(width,url,name) {
            var promise = WidgetService.findWidgetById(vm.widgetId);
            promise
                .success(function(widget) {
                    if ((url === null || url === undefined || url === "") && (widget.url === null || widget.url === undefined || widget.url === "")) {
                        vm.error = "Must provide image link!";
                    } else if (width === null || width === undefined || width === "" || parseInt(width) < 1 || parseInt(width) > 100) {
                        vm.error = "Image width must be between 1 and 100!";
                    } else {
                        if ((widget.url !== null && widget.url !== undefined || widget.url !== "") && (url === null || url === undefined || url === "")) {
                            url = widget.url;
                        }
                        var image = {"width": width, "url": url, "name": name};
                        WidgetService.updateWidget(vm.widgetId, image)
                            .success(function () {
                                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                            })
                            .error(function () {

                            });
                    }
                })
                .error(function(){

                });
        }
        function updateYoutube(width,url) {
            if(url===null || url===undefined || url===""){
                vm.error="Must provide Youtube link!";
            }else if (width === null || width === undefined || width === "" || parseInt(width) < 1 || parseInt(width) > 100) {
                vm.error="Video width must be between 1 and 100!";
            }else{
                var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                var match = url.match(regExp);
                if (match && match[2].length == 11) {
                    var youtube = {"width": width, "url": url};
                    WidgetService.updateWidget(vm.widgetId, youtube)
                        .success(function(){
                            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                        })
                        .error(function(){

                        });
                }else{
                    vm.error="Youtube link not valid!";
                }
            }
        }
        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetId)
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                })
                .error(function(){

                });
        }
    }
})();