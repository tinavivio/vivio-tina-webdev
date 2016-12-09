(function() {
    angular
        .module("BurritoMatchMaker")
        .factory("MessageService", MessageService);
    function MessageService($http) {
        var api = {
            createMessage : createMessage,
            findMessageById : findMessageById,
            findAllMessagesSentToUser : findAllMessagesSentToUser,
            findAllMessagesSentFromUser : findAllMessagesSentFromUser,
            deleteMessage : deleteMessage
        };
        return api;
        function createMessage(userId,matchId,message) {
            var url = '/project/api/user/' + userId + '/match/' + matchId + '/message';
            return $http.post(url,message);
        }
        function findMessageById(messageId) {
            var url = '/project/api/message/' + messageId;
            return $http.get(url);
        }

        function findAllMessagesSentFromUser(userId){
            var url = '/project/api/user/'+userId + '/message/outbox';
            return $http.get(url);
        }
        function findAllMessagesSentToUser(userId){
            var url = '/project/api/user/'+userId + '/message/inbox';
            return $http.get(url);
        }
        function deleteMessage(userId,messageId){
            var url = '/project/api/user/' + userId + '/message/' + messageId;
            return $http.delete(url);
        }
    }
})();