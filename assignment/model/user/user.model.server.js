"use strict"
/*var users = require("./user.mock.json");
 var guid = require("guid");*/

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
        findUserByFacebookId: findUserByFacebookId,
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

        userModel.update({_id: userId},{$set: {firstName : user.firstName, lastName: user.lastName, email: user.email,phone:user.phone}}, function(err, retVal){
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

    function findUserByFacebookId(facebookId) {
        var deferred = q.defer();

        userModel.findOne({'facebook.id': facebookId}, function(err, retVal){
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
}