module.exports = function(app,model) {

    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.post ('/assignment/api/upload', upload.single('myFile'), uploadImage);
    app.put ('/assignment/api/page/:pageId/widget',sortWidgets);
    app.get('/assignment/api/page/:pageId/widget', findAllWidgetsForPage);
    app.post('/assignment/api/page/:pageId/widget', createWidget);
    app.get('/assignment/api/widget/:widgetId', findWidgetById);
    app.delete('/assignment/api/widget/:widgetId',deleteWidget);
    app.put('/assignment/api/widget/:widgetId',updateWidget);
    function sortWidgets(req,res){
        var pageId = req.params.pageId;
        var start = parseInt(req.query.initial);
        var end = parseInt(req.query.final);
        model.pageModel
            .findPageById(pageId)
            .then(
                function(retVal) {
                    if (retVal) {
                        var moved = retVal.widgets.splice(start, 1)[0];
                        retVal.widgets.splice(end, 0, moved);
                        retVal.save();
                        res.sendStatus(200);
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                }
            );
    }
    function uploadImage(req, res) {
        var width         = req.body.width;
        var widgetId      = req.body.widgetId;
        var pageId        = req.body.pageId;
        var websiteId     = req.body.websiteId;
        var userId        = req.body.userId;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;
        var relPath = "../uploads/" + filename;
        model.widgetModel
            .uploadImage(widgetId,relPath,width,originalname)
            .then(function(retVal){
                if(retVal){
                    res.redirect("../#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
                }else{
                    res.sendStatus(400);
                }
            },
            function(err){
                res.redirect("../#/");
            });
    }
    function deleteWidget(req,res){
        var widgetId = req.params.widgetId;
        model.widgetModel
            .deleteWidget(widgetId)
            .then(function(retVal){
                    if(retVal){
                        res.sendStatus(204);
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
    function updateWidget(req,res){
        var widgetId = req.params.widgetId;
        var widget = req.body;
        model.widgetModel
            .findWidgetById(widgetId)
            .then(function(retVal) {
                    if (retVal) {
                        model.widgetModel
                            .updateWidget(widgetId,retVal.type,widget)
                            .then(function(retVal){
                                    if(retVal){
                                        res.sendStatus(200);
                                    }else{
                                        res.sendStatus(400);
                                    }
                                },
                                function(err){
                                    res.sendStatus(400).send(err);
                                });
                    } else {
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
    function createWidget(req,res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        model.widgetModel
            .createWidget(pageId,widget)
            .then(function(retVal){
                    if(retVal){
                        res.send(retVal);
                    }else{
                        res.send('0');
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
    function findAllWidgetsForPage(req,res) {
        var pageId = req.params.pageId;
        model.widgetModel
            .findAllWidgetsForPage(pageId)
            .then(function(retVal){
                    if(retVal){
                        res.send(retVal);
                    }else{
                        res.send('0');
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function findWidgetById(req,res) {
        var widgetId = req.params.widgetId;
        model.widgetModel
            .findWidgetById(widgetId)
            .then(function(retVal){
                    if(retVal){
                        if(retVal){
                            res.send(retVal);
                        }else{
                            res.send('0');
                        }
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
};