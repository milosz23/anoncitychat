angular.module('cityChat', ['ui.router'])
    .constant("SERVER_DETAILS", {
        "API_URL": "http://test.vi:3000"
        // "API_URL": "http://anoncitychat-anoncitychat.c9users.io"
    })
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
                        //controller  : 'FindController'
                    }
                }
            })
            // route for the contactus page
            .state('chat', {
                url:'/chat',
                params: {
                    data: null
                },
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

