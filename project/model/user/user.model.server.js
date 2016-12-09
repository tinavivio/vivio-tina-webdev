"use strict"

var q = require("q");

module.exports=function(mongoose){

    var userSchema = require("./user.schema.server.js")();
    //var userModel = mongoose.model("userModel", userSchema);

    var model = {};

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        deleteMessage: deleteMessage,
        createMatch: createMatch,
        deleteMatch: deleteMatch,
        clearMatches: clearMatches,
        uploadImage: uploadImage,
        setModel : setModel
    };
    return api;

    function setModel(_model){
        model = _model;
    }

    function createUser (user) {
        var deferred = q.defer();

        userModel.create(user, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function clearMatches(userId) {
        var deferred = q.defer();

        userModel.findById(userId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                retVal.matches = [];
                retVal.save();
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findUserById(userId) {
        var deferred = q.defer();

        userModel.findById(userId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function updateUser(userId, user) {
        var deferred = q.defer();

        userModel.update({_id: userId},{$set: {firstName : user.firstName, lastName: user.lastName, email: user.email,about: user.about,phone:user.phone,photoUrl:user.photoUrl,location:user.location}}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function deleteUser(userId) {
        var deferred = q.defer();

        userModel.remove({_id: userId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findUserByUsername(username) {
        var deferred = q.defer();

        userModel.findOne({username: username}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findUserByCredentials(username,password) {
        var deferred = q.defer();

        userModel.findOne(
            {
                username: username,
                password: password
            }, function(err, retVal){
                if (err) {
                    deferred.reject(err);
                }
                else{
                    deferred.resolve(retVal);
                }
            });
        return deferred.promise;
    }

    function deleteMessage(userId,messageId,boolean) {
        var deferred = q.defer();

        userModel.findById(userId, function(err, user){
            if (err) {
                deferred.reject(err);
            }
            else{
                if(boolean){
                    user.inbox.pull(messageId);
                    user.save();
                }else{
                    user.outbox.pull(messageId);
                    user.save();
                }
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function deleteMatch(userId,matchId) {
        var deferred = q.defer();

        userModel.findById(userId, function(err, user){
            if (err) {
                deferred.reject(err);
            }
            else{
                user.matches.pull(matchId);
                user.save();
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function createMatch(userId,matchId) {
        var deferred = q.defer();

        userModel.findById(userId, function(err, user){
            if (err) {
                deferred.reject(err);
            }
            else{
                user.matches.push(matchId);
                user.save();
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function uploadImage(userId,url){
        var deferred = q.defer();

        userModel.update({_id: userId}, {$set: {photoUrl:url}}, function(err, retVal){
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