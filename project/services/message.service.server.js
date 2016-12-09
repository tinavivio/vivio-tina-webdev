module.exports = function(app,model) {

    app.get('/project/api/user/:userId/message/inbox', findAllMessagesSentToUser);
    app.get('/project/api/user/:userId/message/outbox', findAllMessagesSentFromUser);
    app.get('/project/api/message/:messageId',findMessageById);
    app.post('/project/api/user/:userId/match/:matchId/message', createMessage);
    app.delete('/project/api/user/:userId/message/:messageId', deleteMessage);

    function deleteMessage(req,res){
        var userId = req.params.userId;
        var messageId = req.params.messageId;
        model.userModel
            .findUserById(userId)
            .then(function(user){
                if(user){
                    model.messageModel
                        .findMessageById(messageId)
                        .then(function(message){
                            if(message){
                                model.userModel
                                    .findUserById(message._to)
                                    .then(function(sentTo){
                                        if(sentTo){
                                            if(user.username===sentTo.username){
                                                model.userModel
                                                    .deleteMessage(userId,messageId,true)
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
                                                model.userModel
                                                    .deleteMessage(userId,messageId,false)
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
                                        }else{
                                            res.sendStatus(400);
                                        }
                                    },function(err){
                                        res.sendStatus(400).send(err);
                                    });
                            }else{
                                res.sendStatus(400);
                            }
                        },function(err){
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

    function createMessage(req,res){
        var message = req.body;
        var userId = req.params.userId;
        var matchId = req.params.matchId;
        model.messageModel
            .createMessage(matchId,userId,message)
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

    function findMessageById(req,res){
        var messageId = req.params.messageId;
        model.messageModel
            .findMessageById(messageId)
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

    function findAllMessagesSentToUser(req,res) {
        var userId = req.params.userId;
        model.messageModel
            .findAllMessagesSentToUser(userId)
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

    function findAllMessagesSentFromUser(req,res) {
        var userId = req.params.userId;
        model.messageModel
            .findAllMessagesSentFromUser(userId)
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