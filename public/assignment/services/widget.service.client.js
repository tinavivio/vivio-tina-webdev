(function() {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    function WidgetService() {
        var widgets = [
                { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
                { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
                { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                    "url": "http://lorempixel.com/400/200/"},
                { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
                { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
                { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                    "url": "https://www.youtube.com/embed/NPyiLkNf_0c" },
                { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
            ]
            ;
        var api = {
            createWidget : createWidget,
            findWidgetsByPageId : findWidgetsByPageId,
            findWidgetById: findWidgetById,
            updateWidget : updateWidget,
            deleteWidget : deleteWidget
        };
        return api;
        function createWidget(pageId,widget) {
            widget._id = parseInt(widgets[widgets.length-1]._id) + 1;
            widget.pageId=pageId;
            widgets.push(widget);
            return widget;
        }
        function findWidgetsByPageId(pageId) {
            var arr = [];
            for(var i = 0; i < widgets.length; i++){
                if(parseInt(widgets[i].pageId)===parseInt(pageId)){
                    arr.push(widgets[i]);
                }
            }
            return arr;
        }
        function findWidgetById(widgetId) {
            for(var i = 0; i < widgets.length; i++){
                if(parseInt(widgets[i]._id)===parseInt(widgetId)){
                    return widgets[i];
                    break;
                }
            }
            return null;
        }
        function updateWidget(widgetId,widget) {
            for(var i = 0; i < widgets.length; i++){
                if(parseInt(widgets[i]._id)===parseInt(widgetId)){
                    widget._id = widgets[i]._id;
                    widget.pageId = widgets[i].pageId;
                    widget.widgetType = widgets[i].widgetType;
                    widgets.splice(i,1,widget);
                    break;
                }
            }
        }
        function deleteWidget(widgetId) {
            for(var i = 0; i < widgets.length; i++){
                if(parseInt(widgets[i]._id)===parseInt(widgetId)){
                    widgets.splice(i,1);
                    break;
                }
            }
        }
    }
})();