"use strict"
/*var pages = require("./page.mock.json");
var guid = require("guid");*/

var q = require("q");

module.exports=function(mongoose){
    var pageSchema = require("./page.schema.server.js")();
    var pageModel = mongoose.model("pageModel", pageSchema);

    var model = {};

    var api ={
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage,
        setModel : setModel
    };

    return api;

    function setModel(_model){
        model = _model;
    }

    function findPageById (pageId){
        var deferred = q.defer();

        pageModel.findById(pageId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function createPage(websiteId, page){
        var deferred = q.defer();

        page._website = websiteId;

        pageModel.create(page, function(err, newPage){
            if (err) {
                deferred.reject(err);
            }
            else{
                model.websiteModel
                    .findWebsiteById(websiteId)
                    .then(
                        function(website){
                            if(website){
                                website.pages.push(newPage._id)
                                website.save();
                            }else{
                                res.sendStatus(400);
                            }
                        },
                        function(err){
                            res.sendStatus(400).send(err);
                        }
                    );
                deferred.resolve(newPage);
            }
        });
        return deferred.promise;
    }

    function findAllPagesForWebsite(websiteId){
        var deferred = q.defer();

        pageModel.find({_website: websiteId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }


    function updatePage(pageId, page){
        var deferred = q.defer();

        pageModel.update({_id: pageId}, {$set: {name: page.name,title: page.title,description: page.description}}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function deletePage(pageId){
        var deferred = q.defer();

        pageModel.remove({_id:pageId}, function(err, retVal){
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