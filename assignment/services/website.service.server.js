module.exports = function(app,model) {

    app.get('/assignment/api/user/:userId/website', findAllWebsitesForUser);
    app.post('/assignment/api/user/:userId/website', createWebsite);
    app.get('/assignment/api/website/:websiteId', findWebsiteById);
    app.delete('/assignment/api/website/:websiteId',deleteWebsite);
    app.put('/assignment/api/website/:websiteId',updateWebsite);
    function deleteWebsite(req,res){
        var websiteId = req.params.websiteId;
        model.websiteModel
            .deleteWebsite(websiteId)
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
    function updateWebsite(req,res){
        var websiteId = req.params.websiteId;
        var website = req.body;
        model.websiteModel
            .updateWebsite(websiteId,website)
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
    function createWebsite(req,res) {
        var userId = req.params.userId;
        var website = req.body;
        model.websiteModel
            .createWebsiteForUser(userId,website)
            .then(function(retVal){
                    if(retVal){
                        res.sendStatus(201).send(retVal);
                    }else{
                        res.sendStatus(400).send('0');
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
    function findAllWebsitesForUser(req,res) {
        var userId = req.params.userId;
        model.websiteModel
            .findAllWebsitesForUser(userId)
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

    function findWebsiteById(req,res) {
        var websiteId = req.params.websiteId;
        model.websiteModel
            .findWebsiteById(websiteId)
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