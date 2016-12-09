module.exports=function(){
    var mongoose = require('mongoose');

    var burritoSchema = mongoose.Schema({
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        },
        tortilla: {type: String, uppercase: true, enum: ['FLOUR','CORN','WHOLE WHEAT']},
        rice: {type: String, uppercase: true, enum: ['WHITE','BROWN','CILANTRO LIME']},
        beans: {type: String, uppercase: true, enum: ['BLACK','PINTO','REFRIED']},
        meat: {type: String, uppercase: true, enum: ['VEGGIE','CHICKEN','CARNE ASADA','AL PASTOR','CARNITAS','CHILE VERDE','CHORIZO']},
        salsa: {type: String, uppercase: true, enum: ['MILD','MEDIUM','HOT','EXTRA HOT']},
        sourCream: Boolean,
        cheese: Boolean,
        guacamole: Boolean,
        lettuce: Boolean,
        dateCreated: {type: Date, default: Date.now}
    },{collection:"burrito"});

    return burritoSchema;
};