module.exports = function(app,model) {

    app.get('/assignment/api/user', findUser);
    app.get('/assignment/api/user/:userId', findUserById);
    app.post('/assignment/api/user', createUser);
    app.delete('/assignment/api/user/:userId',deleteUser);
    app.put('/assignment/api/user/:userId',updateUser);
    function deleteUser(req,res){
        var userId = req.params.userId;
        model.userModel
            .deleteUser(userId)
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
    function updateUser(req,res){
        var userId = req.params.userId;
        var user = req.body;
        model.userModel
            .updateUser(userId,user)
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
    function createUser(req,res){
        var user = req.body;
        model.userModel
            .findUserByUsername(user.username)
            .then(function(retVal) {
                    if (retVal) {
                        res.sendStatus(400).send("User already created!");
                    } else {
                        model.userModel
                            .createUser(user)
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
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function findUser(req, res){
        var query = req.query;
        if(query.password && query.username){
            findUserByCredentials(req,res);
        }else if(query.username){
            findUserByUsername(req,res);
        }
    }
    function findUserByUsername(req,res){
        var username = req.query.username;
        model.userModel
            .findUserByUsername(username)
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
    function findUserByCredentials(req,res){
        var username = req.query.username;
        var password = req.query.password;
        model.userModel
            .findUserByCredentials(username,password)
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
    function findUserById(req,res){
        var userId = req.params.userId;
        model.userModel
            .findUserById(userId)
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