"use strict"

var q = require("q");

module.exports=function(mongoose){
    var messageSchema = require("./message.schema.server.js")();
    var messageModel = mongoose.model("messageModel", messageSchema);

    var model = {};

    var api ={
        createMessage: createMessage,
        findAllMessagesSentToUser: findAllMessagesSentToUser,
        findAllMessagesSentFromUser: findAllMessagesSentFromUser,
        findMessageById: findMessageById,
        setModel : setModel
    };

    return api;

    function setModel(_model){
        model = _model;
    }

    function findMessageById (messageId){
        var deferred = q.defer();

        messageModel.findById(messageId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function createMessage(toId, fromId, message){
        var deferred = q.defer();

        message._to = toId;
        message._from = fromId;

        messageModel.create(message, function(err, newMessage){
            if (err) {
                deferred.reject(err);
            }
            else{
                model.userModel
                    .findUserById(toId)
                    .then(
                        function(user){
                            if(user){
                                user.inbox.push(newMessage._id);
                                user.save();
                            }
                        },
                        function(err){
                            deferred.reject(err);
                        }
                    );
                model.userModel
                    .findUserById(fromId)
                    .then(
                        function(user){
                            if(user){
                                user.outbox.push(newMessage._id);
                                user.save();
                            }
                        },
                        function(err){
                            deferred.reject(err);
                        }
                    );
                deferred.resolve(newMessage);
            }
        });
        return deferred.promise;
    }

    function findAllMessagesSentToUser(userId){
        var deferred = q.defer();

        messageModel.find({_to: userId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findAllMessagesSentFromUser(userId){
        var deferred = q.defer();

        messageModel.find({_from: userId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }
}