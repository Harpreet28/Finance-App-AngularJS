(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;
        getSecurityQuestionList();
        
        function getSecurityQuestionList(){
        		console.log("Inside register controller");
        		vm.dataLoading = true;
             UserService.GetSecurityQuestions()
                 .then(function (response) {
                     if (response.success) {
                    	 	vm.questionsListOne = response.data;
                    	 	vm.questionsListTwo = response.data;
                     } else {
                         FlashService.Error(response.message);	
                     }
                 });
             vm.dataLoading = false;
        }

        function register() {
            vm.dataLoading = true;
            vm.user.QuestionId1 = vm.Question1.QuestionId;
            vm.user.QuestionId2 = vm.Question2.QuestionId;
            UserService.RegisterUser(vm.user)
                .then(function (response) {
                    if (response.success) {
                    		console.log(response.data);
                    		if (response.data === -1) {
                    			FlashService.Error('A username is already present with the same name. Please enter another username', true);
                    			vm.dataLoading = false;
                    		} else {
	                        FlashService.Success('Registration successful', true);
	                        $location.path('/login');
                    		}
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
        
    }

})();
