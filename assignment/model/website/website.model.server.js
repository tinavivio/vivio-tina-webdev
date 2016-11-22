"use strict"
/*var websites = require("./website.mock.json");
var guid = require("guid");*/

var q = require("q");

module.exports=function(mongoose){
    var websiteSchema = require("./website.schema.server.js")();
    var websiteModel = mongoose.model("websiteModel", websiteSchema);

    var model = {};

    var api ={
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        setModel : setModel
    };

    return api;

    function setModel(_model){
        model = _model;
    }

    function findWebsiteById (websiteId){
        var deferred = q.defer();

        websiteModel.findById(websiteId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function createWebsiteForUser(userId, website){
        var deferred = q.defer();

        website._user = userId;

        websiteModel.create(website, function(err, newWebsite){
            if (err) {
                deferred.reject(err);
            }
            else{
                model.userModel
                    .findUserById(userId)
                    .then(
                        function(user){
                            if(user){
                                user.websites.push(newWebsite._id);
                                user.save();
                            }else{
                                res.sendStatus(400);
                            }
                        },
                        function(err){
                            res.sendStatus(400).send(err);
                        }
                    );
                deferred.resolve(newWebsite);
            }
        });
        return deferred.promise;
    }

    function findAllWebsitesForUser(userId){
        var deferred = q.defer();

        websiteModel.find({_user: userId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }


    function updateWebsite(websiteId, website){
        var deferred = q.defer();

        websiteModel.update({_id: websiteId}, {$set: {name: website.name,description: website.description}}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function deleteWebsite(websiteId){
        var deferred = q.defer();

        websiteModel.remove({_id: websiteId}, function(err, retVal){
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