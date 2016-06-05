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
        $http.get('https://fun-milosz.c9.io/ip')
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

//------------------------------------------------------------------------
.controller('FindController', function() {
    console.log('FindController loaded');
})
.controller('ChatController', function() {
    console.log('ChatController loaded');
});