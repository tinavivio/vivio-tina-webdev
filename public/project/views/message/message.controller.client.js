(function() {
    angular
        .module("BurritoMatchMaker")
        .controller("NewMessageController", NewMessageController)
        .controller("MessageInboxController",MessageInboxController)
        .controller("MessageOutboxController",MessageOutboxController)
        .controller("MessageController",MessageController);

    function NewMessageController($location,$routeParams,UserService,MessageService) {
        var vm = this;
        vm.createMessage = createMessage;
        function init() {
            var userId = $routeParams.uid;
            var matchId = $routeParams.mid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise1 = UserService.findUserById(matchId);
                        promise1
                            .success(function(user){
                                if(user!== '0'){
                                    vm.matchId = matchId;
                                }else{
                                    $location.url("/user/" + vm.userId);
                                }
                            })
                            .error(function(){

                            });
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

                });
        }
        init();
        function createMessage(message) {
            if(message===undefined || message.subject === "" || message.subject===undefined || message.subject===null || message.text === "" || message.text===undefined || message.text===null){
                vm.error="Must provide message subject and text!";
            }else {
                MessageService.createMessage(vm.userId, vm.matchId,message)
                    .success(function(){
                        $location.url("/user/" + vm.userId +'/message/outbox');
                    })
                    .error(function(){

                    });
            }
        }
    }
    function MessageInboxController($location,$routeParams,UserService,MessageService){
        var vm = this;
        vm.formatDate = formatDate;
        function init() {
            var userId = $routeParams.uid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var arr = [];
                        for(i=0;i<user.inbox.length;i++){
                            var promise2 = MessageService.findMessageById(user.inbox[i]);
                            promise2
                                .success(function(message){
                                    if (message !== '0'){
                                        arr.push(message);
                                    }
                                })
                                .error(function(){

                                });
                        }
                        vm.receivedMessages = arr;
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

                });
        }
        init();
        function formatDate(date){
            var formattedDate =  new Date(date);
            return formattedDate.toDateString();
        }
    }
    function MessageOutboxController($location,$routeParams,UserService,MessageService){
        var vm = this;
        vm.formatDate = formatDate;
        function init() {
            var userId = $routeParams.uid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var arr = [];
                        for(i=0;i<user.outbox.length;i++){
                            var promise1 = MessageService.findMessageById(user.outbox[i]);
                            promise1
                                .success(function(message){
                                    if (message !== '0'){
                                        arr.push(message);
                                    }
                                })
                                .error(function(){

                                });
                        }
                        vm.sentMessages = arr;
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

                });
        }
        init()
        function formatDate(date){
            var formattedDate =  new Date(date);
            return formattedDate.toDateString();
        }
    }

    function MessageController($location,$routeParams,UserService,MessageService){
        var vm = this;
        vm.deleteMessage = deleteMessage;
        function init() {
            var userId = $routeParams.uid;
            var messageId = $routeParams.msgid;
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if (user !== '0') {
                        vm.userId = userId;
                        var promise1 = MessageService.findMessageById(messageId);
                        promise1
                            .success(function(message){
                                if(message!== '0'){
                                    vm.messageId = messageId;
                                    vm.subject = message.subject;
                                    vm.text = message.text;
                                    vm.date = message.dateCreated;
                                    vm.toId = message._to;
                                    vm.fromId = message._from;
                                    var promise3 = UserService.findUserById(message._from);
                                    promise3
                                        .success(function(user){
                                            if(user!=='0'){
                                                vm.from = user.username;
                                                var promise4 = UserService.findUserById(message._to);
                                                promise4
                                                    .success(function(user){
                                                        if(user!=='0'){
                                                            vm.to = user.username;
                                                        }
                                                    })
                                                    .error(function(){

                                                    });
                                            }
                                        })
                                        .error(function(){

                                        });
                                }else{
                                    $location.url("/user/" + vm.userId + '/message/inbox');
                                }
                            })
                            .error(function(){

                            });
                    }else{
                        $location.url("/login");
                    }
                })
                .error(function(){

                });
        }
        init();
        function deleteMessage(){
            MessageService.deleteMessage(vm.userId,vm.messageId)
                .success(function(){
                    $location.url("/user/" + vm.userId + '/message/inbox');
                })
                .error(function(){

                });
        }
    }
})();