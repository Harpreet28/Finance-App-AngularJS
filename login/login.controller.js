(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
        

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password)
	            .then(function (response) {
	                if (response.data.UserId != 0) {
	    	                 AuthenticationService.SetCredentials(vm.username, vm.password, response.data.UserId);
	    	                 $location.path('/');
	                	} else {
	                		FlashService.Error("Username and Password do not match");
		                    vm.dataLoading = false;
	                	}
	            });
        }
    }

})();
