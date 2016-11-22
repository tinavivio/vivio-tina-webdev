module.exports = function(app,model) {

    app.get('/assignment/api/website/:websiteId/page', findAllPagesForWebsite);
    app.post('/assignment/api/website/:websiteId/page', createPage);
    app.get('/assignment/api/page/:pageId', findPageById);
    app.delete('/assignment/api/page/:pageId',deletePage);
    app.put('/assignment/api/page/:pageId',updatePage);
    function deletePage(req,res){
        var pageId = req.params.pageId;
        model.pageModel
            .deletePage(pageId)
            .then(function(retVal){
                    if(retVal){
                        res.sendStatus(204);
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
    function updatePage(req,res){
        var pageId = req.params.pageId;
        var page = req.body;
        model.pageModel
            .updatePage(pageId,page)
            .then(function(retVal){
                    if(retVal){
                        res.sendStatus(200);
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
    function createPage(req,res) {
        var websiteId = req.params.websiteId;
        var page = req.body;
        model.pageModel
            .createPage(websiteId,page)
            .then(function(retVal){
                    if(retVal){
                        res.sendStatus(201).send(retVal);
                    }else{
                        res.send('0');
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
    function findAllPagesForWebsite(req,res) {
        var websiteId = req.params.websiteId;
        model.pageModel
            .findAllPagesForWebsite(websiteId)
            .then(function(retVal){
                    if(retVal){
                        res.send(retVal);
                    }else{
                        res.send('0');
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function findPageById(req,res) {
        var pageId = req.params.pageId;
        model.pageModel
            .findPageById(pageId)
            .then(function(retVal){
                    if(retVal){
                        res.send(retVal);
                    }else{
                        res.send('0');
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
};