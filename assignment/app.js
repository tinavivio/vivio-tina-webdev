module.exports=function(app){

    var model = require("./model/model.server.js")();
    // var userModel = require("./model/user/user.model.server.js")(mongoose, db);
    require("./services/user.service.server.js")(app,model);

    // var websiteModel = require("./model/website/website.model.server.js")(mongoose, db);
    require("./services/website.service.server.js")(app,model);

    // var pageModel =  require("./model/page/page.model.server.js")(mongoose, db);
    require("./services/page.service.server.js")(app,model);

    // var widgetModel = require("./model/widget/widget.model.server.js")(mongoose,db);
    require("./services/widget.service.server.js")(app,model);
}