angular.module('cityChat', ['ngRoute'])
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/', {
                templateUrl: 'views/start.html',
                controller: 'startController'
            }).
            when('/find', {
                templateUrl: 'views/find.html',
                controller: 'findController'
            }).
            when('/chat', {
                templateUrl: 'views/chat.html',
                controller: 'chatController'
            }).
            otherwise({
                redirectTo: '/'
            });
        }]);
