(function(){
    angular
        .module("jgaDirectives", [])
        .directive("jgaSortable", jgaSortable);

    function jgaSortable() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var start = null;
                var end = null;
                $(element)
                    .sortable({
                        sort: function(event, ui) {
                            start = ui.item.index();
                        },
                        stop: function(event, ui) {
                            end = ui.item.index();
                            if(start >= end) {
                                start--;
                            }
                            scope.jgaSortableCallback({start: start, end: end});
                        }
                    });
            },
            scope: {
                jgaSortableCallback: "&"
            }
        }
    }
        /*function link(scope, element, attrs) {
            var start = null;
            var end   = null;
            $(element)
                .sortable({
                    sort: function(event, ui) {
                        start = ui.item.index();
                    },
                    stop: function(event, ui) {
                        end = ui.item.index();
                        if(start >= end) {
                            start--;
                        }
                        scope.jgaSortableCallback({start: start, end: end});
                    }
                });
        }
        return {
            scope: {
                jgaSortableCallback: '&'
            },
            link: link
        };
    }*/
})();