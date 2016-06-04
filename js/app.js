angular.module('cityChat', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            // route for the start page
            .state('start', {
                url:'/',
                views: {
                    'content': {
                        templateUrl : 'views/start.html'
                        //controller  : 'StartController'
                    }
                }
            })
            // route for the find page
            .state('find', {
                url:'/find',
                views: {
                    'header': {
                        templateUrl : 'views/partials/header.html',
                    },
                    'content': {
                        templateUrl : 'views/find.html',
                        controller  : 'FindController'
                    }
                }
            })
            // route for the contactus page
            .state('chat', {
                url:'/chat',
                views: {
                    'header': {
                        templateUrl : 'views/partials/header.html',
                    },
                    'content': {
                        templateUrl : 'views/chat.html',
                        controller  : 'ChatController'
                    }
                }
            });
        
        $urlRouterProvider.otherwise('/');
    });

