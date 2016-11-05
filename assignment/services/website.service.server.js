module.exports = function(app) {
    var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456" },
            { "_id": "234", "name": "Tweeter",     "developerId": "456" },
            { "_id": "456", "name": "Gizmodo",     "developerId": "456" },
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123" },
            { "_id": "678", "name": "Checkers",    "developerId": "123" },
            { "_id": "789", "name": "Chess",       "developerId": "234" }
        ];
    app.get('/assignment/api/user/:userId/website', findAllWebsitesForUser);
    app.post('/assignment/api/user/:userId/website', createWebsite);
    app.get('/assignment/api/website/:websiteId', findWebsiteById);
    app.delete('/assignment/api/website/:websiteId',deleteWebsite);
    app.put('/assignment/api/website/:websiteId',updateWebsite);
    function deleteWebsite(req,res){
        var websiteId = req.params.websiteId;
        for(var i = 0; i < websites.length; i++){
            if(parseInt(websites[i]._id)===parseInt(websiteId)){
                websites.splice(i,1);
                res.sendStatus(200);
                return;
            }
        }
    }
    function updateWebsite(req,res){
        var websiteId = req.params.websiteId;
        var website = req.body;
        for(var i = 0; i < websites.length; i++){
            if(parseInt(websites[i]._id)===parseInt(websiteId)){
                website._id = websites[i]._id;
                website.developerId = websites[i].developerId;
                websites.splice(i,1,website);
                res.sendStatus(200);
                return;
            }
        }
    }
    function createWebsite(req,res) {
        var userId = req.params.userId;
        var website = req.body;
        website._id = parseInt(websites[websites.length-1]._id) + 1;
        website.developerId=userId;
        websites.push(website);
        res.sendStatus(201);
    }
    function findAllWebsitesForUser(req,res) {
        var userId = req.params.userId;
        var arr = [];
        for(var i = 0; i < websites.length; i++){
            if(parseInt(websites[i].developerId)===parseInt(userId)){
                arr.push(websites[i]);
            }
        }
        res.send(arr);
    }

    function findWebsiteById(req,res) {
        var websiteId = req.params.websiteId;
        for(var i = 0; i < websites.length; i++){
            if(parseInt(websites[i]._id)===parseInt(websiteId)){
                res.send(websites[i]);
                return;
            }
        }
        res.send('0');
    }
};