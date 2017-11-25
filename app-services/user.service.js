(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.GetUserTickersDetails = GetUserTickersDetails;
        service.UpdateTickerSymbols = UpdateTickerSymbols;
        service.GetUserDetailsByUserName = GetUserDetailsByUserName;
        service.RegisterUser = RegisterUser;
        service.GetSecurityQuestions = GetSecurityQuestions;
        service.getAllTickerSymbols = getAllTickerSymbols;
        
        return service;

        function RegisterUser(user) {
            console.log("RegisterUser API call");
            console.log(JSON.stringify(user));
                return $http({  
                    method: 'POST',
                    dataType:'json',
                    url: "http://52.226.130.180/FinancePortfolioAPI/api/User/RegisterUser",
                    data: user, 
                    }) .then(success, error);
        }
        
        function GetSecurityQuestions(){
        		return $http({  
	    			method: 'GET',
	    			dataType:'json',
	    			url: "http://52.226.130.180/FinancePortfolioAPI/api/user/GetSecurityQuestions",
	    			}) .then(success, error('Failed to get security questions'));     	
        }
        
        function getAllTickerSymbols(){
	    		return $http({  
	    			method: 'GET',
	    			dataType:'json',
	    			url: "http://52.226.130.180/FinancePortfolioAPI/api/TickerSymbol/GetAllTickerSymbols"
	    			}) .then(success, error('Failed to get user by username'));
	    }
        
        function GetUserTickersDetails(userId) {
	        	return $http({  
	    			method: 'GET',
	    			dataType:'json',
	    			url: "http://52.226.130.180/FinancePortfolioAPI/api/User/GetUserTickersDetails/" + userId
	    			}) .then(success, error('Failed to get ticker symbols for the user'));          
        }

        function UpdateTickerSymbols(userId, tickerSymbolId, tickerSymbolName, active) {
        	console.log(tickerSymbolName);
	        	return $http({  
	    			method: 'POST',
	    			dataType:'json',
	    			data: [{ UserId: userId, TickerSymbolId: tickerSymbolId, TickerSymbolName: tickerSymbolName, Active: active }],
	    			url: "http://52.226.130.180/FinancePortfolioAPI/api/User/UpdateTickerSymbols" 
	    			}) .then(success, error('Failed to update ticker symbols for the user'));          
	    }
        
        function GetUserDetailsByUserName(username){
        		return $http({  
        			method: 'GET',
        			dataType:'json',
        			url: "http://52.226.130.180/FinancePortfolioAPI/api/user/GetUserDetailsByUserName/" + username
        			}) .then(success, error('Failed to get user by username'));
        }
        
        // private functions

        function success(res) {
            return { success: true, data:res.data};
        }

        function error(error) {
            return function () {
            	console.log("Error : " + error);
                return { success: false, message: error.data };
            };
        }
    }

})();
