module.exports = function() {
    var connectionString = 'mongodb://tvivio:jingo123@ds153667.mlab.com:53667/vivio_wam_fall_2016';

    if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
        connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
    }

    var mongoose = require('mongoose');
    //mongoose.connect(connectionString);

    var userModel = require("./user/user.model.server.js")(mongoose);
    var websiteModel = require("./website/website.model.server.js")(mongoose);
    var pageModel =  require("./page/page.model.server.js")(mongoose);
    var widgetModel = require("./widget/widget.model.server.js")(mongoose);

    var model = {
        userModel : userModel,
        websiteModel : websiteModel,
        pageModel : pageModel,
        widgetModel : widgetModel
    }

    userModel.setModel(model);
    websiteModel.setModel(model);
    pageModel.setModel(model);
    widgetModel.setModel(model);

    return model;
}