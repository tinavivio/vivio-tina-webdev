(function() {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    function WidgetService($http) {

        var api = {
            createWidget : createWidget,
            findWidgetsByPageId : findWidgetsByPageId,
            findWidgetById: findWidgetById,
            updateWidget : updateWidget,
            deleteWidget : deleteWidget,
            sortWidgets : sortWidgets,
            selectPhoto : selectPhoto
        };
        return api;
        function sortWidgets(pageId,start,end){
            var url = '/assignment/api/page/' + pageId + '/widget?initial=' + start + '&final=' + end;
            return $http.put(url);
        }

        function selectPhoto(widgetId,widget){
            var url = '/assignment/api/widget/' + widgetId + '/flickr';
            return $http.put(url,widget);
        }

        function createWidget(pageId,widget) {
            var url = '/assignment/api/page/' + pageId + '/widget';
            return $http.post(url,widget);
        }
        function findWidgetsByPageId(pageId) {
            var url = '/assignment/api/page/' + pageId + '/widget';
            return $http.get(url);
        }
        function findWidgetById(widgetId) {
            var url = '/assignment/api/widget/' + widgetId;
            return $http.get(url);
        }
        function updateWidget(widgetId,widget) {
            var url = '/assignment/api/widget/' + widgetId;
            return $http.put(url,widget);
        }
        function deleteWidget(widgetId) {
            var url = '/assignment/api/widget/' + widgetId;
            return $http.delete(url);
        }
    }
})();