module.exports=function(){
    var mongoose = require('mongoose');

    var widgetSchema = mongoose.Schema({
        _page: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'pageModel'
        },
        name: String,
        type: {type: String, uppercase: true, enum: ['HEADER','IMAGE','YOUTUBE','HTML','TEXT']},
        text: String,
        placeholder: String,
        description: String,
        url: String,
        width: {type: String, default: '100%'},
        height: {type:String, default:'100%'},
        rows: Number,
        size: {type:Number,default:1},
        class: String,
        icon: String,
        deletable: Boolean,
        formatted: Boolean,
        dateCreated: {type: Date, default: Date.now}
    },{collection:"widget"});

    return widgetSchema;
};