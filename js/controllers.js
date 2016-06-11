angular.module('cityChat')

.controller('StartController', function($scope, $http, $state) {
    console.log('StartController loaded');
    var self = this;
    $scope.userName = '';

    $scope.setUserInfo = function() {
            self.setName();
            self.setLocation();
    };

    this.setName = function(){
        localStorage.user = $scope.userName;
    };

    this.setLocation = function(){
        var apiUrl = 'http://test.vi:3000';//'https://fun-milosz.c9.io'
        $http.get(apiUrl + '/ip')
            .then(function(ip) {
                var ipLocationApiQuery = 'http://ip-api.com/json/' + ip.data + '?fields=258047';
                $http.get(ipLocationApiQuery)
                    .then(function(response) {
                        localStorage.country = response.data.country || 'country';
                        localStorage.city = response.data.city || 'city';

                        $state.go('find');
                    });
            });
    };

})

//FIND--------------------------------------------------------------------
.controller('FindController', function($scope, $http, $state) {
    console.log('FindController loaded');

    $scope.findChat = function() {
        var apiUrl = 'http://test.vi:3000';//'https://fun-milosz.c9.io'
        $http.post(apiUrl + '/find', {name: localStorage.user, city: localStorage.city})
            .then(function(responseData) {
                console.log(responseData.data.room);
                $state.go('chat',{data: responseData.data});
            });
    };
})

//CHAT-----------------------------------------------------------
.controller('ChatController', function($scope, $http, $state) {
    console.log('ChatController loaded','join room', 'userRoom_' + $state.params.data.room);

    $scope.message = '';

    var socket = io();
    socket.on('connect', function() {
        // Connected, let's sign-up for to receive messages for this room
        socket.emit('join room', 'userRoom_' + $state.params.data.room);
    });

    $scope.sendMessage = function(){
        if ($scope.message.length > 0) {
            var msgData = {
                user: localStorage.user,
                text: $scope.message
            };
            addOutgoingMessage(msgData);
            socket.emit('chat message', msgData);
            $scope.message = '';
        }
    };
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        addIncomingMessage(msg);
    });
    
    var addOutgoingMessage = function(msg) {
        var date = new Date();
        date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var p = document.createElement('p');
        p.setAttribute('class', 'msg msg--out');
        p.innerHTML = '<span class="msg__user text-info">'+ msg.user + '</span>' +
            '<span class="msg__text">' + msg.text + '</span>' +
            '<span class="msg__time text-info">' + date + '</span>';
        var chatBox = document.getElementById('chat-box');
        chatBox.appendChild(p);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    var addIncomingMessage = function(msg) {
        var date = new Date();
        date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var p = document.createElement('p');
        p.setAttribute('class', 'msg msg--in');
        p.innerHTML = '<span class="msg__user text-info">'+ msg.user + '</span>' +
            '<span class="msg__text">' + msg.text + '</span>' +
            '<span class="msg__time text-info">' + date + '</span>';
        var chatBox = document.getElementById('chat-box');
        chatBox.appendChild(p);
        chatBox.scrollTop = chatBox.scrollHeight;
    };
});