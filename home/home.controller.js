(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope', 'FlashService', '$location', '$route'];
    function HomeController(UserService, $rootScope, FlashService, $location, $route) {
        var vm = this;

        vm.user = null;
        vm.tickerSymbols = [];
        vm.addTickerSymbols = addTickerSymbols;
        vm.deleteTickerSymbols = deleteTickerSymbols;

        initController();

        function initController() {
        		console.log("Home Controller - Init Controller");
            getAllTickerSymbols();
        }

        function getAllTickerSymbols(){
	        	console.log("Home Controller - Get All Ticker Symbols ");
	    		UserService.getAllTickerSymbols()
	    		.then(function (response) {
	                if (response.success) {
		                	response.data.forEach(function(data){
		                		vm.tickerSymbols.push(data.ticker); 
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
        					FlashService.Success('Added new Stock', true);
        					$route.reload();
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
    					FlashService.Success('Deleted the Stock', true);
    					$route.reload();
    				} else {
    					FlashService.Error(response.message);
    				}
    			})
        }
    }

})();