(function () {
    angular
        .module("BurritoMatchMaker")
        .config(Config);

    function Config($routeProvider) {
        var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
            var deferred = $q.defer();
            $http.get('/project/api/loggedin').success(function (user) {
                $rootScope.errorMessage = null;
                if (user !== '0') {
                    $rootScope.currentUser = user;
                    deferred.resolve();
                } else {
                    deferred.reject();
                    $location.url('/');
                }
            });
            return deferred.promise;
        };
        $routeProvider
            .when('/', {
                templateUrl: 'views/user/login.view.client.html',
                controller: "LoginController",
                controllerAs: "login"
            })
            .when('/login', {
                templateUrl: 'views/user/login.view.client.html',
                controller: "LoginController",
                controllerAs: "login"
            })
            .when('/register', {
                templateUrl: 'views/user/register.view.client.html',
                controller: "RegisterController",
                controllerAs: "register"
            })
            .when('/user/:uid', {
                templateUrl: 'views/user/profile.view.client.html',
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {checkLoggedin:checkLoggedin}
            })
            .when('/user/:uid/admin', {
                templateUrl: 'views/user/admin-page.view.client.html',
                controller: "AdminController",
                controllerAs: "model"
            })
            .when('/user/:uid/match', {
                templateUrl: 'views/user/matches.view.client.html',
                controller: "MatchesController",
                controllerAs: "model"
            })
            .when('/user/:uid/match/:mid', {
                templateUrl: 'views/user/match-profile.view.client.html',
                controller: "MatchController",
                controllerAs: "model"
            })
            .when('/user/:uid/match/:mid/zomato', {
                templateUrl: 'views/zomato/zomato-search.view.client.html',
                controller: "ZomatoSearchController",
                controllerAs: "model"
            })
            .when('/user/:uid/match/:mid/message/new', {
                templateUrl: 'views/message/message-new.view.client.html',
                controller: "NewMessageController",
                controllerAs: "model"
            })
            .when('/user/:uid/burrito/new', {
                templateUrl: 'views/burrito/burrito-new.view.client.html',
                controller: "NewBurritoController",
                controllerAs: "model"
            })
            .when('/user/:uid/burrito/edit', {
                templateUrl: 'views/burrito/burrito-edit.view.client.html',
                controller: "EditBurritoController",
                controllerAs: "model"
            })
            .when('/user/:uid/message/inbox', {
                templateUrl: 'views/message/message-inbox.view.client.html',
                controller: "MessageInboxController",
                controllerAs: "model"
            })
            .when('/user/:uid/message/outbox', {
                templateUrl: 'views/message/message-outbox.view.client.html',
                controller: "MessageOutboxController",
                controllerAs: "model"
            })
            .when('/user/:uid/message/:msgid', {
                templateUrl: 'views/message/message.view.client.html',
                controller: "MessageController",
                controllerAs: "model"
            })
            .otherwise({redirectTo: '/login'});
    }
})();