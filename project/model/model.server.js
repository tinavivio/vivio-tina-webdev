module.exports = function() {
    var connectionString = 'mongodb://tvivio:jingo123@ds119728.mlab.com:19728/vivio_project_fall_2016';

    var mongoose = require('mongoose');
    //mongoose.connect(connectionString);

    var userModel = require("./user/user.model.server.js")(mongoose);
    var messageModel = require("./message/message.model.server.js")(mongoose);
    var burritoModel =  require("./burrito/burrito.model.server.js")(mongoose);

    var model = {
        userModel : userModel,
        messageModel : messageModel,
        burritoModel : burritoModel
    }

    userModel.setModel(model);
    messageModel.setModel(model);
    burritoModel.setModel(model);

    return model;
}