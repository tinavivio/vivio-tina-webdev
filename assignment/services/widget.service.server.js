module.exports = function(app) {
    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var widgets = [
            { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
            { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "http://lorempixel.com/400/200/"},
            { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
            { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://youtu.be/AM2Ivdi9c4E" },
            { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
        ];
    var widgetId = 789;
    app.post ('/assignment/api/upload', upload.single('myFile'), uploadImage);
    app.put ('/assignment/api/page/:pageId/widget',sortWidgets);
    app.get('/assignment/api/page/:pageId/widget', findAllWidgetsForPage);
    app.post('/assignment/api/page/:pageId/widget', createWidget);
    app.get('/assignment/api/widget/:widgetId', findWidgetById);
    app.delete('/assignment/api/widget/:widgetId',deleteWidget);
    app.put('/assignment/api/widget/:widgetId',updateWidget);
    function sortWidgets(req,res){
        var pageId = parseInt(req.params.pageId);
        var start = parseInt(req.query.initial);
        var end = parseInt(req.query.final);
        var pageWidgets = -1;
        for(var i = 0;i<widgets.length;i++){
            if(parseInt(widgets[i].pageId)===pageId){
                pageWidgets++;
                if(pageWidgets===start){
                    var startIndex = i;
                }
                if(pageWidgets===end){
                    var endIndex = i;
                }
            }
        }
        var moved = widgets.splice(startIndex, 1)[0];
        widgets.splice(endIndex, 0, moved);
        res.sendStatus(200);
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
        for(var i = 0; i < widgets.length; i++){
            if(parseInt(widgets[i]._id)===parseInt(widgetId)){
                widgets[i].url = relPath;
                widgets[i].width = width;
                widgets[i].name = originalname;
                res.redirect("../#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
                return;
            }
        }
        res.redirect("../#/");
    }
    function deleteWidget(req,res){
        var widgetId = req.params.widgetId;
        for(var i = 0; i < widgets.length; i++){
            if(parseInt(widgets[i]._id)===parseInt(widgetId)){
                widgets.splice(i,1);
                res.sendStatus(200);
                return;
            }
        }
    }
    function updateWidget(req,res){
        var widgetId = req.params.widgetId;
        var widget = req.body;
        for(var i = 0; i < widgets.length; i++){
            if(parseInt(widgets[i]._id)===parseInt(widgetId)){
                widget._id = widgets[i]._id;
                widget.pageId = widgets[i].pageId;
                widget.widgetType = widgets[i].widgetType;
                widgets.splice(i,1,widget);
                res.sendStatus(200);
                return;
            }
        }
    }
    function createWidget(req,res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        widgetId++;
        widget._id = widgetId;
        widget.pageId=pageId;
        widgets.push(widget);
        res.send(widget);
    }
    function findAllWidgetsForPage(req,res) {
        var pageId = req.params.pageId;
        var arr = [];
        for(var i = 0; i < widgets.length; i++){
            if(parseInt(widgets[i].pageId)===parseInt(pageId)){
                arr.push(widgets[i]);
            }
        }
        res.send(arr);
    }

    function findWidgetById(req,res) {
        var widgetId = req.params.widgetId;
        for(var i = 0; i < widgets.length; i++){
            if(parseInt(widgets[i]._id)===parseInt(widgetId)){
                res.send(widgets[i]);
                return;
            }
        }
        res.send('0');
    }
};