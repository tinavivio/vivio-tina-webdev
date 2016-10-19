(function() {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);
    function PageService() {
        var pages = [
                { "_id": "321", "name": "Post 1", "websiteId": "456" },
                { "_id": "432", "name": "Post 2", "websiteId": "456" },
                { "_id": "543", "name": "Post 3", "websiteId": "456" }
            ]
            ;
        var api = {
            createPage : createPage,
            findPagesByWebsiteId : findPagesByWebsiteId,
            findPageById: findPageById,
            updatePage : updatePage,
            deletePage : deletePage
        };
        return api;
        function createPage(websiteId,page) {
            page._id = parseInt(pages[pages.length-1]._id) + 1;
            page.websiteId=websiteId;
            pages.push(page);
        }
        function findPagesByWebsiteId(websiteId) {
            var arr = [];
            for(var i = 0; i < pages.length; i++){
                if(parseInt(pages[i].websiteId)===parseInt(websiteId)){
                    arr.push(pages[i]);
                }
            }
            return arr;
        }
        function findPageById(pageId) {
            for(var i = 0; i < pages.length; i++){
                if(parseInt(pages[i]._id)===parseInt(pageId)){
                    return pages[i];
                    break;
                }
            }
            return null;
        }
        function updatePage(pageId,page) {
            for(var i = 0; i < pages.length; i++){
                if(parseInt(pages[i]._id)===parseInt(pageId)){
                    page._id = pages[i]._id;
                    page.websiteId = pages[i].websiteId;
                    pages.splice(i,1,page);
                    break;
                }
            }
        }
        function deletePage(pageId) {
            for(var i = 0; i < pages.length; i++){
                if(parseInt(pages[i]._id)===parseInt(pageId)){
                    pages.splice(i,1);
                    break;
                }
            }
        }
    }
})();