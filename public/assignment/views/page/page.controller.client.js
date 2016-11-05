(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController",EditPageController);

    function PageListController($location,$routeParams,UserService,WebsiteService,PageService) {
        var vm = this;
        function init() {
            var userId = parseInt($routeParams.uid);
            var websiteId = parseInt($routeParams.wid);
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise1 = WebsiteService.findWebsiteById(websiteId);
                        promise1
                            .success(function (website) {
                                if (website !== '0') {
                                    vm.websiteId = websiteId;
                                    var promise2 = PageService.findPagesByWebsiteId(websiteId);
                                    promise2
                                        .success(function(pages){
                                            vm.pages = pages;
                                        })
                                        .error(function(){

                                        });
                                } else {
                                    $location.url("/user/" + vm.userId + "/website");
                                }
                            })
                            .error(function () {

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
    function NewPageController($location,$routeParams,UserService,WebsiteService,PageService) {
        var vm = this;
        vm.createPage = createPage;
        function init() {
            var userId = parseInt($routeParams.uid);
            var websiteId = parseInt($routeParams.wid);
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise1 = WebsiteService.findWebsiteById(websiteId);
                        promise1
                            .success(function (website) {
                                if (website !== '0') {
                                    vm.websiteId = websiteId;
                                    var promise2 = PageService.findPagesByWebsiteId(websiteId);
                                    promise2
                                        .success(function(pages){
                                            vm.pages = pages;
                                        })
                                        .error(function(){

                                        });
                                } else {
                                    $location.url("/user/" + vm.userId + "/website");
                                }
                            })
                            .error(function () {

                            });
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

                });
        }
        init();
        function createPage(page) {
            if(page===undefined || page.name===null || page.name===undefined || page.name===""){
                vm.error="Must provide page name!";
            }else {
                PageService.createPage(vm.websiteId, page)
                    .success(function(){
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    })
                    .error(function(){

                    });
            }
        }
    }
    function EditPageController($location,$routeParams,UserService,WebsiteService,PageService,WidgetService){
        var vm = this;
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;
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
                            .success(function (website) {
                                if (website !== '0') {
                                    vm.websiteId = websiteId;
                                    var promise2 = PageService.findPagesByWebsiteId(websiteId);
                                    promise2
                                        .success(function(pages){
                                            vm.pages = pages;
                                        })
                                        .error(function(){

                                        });
                                    var promise3 = PageService.findPageById(pageId);
                                    promise3
                                        .success(function(page){
                                            if (page !== '0'){
                                                vm.pageId = pageId;
                                                vm.name = page.name;
                                            }else{
                                                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                                            }
                                        })
                                        .error(function(){

                                        });
                                } else {
                                    $location.url("/user/" + vm.userId + "/website");
                                }
                            })
                            .error(function () {

                            });
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

                });
        }
        init();
        function updatePage(pageName) {
            if(pageName===null || pageName===undefined || pageName===""){
                vm.error="Must provide page name!";
            }else {
                var page = {"name": pageName};
                PageService.updatePage(vm.pageId, page)
                    .success(function(){
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    })
                    .error(function(){

                    });
            }
        }
        function deletePage() {
            var widgets = WidgetService.findWidgetsByPageId(vm.pageId);
            for(var i = 0;i<widgets.length;i++){
                WidgetService.deleteWidget(widgets[i]._id);
            }
            PageService.deletePage(vm.pageId)
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
                .error(function(){

                });
        }
    }
})();