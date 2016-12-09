module.exports=function(){
    var mongoose = require('mongoose');

    var messageSchema = mongoose.Schema({
        _to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        },
        _from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        },
        subject: String,
        text: String,
        dateCreated: {type: Date, default: Date.now}
    },{collection:"message"});

    return messageSchema;
};