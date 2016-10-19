(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    function WebsiteService() {
        var websites = [
                { "_id": "123", "name": "Facebook",    "developerId": "456" },
                { "_id": "234", "name": "Tweeter",     "developerId": "456" },
                { "_id": "456", "name": "Gizmodo",     "developerId": "456" },
                { "_id": "567", "name": "Tic Tac Toe", "developerId": "123" },
                { "_id": "678", "name": "Checkers",    "developerId": "123" },
                { "_id": "789", "name": "Chess",       "developerId": "234" }
            ]
            ;
        var api = {
            createWebsite : createWebsite,
            findWebsitesByUserId : findWebsitesByUserId,
            findWebsiteById: findWebsiteById,
            updateWebsite : updateWebsite,
            deleteWebsite : deleteWebsite
        };
        return api;
        function createWebsite(userId,website) {
            website._id = parseInt(websites[websites.length-1]._id) + 1;
            website.developerId=userId;
            websites.push(website);
        }
        function findWebsitesByUserId(userId) {
            var arr = [];
            for(var i = 0; i < websites.length; i++){
                if(parseInt(websites[i].developerId)===parseInt(userId)){
                    arr.push(websites[i]);
                }
            }
            return arr;
        }
        function findWebsiteById(websiteId) {
            for(var i = 0; i < websites.length; i++){
                if(parseInt(websites[i]._id)===parseInt(websiteId)){
                    return websites[i];
                    break;
                }
            }
            return null;
        }
        function updateWebsite(websiteId,website) {
            for(var i = 0; i < websites.length; i++){
                if(parseInt(websites[i]._id)===parseInt(websiteId)){
                    website._id = websites[i]._id;
                    website.developerId = websites[i].developerId;
                    websites.splice(i,1,website);
                    break;
                }
            }
        }
        function deleteWebsite(websiteId) {
            for(var i = 0; i < websites.length; i++){
                if(parseInt(websites[i]._id)===parseInt(websiteId)){
                    websites.splice(i,1);
                    break;
                }
            }
        }
    }
})();