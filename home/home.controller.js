(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope'];
    function HomeController(UserService, $rootScope) {
        var vm = this;

        vm.user = null;
        vm.tickerSymbols = [];
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            loadCurrentUser();
            loadTickerSymbols();
        }

        function loadCurrentUser() {
            UserService.GetUserDetailsByUserName($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadTickerSymbols() {
            
            vm.tickerSymbols = [{"change": 1.59, "name": "GOOG", "price": 752.52, "volume": 234536 }, {"change": 1.59, "name": "YAHOO", "price": 52, "volume": 0 }, {"change": 1.59, "name": "FB", "price": 127.52, "volume": 1956743 }];
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadtickerSymbols();
            });
        }
    }

})();