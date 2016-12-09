module.exports = function(app,model) {

    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.get('/project/api/user', findUser);
    app.get('/project/api/user/:userId', findUserById);
    app.post('/project/api/user', createUser);
    app.delete('/project/api/user/:userId', deleteUser);
    app.put('/project/api/user/:userId', updateUser);
    app.post ('/project/api/upload', upload.single('myFile'), uploadImage);
    app.delete('/project/api/user/:userId/match/:matchId', deleteMatch);
    app.post('/project/api/user/:userId/match/calculate',calculateMatches);

    function isValidMatch(user1,user2){
        if(user1.gender==='FEMALE'){
            if(user1.orientation==='STRAIGHT'){
                if(user2.gender==='FEMALE'){
                    return false;
                }else{
                    if(user2.orientation==='GAY'){
                        return false;
                    }
                }
            }else if(user1.orientation==='GAY'){
                if(user2.gender==='MALE'){
                    return false;
                }else{
                    if(user2.orientation==='STRAIGHT'){
                        return false;
                    }
                }
            }else{
                if(user2.gender==='FEMALE'){
                    if(user2.orientation==='STRAIGHT'){
                        return false;
                    }
                }else{
                    if(user2.orientation==='GAY'){
                        return false;
                    }
                }
            }
        }else{
            if(user1.orientation==='STRAIGHT'){
                if(user2.gender==='MALE'){
                    return false;
                }else{
                    if(user2.orientation==='GAY'){
                        return false;
                    }
                }
            }else if(user1.orientation==='GAY'){
                if(user2.gender==='FEMALE'){
                    return false;
                }else{
                    if(user2.orientation==='STRAIGHT'){
                        return false;
                    }
                }
            }else{
                if(user2.gender==='MALE'){
                    if(user2.orientation==='STRAIGHT'){
                        return false;
                    }
                }else{
                    if(user2.orientation==='GAY'){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function compareBurritos(burrito1,burrito2){
        var numPreferencesSame = 0;
        if(burrito1.tortilla===burrito2.tortilla){
            numPreferencesSame++;
        }
        if(burrito1.rice===burrito2.rice){
            numPreferencesSame++;
        }
        if(burrito1.beans===burrito2.beans){
            numPreferencesSame++;
        }
        if(burrito1.meat===burrito2.meat){
            numPreferencesSame++;
        }
        if(burrito1.salsa===burrito2.salsa){
            numPreferencesSame++;
        }
        if(burrito1.cheese===burrito2.cheese){
            numPreferencesSame++;
        }
        if(burrito1.lettuce===burrito2.lettuce){
            numPreferencesSame++;
        }
        if(burrito1.guacamole===burrito2.guacamole){
            numPreferencesSame++;
        }
        if(burrito1.sourCream===burrito2.sourCream){
            numPreferencesSame++;
        }
        return numPreferencesSame;
    }

    function calculateMatches(req,res){
        var userId = req.params.userId;
        model.userModel
            .findUserById(userId)
            .then(function(user){
                if(user){
                    model.userModel.clearMatches(userId)
                        .then(function(retVal){
                            if(retVal){
                                model.burritoModel.findBurritoByUserId(userId)
                                    .then(function(burrito){
                                            if(burrito){
                                                model.burritoModel.findAllBurritos()
                                                    .then(function(burritos){
                                                            if(burritos){
                                                                for(var i=0;i<burritos.length;i++){
                                                                    var matchScore = compareBurritos(burrito,burritos[i]);
                                                                    if(matchScore >= 6){
                                                                        model.userModel.findUserById(burritos[i]._user)
                                                                            .then(function(match){
                                                                                    if(match){
                                                                                        if(isValidMatch(user,match) && user.username!==match.username){
                                                                                            model.userModel.createMatch(user._id,match._id)
                                                                                                .then(function(retVal){
                                                                                                        console.log("New match added!");
                                                                                                    },
                                                                                                    function(err){
                                                                                                        res.sendStatus(400).send(err);
                                                                                                    });
                                                                                        }
                                                                                    }else{
                                                                                        res.sendStatus(400);
                                                                                    }
                                                                                },
                                                                                function(err){
                                                                                    res.sendStatus(400).send(err);
                                                                                });
                                                                    }
                                                                }
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

    function deleteMatch(req,res){
        var userId = req.params.userId;
        var matchId = req.params.matchId;
        model.userModel
            .deleteMatch(userId,matchId)
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

    function uploadImage(req, res) {
        var userId        = req.body.userId;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;
        var relPath = "../uploads/" + filename;
        model.userModel
            .uploadImage(userId,relPath)
            .then(function(retVal){
                    if(retVal){
                        res.redirect("../#/user/" + userId);
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.redirect("../#/");
                });
    }

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