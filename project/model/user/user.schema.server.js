module.exports=function(){
    var mongoose = require('mongoose');

    var userSchema = mongoose.Schema({
        facebook: {
            id:    String,
            token: String
        },
        admin: {type:Boolean,default:false},
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        gender: {type: String, uppercase: true, enum: ['MALE','FEMALE']},
        orientation: {type: String, uppercase: true, enum: ['STRAIGHT','GAY','BISEXUAL']},
        age: Number,
        location: String,
        photoUrl: String,
        about: String,
        matches: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        }],
        inbox: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'messageModel'
        }],
        outbox: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'messageModel'
        }],
        dateCreated: {type: Date, default: Date.now}
    },{collection:"user"});

    return userSchema;
};