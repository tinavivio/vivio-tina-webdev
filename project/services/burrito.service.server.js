module.exports = function(app,model) {

    app.get('/project/api/user/:userId/burrito', findBurritoByUserId);
    app.post('/project/api/user/:userId/burrito', createBurritoForUser);
    app.put('/project/api/user/:userId/burrito', updateBurrito);
    app.get('/project/api/burrito',findAllBurritos);
    app.delete('/project/api/user/:userId/burrito',deleteBurrito);

    function findAllBurritos(req,res){
        model.burritoModel
            .findAllBurritos()
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

    function createBurritoForUser(req,res){
        var burrito = req.body;
        var userId = req.params.userId;
        model.burritoModel
            .createBurritoForUser(userId,burrito)
            .then(function (retVal) {
                    if (retVal) {
                        res.send(retVal);
                    } else {
                        res.send('0');
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                });
    }

    function updateBurrito(req,res){
        var userId = req.params.userId;
        var burrito = req.body;
        model.burritoModel
            .findBurritoByUserId(userId)
            .then(function(retVal){
                    if(retVal){
                        model.burritoModel
                            .updateBurrito(retVal._id,burrito)
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
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function deleteBurrito(req,res){
        var userId = req.params.userId;
        model.burritoModel
            .findBurritoByUserId(userId)
            .then(function(retVal){
                    if(retVal){
                        model.burritoModel
                            .deleteBurrito(retVal._id)
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
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function findBurritoByUserId(req,res){
        var userId = req.params.userId;
        model.burritoModel
            .findBurritoByUserId(userId)
            .then(
                function(retVal){
                    if(retVal){
                        res.send(retVal);
                    }else{
                        res.send('0');
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                }
            );
    }

};