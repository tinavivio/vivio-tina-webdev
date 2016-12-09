module.exports=function(){
    var mongoose = require('mongoose');

    var userSchema = mongoose.Schema({
        facebook: {
            id:    String,
            token: String
        },
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        websites: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'websiteModel'
        }],
        dateCreated: {type: Date, default: Date.now}
    },{collection:"user"});

    return userSchema;
};