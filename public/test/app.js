(function(){
    angular
        .module("SortListApp", ["ngRoute", "jgaDirectives"])
        .controller("SampleController", SampleController);

    var items = [
        {first: "Alice", last: "Wonderland", email: "alice@email.com"},
        {first: "Bob", last: "Hope", email: "bob@oscars.com"},
        {first: "Charlie", last: "Brown", email: "charlie@schultz.com"},
        {first: "John", last: "Smith", email: "smith@schultz.com"}
    ];

    function SampleController($scope){

        var vm = this;
        vm.items = items;

        vm.sortItem = sortItem;

        function sortItem(start, end) {
            console.log("start: " + start);
            console.log("end: " + end);

            var moved = vm.items.splice(start, 1)[0];
            //var moved = vm.items.splice(start, 1);
            console.log("moved: " + moved.first);

            vm.items.splice(end, 0,moved );

            for(var i in vm.items){
                console.log(vm.items[i].first);
            }
        }
    }

})();