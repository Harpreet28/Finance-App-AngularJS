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
                    	 console.log(response.data[0]);
                    	 	vm.questionsListOne = response.data;
                    	 	vm.questionsListTwo = response.data;
                     } else {
                         FlashService.Error(response.message);	
                     }
                 });
        }

        function register() {
            vm.dataLoading = true;
            vm.user.QuestionId1 = vm.user.Question1.QuestionId;
            vm.user.QuestionId2 = vm.user.Question2.QuestionId;
            UserService.RegisterUser(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();
