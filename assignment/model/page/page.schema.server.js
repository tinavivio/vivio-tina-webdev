module.exports=function(){

    var mongoose = require('mongoose');
    var widgetSchema = require('../widget/widget.schema.server.js');
    var pageSchema = mongoose.Schema({
        _website: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'websiteModel'
        },
        name: String,
        title: String,
        description: String,
        widgets: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'widgetModel'}],
        dateCreated: {type: Date, default: Date.now}
    },{collection:"page"});

    return pageSchema;
};
