module.exports=function(){
    var mongoose = require('mongoose');

    var messageSchema = mongoose.Schema({
        _to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        },
        toUsername: String,
        _from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        },
        fromUsername: String,
        subject: String,
        text: String,
        dateCreated: {type: Date, default: Date.now}
    },{collection:"message"});

    return messageSchema;
};