(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope', 'FlashService', '$location', '$route', '$filter'];
    function HomeController(UserService, $rootScope, FlashService, $location, $route, $filter) {
        var vm = this;

        vm.user = null;
        vm.tickerSymbols = [];
        vm.addTickerSymbols = addTickerSymbols;
        vm.deleteTickerSymbols = deleteTickerSymbols;
        vm.setInputValue = setInputValue;
        vm.sort_by = sort_by;
        vm.isToggled = isToggled;
        vm.predicate = predicate;
        vm.itemsPerPage = 10;

        initController();

        function initController() {
            console.log("Home Controller - Init Controller");
            vm.sortingOrder = 'longName';
            vm.pageSizes = [5,10,25,50];
            vm.reverse = false;
            getAllTickerSymbols();
        }

        function setInputValue(result){
            vm.AddTickerSymbolName = result.ticker;
        }

        function isToggled(index){
            vm.showDetails = vm.showDetails == index ? -1 : index;
        }
      
        // change sorting order
       function predicate(val) {
          return val[vm.sortingOrder];
        }
        function sort_by(newSortingOrder){
            if (vm.sortingOrder == newSortingOrder){
              vm.reverse = !vm.reverse;
            }else{
                vm.sortingOrder = newSortingOrder;
            }  
        }

        function getAllTickerSymbols(){
                console.log("Home Controller - Get All Ticker Symbols ");
                UserService.getAllTickerSymbols()
                .then(function (response) {
                    if (response.success) {
                            response.data.forEach(function(data){
                                vm.tickerSymbols.push(data); 
                            });
                            loadCurrentUser();
                    } else {
                            FlashService.Error(response.message);
                    }
                })
        }
        
        function loadCurrentUser() {
                console.log("Home Controller - Load Current User");
            UserService.GetUserDetailsByUserName($rootScope.globals.currentUser.username)
                .then(function (response) {
                        if (response.success) {
                            vm.user = response.data;
                            loadUserTickersDetails(vm.user.UserId);
                        }
                });
        }
        
        function loadUserTickersDetails(userId){
                console.log("Home Controller - Load User Ticker Details ");
                UserService.GetUserTickersDetails(userId)
                .then(function (response) {
                    if (response.success) {
                            vm.UserTickerSymbols = response.data;
                            if(vm.UserTickerSymbols){
                                angular.forEach(vm.UserTickerSymbols, function (ticker) {
                                    ticker.regularMarketPrice = parseFloat(ticker.regularMarketPrice);
                                    ticker.RegularMarketChange = parseFloat(ticker.RegularMarketChange);
                                });
                            }
                            console.log(vm.UserTickerSymbols);
                    } else {
                            FlashService.Error(response.message);
                    }
                })
        }

        function addTickerSymbols(){
                console.log("Home Controller - Add Ticker Symbol");
                UserService.UpdateTickerSymbols(vm.user.UserId, 0, vm.AddTickerSymbolName, true).
                    then(function (response) {
                        if (response.success) {
                            initController();
                            vm.AddTickerSymbolName = '';
                        } else {
                            FlashService.Error(response.message);
                        }
                    })
        }
        
        function deleteTickerSymbols(DeleteTickerSymbolName){
            console.log("Home Controller - Delete Ticker Symbol" + DeleteTickerSymbolName);
            UserService.UpdateTickerSymbols(vm.user.UserId, 0, DeleteTickerSymbolName, false).
                then(function (response) {
                    if (response.success) {
                        $route.reload();
                    } else {
                        FlashService.Error(response.message);
                    }
                })
        }
    }

})();