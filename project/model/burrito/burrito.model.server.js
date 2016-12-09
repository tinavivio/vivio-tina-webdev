"use strict"

var q = require("q");

module.exports=function(mongoose){
    var burritoSchema = require("./burrito.schema.server.js")();
    var burritoModel = mongoose.model("burritoModel", burritoSchema);

    var model = {};

    var api ={
        createBurritoForUser: createBurritoForUser,
        findBurritoByUserId: findBurritoByUserId,
        updateBurrito: updateBurrito,
        deleteBurrito: deleteBurrito,
        findAllBurritos: findAllBurritos,
        setModel : setModel
    };

    return api;

    function setModel(_model){
        model = _model;
    }

    function findAllBurritos(){
        var deferred = q.defer();

        burritoModel.find({}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function deleteBurrito(burritoId) {
        var deferred = q.defer();

        burritoModel.remove({_id: burritoId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findBurritoByUserId (userId){
        var deferred = q.defer();

        burritoModel.findOne({_user: userId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function createBurritoForUser(userId, burrito){
        var deferred = q.defer();

        burrito._user = userId;

        burritoModel.create(burrito, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function updateBurrito(burritoId,burrito){
        var deferred = q.defer();

        burritoModel.update({_id: burritoId}, {$set: {tortilla:burrito.tortilla,rice:burrito.rice,beans:burrito.beans,meat:burrito.meat,salsa:burrito.salsa,cheese:burrito.cheese,sourCream:burrito.sourCream,lettuce:burrito.lettuce,guacamole:burrito.guacamole}}, function(err, retVal){
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