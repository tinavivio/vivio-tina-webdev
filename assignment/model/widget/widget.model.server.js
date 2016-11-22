"use strict"
/*var widgets = require("./widget.mock.json");
var guid = require("guid");*/

var q = require("q");

module.exports=function(mongoose){
    var widgetSchema = require("./widget.schema.server.js")();
    var widgetModel = mongoose.model("widgetModel", widgetSchema);

    var model = {};

    var api ={
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        uploadImage: uploadImage,
        setModel : setModel
    };

    return api;

    function setModel(_model){
        model = _model;
    }

    function uploadImage(widgetId,url,width,name){
        var deferred = q.defer();

        widgetModel.update({_id: widgetId}, {$set: {name: name,url:url,width:width}}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findWidgetById (widgetId){
        var deferred = q.defer();

        widgetModel.findById(widgetId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function createWidget(pageId, widget){
        var deferred = q.defer();

        widget._page = pageId;

        widgetModel.create(widget, function(err, newWidget){
            if (err) {
                deferred.reject(err);
            }
            else{
                model.pageModel
                    .findPageById(pageId)
                    .then(
                        function(page){
                            if(page){
                                page.widgets.push(newWidget._id);
                                page.save();
                            }
                        },
                        function(err){

                        }
                    );
                deferred.resolve(newWidget);
            }
        });
        return deferred.promise;
    }

    function findAllWidgetsForPage(pageId){
        var deferred = q.defer();

        widgetModel.find({_page: pageId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }


    function updateWidget(widgetId, type,widget) {
        var deferred = q.defer();

        if (type === 'HEADER') {
            widgetModel.update({_id: widgetId}, {
                $set: {
                    name: widget.name,
                    text: widget.text,
                    size: widget.size,
                    description: widget.description
                }
            }, function (err, retVal) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(retVal);
                }
            });
            return deferred.promise;
        }else if (type === 'TEXT') {
            widgetModel.update({_id: widgetId}, {
                $set: {
                    name: widget.name,
                    text: widget.text,
                    rows: widget.rows,
                    description: widget.description,
                    placeholder: widget.placeholder,
                    formatted: widget.formatted
                }
            }, function (err, retVal) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(retVal);
                }
            });
            return deferred.promise;
        } else if (type === 'HTML') {
            widgetModel.update({_id: widgetId}, {
                $set: {
                    name: widget.name,
                    text: widget.text,
                    description: widget.description
                }
            }, function (err, retVal) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(retVal);
                }
            });
            return deferred.promise;
        }else{
            widgetModel.update({_id: widgetId}, {
                $set: {
                    name: widget.name,
                    text: widget.text,
                    url: widget.url,
                    width: widget.width,
                    height: widget.height,
                    description: widget.description
                }
            }, function (err, retVal) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(retVal);
                }
            });
        return deferred.promise;
    }
    }

    function deleteWidget(widgetId){
        var deferred = q.defer();

        widgetModel.remove({_id:widgetId}, function(err, retVal){
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