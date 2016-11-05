module.exports = function(app) {
    var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456" },
            { "_id": "432", "name": "Post 2", "websiteId": "456" },
            { "_id": "543", "name": "Post 3", "websiteId": "456" }
        ];
    app.get('/assignment/api/website/:websiteId/page', findAllPagesForWebsite);
    app.post('/assignment/api/website/:websiteId/page', createPage);
    app.get('/assignment/api/page/:pageId', findPageById);
    app.delete('/assignment/api/page/:pageId',deletePage);
    app.put('/assignment/api/page/:pageId',updatePage);
    function deletePage(req,res){
        var pageId = req.params.pageId;
        for(var i = 0; i < pages.length; i++){
            if(parseInt(pages[i]._id)===parseInt(pageId)){
                pages.splice(i,1);
                res.sendStatus(200);
                return;
            }
        }
    }
    function updatePage(req,res){
        var pageId = req.params.pageId;
        var page = req.body;
        for(var i = 0; i < pages.length; i++){
            if(parseInt(pages[i]._id)===parseInt(pageId)){
                page._id = pages[i]._id;
                page.websiteId = pages[i].websiteId;
                pages.splice(i,1,page);
                res.sendStatus(200);
                return;
            }
        }
    }
    function createPage(req,res) {
        var websiteId = req.params.websiteId;
        var page = req.body;
        page._id = parseInt(pages[pages.length-1]._id) + 1;
        page.websiteId=websiteId;
        pages.push(page);
        res.sendStatus(201);
    }
    function findAllPagesForWebsite(req,res) {
        var websiteId = req.params.websiteId;
        var arr = [];
        for(var i = 0; i < pages.length; i++){
            if(parseInt(pages[i].websiteId)===parseInt(websiteId)){
                arr.push(pages[i]);
            }
        }
        res.send(arr);
    }

    function findPageById(req,res) {
        var pageId = req.params.pageId;
        for(var i = 0; i < pages.length; i++){
            if(parseInt(pages[i]._id)===parseInt(pageId)){
                res.send(pages[i]);
                return;
            }
        }
        res.send('0');
    }
};